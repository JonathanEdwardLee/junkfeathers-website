<?php

declare(strict_types=1);

return [
    // Emergency stop. Keep false until the endpoint, mailbox, and Turnstile widget are ready.
    'enabled' => false,

    'allowed_origin' => 'https://junkfeathers.com',
    'turnstile_secret' => 'REPLACE_OUTSIDE_GIT',
    'turnstile_hostname' => 'junkfeathers.com',
    'turnstile_action' => 'contact',

    // The endpoint enforces hello@junkfeathers.com as its authenticated From identity.
    'smtp_username' => 'hello@junkfeathers.com',
    'smtp_password' => 'REPLACE_OUTSIDE_GIT',

    // Use at least 32 random characters. The value never leaves the protected runtime.
    'rate_limit_salt' => 'REPLACE_WITH_RANDOM_VALUE_OUTSIDE_GIT',
    'rate_limit_storage' => __DIR__ . '/data/contact-rate-limit.json',
    'rate_limits' => [
        'short_limit' => 3,
        'short_window_seconds' => 900,
        'day_limit' => 10,
        'day_window_seconds' => 86400,
        'global_limit' => 120,
        'global_window_seconds' => 3600,
    ],
];
