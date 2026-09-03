# Git & GitHub Workflow for Sunrise Dental Clinic

This document outlines the version control strategy used for the Sunrise Dental Clinic project.

## 1. Branching Strategy
We use a **Feature Branch Workflow** which allows multiple developers to work independently without disrupting the main codebase.

- **`master` / `main` branch**: The stable, production-ready version of the application. Commits here are exclusively merges from feature branches.
- **`feature/*` branches**: All new development happens here. Examples:
  - `feature/phase1-backend`
  - `feature/phase2-frontend`

## 2. Typical Workflow
When developing a new feature:

1. **Ensure you are up to date:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a new feature branch:**
   ```bash
   git checkout -b feature/appointment-booking
   ```
3. **Make changes and commit often:**
   ```bash
   git add .
   git commit -m "Feat: Add appointment booking UI component"
   ```
4. **Push the branch to GitHub:**
   ```bash
   git push origin feature/appointment-booking
   ```
5. **Create a Pull Request (PR):**
   On GitHub, open a PR from `feature/appointment-booking` to `main`. Once reviewed and approved, merge it.

## 3. Version Tagging
When a significant milestone or release is completed, we tag the commit in `main` to mark the release version.
```bash
git tag v1.0
git push origin v1.0
```

## 4. Current Repository State
The local repository has been initialized with the following structure:
- `v1.0` tag: Represents the completed Spring Boot Backend architecture and APIs.
- `v1.1` tag: Represents the completed React Vite Frontend UI integration.
- `v1.2` tag: Documentation and testing suite completion.
