# publisher-review-card

`publisher` 플로우 검증용 sandbox 환경이다.

## What it tests

- visual-only 정리
- 중복 ReviewCard 구현 수렴
- `/showcase` section locator 계약
- frozen Playwright artifact 복사 및 검증

## Prepare

```powershell
./test/publisher-review-card/prepare.ps1
```

`prepare.ps1`는 `origin-workspace/`를 기준으로 `workspace/`를 재생성한다.

## Run

- Claude: `test/publisher-review-card/plans/publisher-review-card/plan.md의 Phase 1을 실행해줘`
- Codex: `/agent planner test/publisher-review-card/plans/publisher-review-card/plan.md를 실행해`

## Validate

```powershell
pnpm --dir test/publisher-review-card/workspace lint
pnpm --dir test/publisher-review-card/workspace exec playwright test tests/showcase-review-card.spec.ts
```
