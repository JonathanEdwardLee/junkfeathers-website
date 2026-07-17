# Contributing to Junkfeathers Website

As a private, proprietary repository, contributions are strictly limited to authorized agents and developers assigned by Jonathan Edward Lee.

## Contribution Workflow

1. **Create a Task Branch**:
   All modifications must be developed on a task branch branched from clean `main`:
   ```text
   task/NNN-short-description
   ```
2. **Execute Scoped Changes**:
   Only edit files authorized by the current task specification.
3. **Local Auditing**:
   Before opening a pull request, run the following verification checks:
   ```bash
   cd web
   npm run check
   npm run build
   ```
   Verify that the repository remains free of forbidden secrets and files:
   ```powershell
   .\scripts\verify-repository.ps1
   ```
4. **Open a Pull Request**:
   Target the `main` branch. Provide detailed summaries of changes, screenshots of UI updates, accessibility/performance details, and rollback steps using the pull request template.
5. **Review & Merge**:
   The pull request must be reviewed by the Website Council. Only Jonathan Lee is authorized to merge pull requests into `main`.
6. **No Production Deployment**:
   Merging a pull request does NOT trigger production deployment. Deployment is a separate, manually authorized release workflow.
