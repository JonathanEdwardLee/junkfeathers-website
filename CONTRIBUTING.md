# Contributing

Junkfeathers is a founder-controlled project maintained by Jonathan Edward Lee.

Constructive bug reports, accessibility findings, and technical feedback may be submitted through GitHub Issues. Please describe the observed behavior, the relevant route or file, and clear reproduction steps. Do not include credentials, private data, production configuration, or third-party confidential material.

Unsolicited pull requests are not guaranteed review or acceptance. If a code contribution has been invited, create a focused branch, keep the change narrowly scoped, and avoid unrelated formatting or refactoring.

## Development checks

Use the Node.js version recorded in `.nvmrc`, then install and verify from the Astro application directory:

```bash
cd web
npm ci
npm run check
npm run build
```

Do not commit `node_modules/`, `web/dist/`, environment files, credentials, local configuration, subscriber data, backups, or generated archives.

By contributing, you confirm that you have the right to submit the material. Acceptance of a contribution does not change the proprietary license unless Jonathan Edward Lee provides separate written terms.
