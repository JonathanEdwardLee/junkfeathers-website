# Protected Contact Runtime

This directory contains public, non-secret setup metadata only. It is not copied into the generated `production` branch.

The live PHP endpoint expects a protected sibling of the document root:

`dirname($_SERVER['DOCUMENT_ROOT'])/junkfeathers-contact-runtime/`

`JF_CONTACT_RUNTIME_DIR` may point to a different absolute directory when the hosting runtime provides that environment variable. The endpoint rejects a runtime directory inside the public document root.

The protected runtime must contain:

- `config.php` — created from `config.example.php` and populated by Jonathan outside Git;
- `composer.json` — copied from this directory;
- `vendor/autoload.php` — generated with Composer;
- `data/` — writable only by the PHP account and not web-accessible.

Install the pinned mail runtime from inside the protected directory:

```sh
composer install --no-dev --classmap-authoritative
```

Required private values in `config.php` are the Turnstile secret, Hostinger SMTP password, and a random rate-limit salt. Never place `config.php`, `vendor/`, or `data/` in `public_html`, the production branch, GitHub Actions variables, chat, or the DevAI exchange.

The public Turnstile sitekey is supplied separately at Astro build time as `PUBLIC_TURNSTILE_SITE_KEY`. GitHub workflows map that value from the non-secret repository variable `JF_TURNSTILE_SITEKEY`. If the public sitekey is absent, CONTACT remains inactive in generated output.

Production requirements:

- PHP 8.1 or newer with cURL, filter, hash, and JSON extensions;
- outbound HTTPS to Cloudflare Siteverify;
- outbound authenticated SMTP to `smtp.hostinger.com` using STARTTLS on port 587;
- authenticated identity `hello@junkfeathers.com`;
- recipient `contact@junkfeathers.com`;
- runtime and rate-limit storage outside the public document root.

Rollback is immediate: set `enabled` to `false` in protected `config.php`. This makes the endpoint fail closed without changing public files.
