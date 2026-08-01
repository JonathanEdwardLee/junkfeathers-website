<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

const JF_CONTACT_MAX_BODY_BYTES = 16384;
const JF_CONTACT_MIN_COMPLETION_MS = 3000;
const JF_CONTACT_MAX_FORM_AGE_MS = 3600000;
const JF_CONTACT_TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const JF_CONTACT_FROM_EMAIL = 'hello@junkfeathers.com';
const JF_CONTACT_FROM_NAME = 'Jonathan at Junkfeathers';
const JF_CONTACT_RECIPIENT = 'contact@junkfeathers.com';
const JF_CONTACT_SMTP_HOST = 'smtp.hostinger.com';
const JF_CONTACT_SMTP_PORT = 587;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

function jf_contact_respond(int $status, string $code): void
{
    http_response_code($status);
    echo json_encode(['ok' => $status >= 200 && $status < 300, 'code' => $code], JSON_UNESCAPED_SLASHES);
    exit;
}

function jf_contact_log(string $event, string $requestId): void
{
    error_log(sprintf('[jf-contact] %s request=%s', $event, $requestId));
}

function jf_contact_config_string(array $config, string $key): ?string
{
    $value = $config[$key] ?? null;
    if (!is_string($value) || trim($value) === '') {
        return null;
    }

    return trim($value);
}

function jf_contact_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function jf_contact_normalize(string $value): string
{
    return str_replace(["\r\n", "\r"], "\n", trim($value));
}

function jf_contact_path_is_inside(string $candidate, string $parent): bool
{
    $normalizedParent = rtrim($parent, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    return $candidate === rtrim($parent, DIRECTORY_SEPARATOR)
        || strpos($candidate, $normalizedParent) === 0;
}

function jf_contact_rate_limit(string $storagePath, string $sourceKey, array $limits): string
{
    $handle = @fopen($storagePath, 'c+');
    if ($handle === false) {
        return 'unavailable';
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return 'unavailable';
        }

        rewind($handle);
        $raw = stream_get_contents($handle);
        if ($raw === false) {
            return 'unavailable';
        }

        if ($raw === '') {
            $state = ['sources' => [], 'global' => []];
        } else {
            $state = json_decode($raw, true);
            if (!is_array($state) || !is_array($state['sources'] ?? null) || !is_array($state['global'] ?? null)) {
                return 'unavailable';
            }
        }

        $now = time();
        $shortWindow = max(60, (int) ($limits['short_window_seconds'] ?? 900));
        $dayWindow = max($shortWindow, (int) ($limits['day_window_seconds'] ?? 86400));
        $globalWindow = max(60, (int) ($limits['global_window_seconds'] ?? 3600));
        $shortLimit = max(1, (int) ($limits['short_limit'] ?? 3));
        $dayLimit = max($shortLimit, (int) ($limits['day_limit'] ?? 10));
        $globalLimit = max($dayLimit, (int) ($limits['global_limit'] ?? 120));

        $sourceTimes = is_array($state['sources'][$sourceKey] ?? null)
            ? $state['sources'][$sourceKey]
            : [];
        $sourceTimes = array_values(array_filter($sourceTimes, static function ($timestamp) use ($now, $dayWindow): bool {
            return is_int($timestamp) && $timestamp >= $now - $dayWindow && $timestamp <= $now + 30;
        }));
        $globalTimes = array_values(array_filter($state['global'], static function ($timestamp) use ($now, $globalWindow): bool {
            return is_int($timestamp) && $timestamp >= $now - $globalWindow && $timestamp <= $now + 30;
        }));

        $shortCount = count(array_filter($sourceTimes, static function (int $timestamp) use ($now, $shortWindow): bool {
            return $timestamp >= $now - $shortWindow;
        }));

        if ($shortCount >= $shortLimit || count($sourceTimes) >= $dayLimit || count($globalTimes) >= $globalLimit) {
            return 'limited';
        }

        $sourceTimes[] = $now;
        $globalTimes[] = $now;
        $state['sources'][$sourceKey] = $sourceTimes;
        $state['global'] = $globalTimes;

        foreach ($state['sources'] as $key => $timestamps) {
            if (!is_array($timestamps)) {
                unset($state['sources'][$key]);
                continue;
            }

            $fresh = array_values(array_filter($timestamps, static function ($timestamp) use ($now, $dayWindow): bool {
                return is_int($timestamp) && $timestamp >= $now - $dayWindow && $timestamp <= $now + 30;
            }));
            if ($fresh === []) {
                unset($state['sources'][$key]);
            } else {
                $state['sources'][$key] = $fresh;
            }
        }

        $encoded = json_encode($state, JSON_UNESCAPED_SLASHES);
        if (!is_string($encoded)) {
            return 'unavailable';
        }

        rewind($handle);
        if (!ftruncate($handle, 0) || fwrite($handle, $encoded) !== strlen($encoded) || !fflush($handle)) {
            return 'unavailable';
        }

        return 'ok';
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

$requestId = bin2hex(random_bytes(8));

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    jf_contact_respond(405, 'unavailable');
}

if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'JunkfeathersContact') {
    jf_contact_respond(403, 'unavailable');
}

