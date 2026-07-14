# Repository Scripts

This folder contains utility scripts to support local development, repository verification, and site synchronization.

---

## 1. Script Inventory

### `sync-config.example.ps1`
A template file for local configuration. This file is tracked in Git. Developers copy this to `sync-config.local.ps1` (which is ignored by Git) and edit it to point to their local WordPress install paths.

### `sync-to-local.ps1`
A guarded synchronization script that copies custom code assets from this standalone repository to the local runtime workspace. It performs extensive path checks, runs in dry-run mode by default, and backs up the destination before writing.

### `verify-repository.ps1`
A self-contained security and structure check script. It lists all files in the repository, validates that no secrets, database backups, or forbidden core files are tracked, and scans code for passwords or private keys.

---

## 2. Execution Guidelines

All scripts are written in PowerShell. Before running them on Windows, you may need to set the execution policy in your terminal session:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
To run the verification checks:
```powershell
.\scripts\verify-repository.ps1
```
To run the sync in preview mode:
```powershell
.\scripts\sync-to-local.ps1
```
To apply the sync to your Local WordPress site:
```powershell
.\scripts\sync-to-local.ps1 -Apply
```
