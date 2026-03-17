# frontend-profile-edit-hook

`frontend-developer` 플로우 검증용 sandbox 환경이다.

## What it tests

- `/profile` bounded surface의 hook extraction
- draft state / validation / save-cancel lifecycle 분리
- frozen Playwright artifact 복사 및 검증

## Prepare

```powershell
./test/frontend-profile-edit-hook/prepare.ps1
```

`prepare.ps1`는 `origin-workspace/`를 기준으로 `workspace/`를 재생성한다.

## Run

- Claude: `test/frontend-profile-edit-hook/plans/frontend-profile-edit-hook/plan.md의 Phase 1을 실행해줘`
- Codex: `/agent planner test/frontend-profile-edit-hook/plans/frontend-profile-edit-hook/plan.md를 실행해`

## Validate

```powershell
pnpm --dir test/frontend-profile-edit-hook/workspace lint
pnpm --dir test/frontend-profile-edit-hook/workspace exec playwright test tests/profile-edit-hook.spec.ts
```
