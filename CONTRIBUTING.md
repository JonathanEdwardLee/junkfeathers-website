# Contributing to Junkfeathers Website

As a private, proprietary repository, contributions are strictly limited to authorized DevAI tools and developers assigned by Jonathan Edward Lee.

All DevAI tools must read and adhere to [AGENTS.md](AGENTS.md) and verify the active exchange (`Council-DevAI-Exchange.zip`) before performing any work.

## Contribution Workflow

1. **Verify the Active Exchange and AGENTS.md**:
   The DevAI tool must verify the local active exchange and follow the working procedure in [AGENTS.md](AGENTS.md).
2. **Create a Task Branch**:
   All modifications must be developed on a task branch branched from clean `main`:
   ```text
   task/NNN-short-description
   ```
3. **Execute Scoped Changes**:
   Only edit files authorized by the active exchange.
4. **Local Auditing**:
   Before opening a pull request, run the following verification checks:
   ```bash
   cd web
   npm run check
   npm run build
   ```
   Verify that the repository remains free of forbidden secrets, files, and communication/exchange artifacts:
   ```powershell
   .\scripts\verify-repository.ps1
   ```
5. **Open a Pull Request**:
   Target the `main` branch. Provide detailed summaries of changes, screenshots of UI updates, accessibility/performance details, and rollback steps using the pull request template.
6. **Review & Merge**:
   The pull request must be reviewed by the Website Council. Only the founder (Jonathan Lee) holds final merge authority to merge pull requests into `main`.
7. **No Production Deployment**:
   Merging a pull request does NOT trigger production deployment. Deployment is a separate, manually authorized release workflow.