$documentRootValue = $_SERVER['DOCUMENT_ROOT'] ?? '';
$documentRoot = is_string($documentRootValue) ? realpath($documentRootValue) : false;
if ($documentRoot === false) {
    jf_contact_log('document_root_unavailable', $requestId);
    jf_contact_respond(503, 'unavailable');
}

$runtimeOverride = getenv('JF_CONTACT_RUNTIME_DIR');
$runtimeCandidate = is_string($runtimeOverride) && trim($runtimeOverride) !== ''
    ? trim($runtimeOverride)
    : dirname($documentRoot) . DIRECTORY_SEPARATOR . 'junkfeathers-contact-runtime';
$runtimeDir = realpath($runtimeCandidate);

if ($runtimeDir === false || jf_contact_path_is_inside($runtimeDir, $documentRoot)) {
    jf_contact_log('runtime_directory_unavailable', $requestId);
    jf_contact_respond(503, 'unavailable');
}

$configPath = $runtimeDir . DIRECTORY_SEPARATOR . 'config.php';
$autoloadPath = $runtimeDir . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

if (!is_file($configPath) || !is_readable($configPath) || !is_file($autoloadPath) || !is_readable($autoloadPath)) {
    jf_contact_log('runtime_files_unavailable', $requestId);
    jf_contact_respond(503, 'unavailable');
}

try {
    $config = require $configPath;
    require_once $autoloadPath;
} catch (Throwable $exception) {
    jf_contact_log('runtime_load_failed', $requestId);
    jf_contact_respond(503, 'unavailable');
}

if (!is_array($config) || ($config['enabled'] ?? false) !== true || !class_exists(PHPMailer::class)) {
    jf_contact_log('contact_disabled_or_runtime_invalid', $requestId);
    jf_contact_respond(503, 'unavailable');
}

$allowedOrigin = jf_contact_config_string($config, 'allowed_origin');
$turnstileSecret = jf_contact_config_string($config, 'turnstile_secret');
$turnstileHostname = jf_contact_config_string($config, 'turnstile_hostname');
$turnstileAction = jf_contact_config_string($config, 'turnstile_action');
$smtpUsername = jf_contact_config_string($config, 'smtp_username');
$smtpPassword = jf_contact_config_string($config, 'smtp_password');
$rateLimitSalt = jf_contact_config_string($config, 'rate_limit_salt');
$rateLimitStorage = jf_contact_config_string($config, 'rate_limit_storage');
$rateLimits = is_array($config['rate_limits'] ?? null) ? $config['rate_limits'] : [];

if (
    $allowedOrigin === null
    || $turnstileSecret === null
    || $turnstileHostname === null
    || $turnstileAction !== 'contact'
    || $smtpUsername !== JF_CONTACT_FROM_EMAIL
    || $smtpPassword === null
    || $rateLimitSalt === null
    || strlen($rateLimitSalt) < 32
    || $rateLimitStorage === null
) {
    jf_contact_log('runtime_config_invalid', $requestId);
    jf_contact_respond(503, 'unavailable');
}

$rateLimitDirectory = realpath(dirname($rateLimitStorage));
if (
    $rateLimitDirectory === false
    || jf_contact_path_is_inside($rateLimitDirectory, $documentRoot)
    || !is_writable($rateLimitDirectory)
) {
    jf_contact_log('rate_limit_directory_invalid', $requestId);
    jf_contact_respond(503, 'unavailable');
}

$isHttps = (isset($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) === 'on')
    || (int) ($_SERVER['SERVER_PORT'] ?? 0) === 443;
$requestHost = strtolower(preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? '')) ?? '');
$origin = rtrim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''), '/');

if (!$isHttps || $requestHost !== strtolower($turnstileHostname) || !hash_equals(rtrim($allowedOrigin, '/'), $origin)) {
    jf_contact_respond(403, 'unavailable');
}

$contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentType !== 'application/json' || $contentLength <= 0 || $contentLength > JF_CONTACT_MAX_BODY_BYTES) {
    jf_contact_respond(413, 'validation');
}

$rawBody = file_get_contents('php://input', false, null, 0, JF_CONTACT_MAX_BODY_BYTES + 1);
if (!is_string($rawBody) || strlen($rawBody) === 0 || strlen($rawBody) > JF_CONTACT_MAX_BODY_BYTES) {
    jf_contact_respond(413, 'validation');
}

try {
    $payload = json_decode($rawBody, true, 8, JSON_THROW_ON_ERROR);
} catch (Throwable $exception) {
    jf_contact_respond(400, 'validation');
}

if (!is_array($payload)) {
    jf_contact_respond(400, 'validation');
}

$allowedKeys = ['name', 'email', 'message', 'company', 'started_at', 'turnstile_token'];
if (array_diff(array_keys($payload), $allowedKeys) !== []) {
    jf_contact_respond(400, 'validation');
}

foreach (['name', 'email', 'message', 'company', 'turnstile_token'] as $key) {
    if (!array_key_exists($key, $payload) || !is_string($payload[$key])) {
        jf_contact_respond(400, 'validation');
    }
}

if (!array_key_exists('started_at', $payload) || !is_numeric($payload['started_at'])) {
    jf_contact_respond(400, 'validation');
}

$name = jf_contact_normalize($payload['name']);
$email = trim($payload['email']);
$message = jf_contact_normalize($payload['message']);
$company = trim($payload['company']);
$turnstileToken = trim($payload['turnstile_token']);
$startedAt = (int) $payload['started_at'];
$elapsedMs = (int) floor(microtime(true) * 1000) - $startedAt;

$safeName = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $name);
if ($safeName === null) {
    jf_contact_respond(400, 'validation');
}
$safeName = trim((string) preg_replace('/\s+/u', ' ', $safeName));

if (
    jf_contact_length($safeName) > 100
    || strlen($email) > 254
    || preg_match('/[\r\n\x00]/', $email) === 1
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || jf_contact_length($message) < 10
    || jf_contact_length($message) > 5000
) {
    jf_contact_respond(422, 'validation');
}

if ($company !== '' || $elapsedMs < JF_CONTACT_MIN_COMPLETION_MS || $elapsedMs > JF_CONTACT_MAX_FORM_AGE_MS) {
    jf_contact_respond(400, 'verification');
}

if ($turnstileToken === '' || strlen($turnstileToken) > 2048 || !function_exists('curl_init')) {
    jf_contact_respond(400, 'verification');
}

$remoteAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$sourceKey = hash_hmac('sha256', $remoteAddress, $rateLimitSalt);

$verificationHandle = curl_init(JF_CONTACT_TURNSTILE_URL);
if ($verificationHandle === false) {
    jf_contact_respond(503, 'unavailable');
}

curl_setopt_array($verificationHandle, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'secret' => $turnstileSecret,
        'response' => $turnstileToken,
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
]);

$verificationBody = curl_exec($verificationHandle);
$verificationStatus = (int) curl_getinfo($verificationHandle, CURLINFO_RESPONSE_CODE);
curl_close($verificationHandle);

if (!is_string($verificationBody) || $verificationStatus !== 200) {
    jf_contact_log('siteverify_transport_failed', $requestId);
    jf_contact_respond(503, 'unavailable');
}

$verification = json_decode($verificationBody, true);
$challengeTime = is_array($verification) && is_string($verification['challenge_ts'] ?? null)
    ? strtotime($verification['challenge_ts'])
    : false;

if (
    !is_array($verification)
    || ($verification['success'] ?? false) !== true
    || !is_string($verification['hostname'] ?? null)
    || strtolower($verification['hostname']) !== strtolower($turnstileHostname)
    || !is_string($verification['action'] ?? null)
    || !hash_equals($turnstileAction, $verification['action'])
    || $challengeTime === false
    || $challengeTime < time() - 300
    || $challengeTime > time() + 30
) {
    jf_contact_log('siteverify_rejected', $requestId);
    jf_contact_respond(400, 'verification');
}

$rateLimitResult = jf_contact_rate_limit($rateLimitStorage, $sourceKey, $rateLimits);
if ($rateLimitResult === 'limited') {
    jf_contact_respond(429, 'rate_limited');
}
if ($rateLimitResult !== 'ok') {
    jf_contact_log('rate_limit_storage_failed', $requestId);
    jf_contact_respond(503, 'unavailable');
}

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = JF_CONTACT_SMTP_HOST;
    $mail->Port = JF_CONTACT_SMTP_PORT;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->Timeout = 12;
    $mail->SMTPDebug = 0;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->setFrom(JF_CONTACT_FROM_EMAIL, JF_CONTACT_FROM_NAME, false);
    $mail->addAddress(JF_CONTACT_RECIPIENT);
    $mail->addReplyTo($email, $safeName !== '' ? $safeName : $email);
    $mail->Subject = 'Junkfeathers website contact';
    $mail->isHTML(false);
    $mail->Body = implode("\n", [
        'Junkfeathers website contact',
        'Request: ' . $requestId,
        'Name: ' . ($safeName !== '' ? $safeName : '(not provided)'),
        'Email: ' . $email,
        '',
        'Message:',
        $message,
    ]);
    $mail->send();
} catch (Throwable $exception) {
    jf_contact_log('smtp_delivery_failed', $requestId);
    jf_contact_respond(502, 'delivery_failed');
}

jf_contact_respond(200, 'sent');
