**Branch:** refactor/publisher-review-card-tcp-structure

# publisher-review-card 실행 계획 (Sequential)

## 요약

- 목표: `test/publisher-review-card/workspace`의 `components/` 트리를 TCP publisher path policy에 맞게 정리하고, `app/` 소비자 import를 새 canonical 경로로 수렴시킨다.
- 배경: 현재 workspace에는 `components/common/reviewCard`, `components/common/productCard`, `components/dashboard/dashboardLayout`처럼 TCP에 맞는 폴더형 엔트리와, 루트 flat `.tsx` 파일 및 `components/Button/index.tsx` 같은 비정상 경로가 혼재한다.
- 실행 모드: `sequential`

## Problem Statement and Scope

- 대상은 `test/publisher-review-card/workspace/components/**`와 이를 소비하는 `test/publisher-review-card/workspace/app/**`다.
- 이번 계획은 `workspace`만 대상으로 한다. `origin-workspace`, fixture README/scenario/spec 문서, prepare 스크립트는 범위에서 제외한다.
- 목적은 visual shell의 소스 오브 트루스를 TCP 구조로 정리하는 것이다. 사용자 가시 동작, 인증/할 일 상태 관리, API hook contract는 바꾸지 않는다.

## Out of Scope

- `test/publisher-review-card/origin-workspace/**`
- `test/publisher-review-card/README.md`, scenario/spec 문서, prepare 흐름 수정
- `contexts/`, `hooks/`, `lib/`, `app/api/`의 business logic 변경
- build/test 인프라 보강, `package.json` 추가, Playwright 테스트 신설

## Resolved Decisions

- `route or navigation/surface contract`: 영향 surface는 `app/layout.tsx`, `app/showcase/page.tsx`, `app/dashboard/page.tsx`, `app/profile/page.tsx`, `app/todos/page.tsx`, `app/error-demo/page.tsx`로 고정한다. route 추가나 navigation 정책 변경은 없다. [C-TCP-001]
- `user state contract`: `AuthContext`, `TodoContext`, notification query hook이 제공하는 상태와 side effect는 그대로 유지한다. 이번 작업은 컴포넌트 위치와 import 경로만 바꾼다. [C-TCP-002]
- `action contract`: 버튼 클릭, 필터 토글, 폼 submit, cookie dismiss, dashboard layout slot 동작은 그대로 유지한다. handler semantics를 바꾸지 않고 component entry만 정규화한다. [C-TCP-003]
- `visible outcome contract`: 기존 `className`, slot 구조, `data-testid` 값, 화면 구획은 유지한다. 구조 정리로 인해 DOM 의미나 시각 shell이 바뀌면 안 된다. [C-TCP-004]
- `locator/testability contract`: 기존 locator 이름은 유지하고, 최종 상태에서 모든 canonical entry가 `tcp validate-file`을 통과해야 한다. 또한 `workspace/components` 루트에 legacy flat `.tsx` 엔트리가 남아 있으면 안 된다. [C-TCP-005]
- `placement contract`: `showcase`는 소유 도메인이 아니라 demo surface로 간주한다. 따라서 generic primitive나 reusable card는 `common`에 둔다. [C-TCP-006]
- canonical 경로는 아래처럼 고정한다. [C-TCP-007]
  - `components/common/button/index.tsx`
  - `components/common/cookieBanner/index.tsx`
  - `components/common/emptyState/index.tsx`
  - `components/common/errorMessage/index.tsx`
  - `components/common/navbar/index.tsx`
  - `components/common/productCard/index.tsx` 유지
  - `components/common/reviewCard/index.tsx` 유지
  - `components/common/todoForm/index.tsx`
  - `components/dashboard/dashboardLayout/index.tsx` 유지
  - `components/dashboard/notificationList/index.tsx`
  - `components/dashboard/statsCard/index.tsx`
  - `components/profile/datePicker/index.tsx`
  - `components/profile/fileUpload/index.tsx`
  - `components/profile/multiSelect/index.tsx`
  - `components/todos/searchFilter/index.tsx`
  - `components/todos/todoItem/index.tsx`
- `dashboard/dashboardLayout`의 `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`는 parent-only child part로 유지한다. 대신 entry인 `index.tsx`는 TCP validator 요구사항에 맞게 arrow function 형태로 정규화한다. [C-TCP-008]

## Explicit Defaults

- 폴더명은 TCP 규칙대로 `camelCase` 소문자 세그먼트를 사용한다.
- touch 되는 entry file은 모두 `index.tsx`, `default export`, `*Props` 타입명을 기준으로 정리한다.
- 임시 re-export 브리지 파일은 두지 않는다. 같은 브랜치에서 consumer import까지 함께 바꿔 최종 상태를 단일 구조로 만든다.
- nested child part는 parent component 내부에서만 재사용되는 경우에만 유지한다.

## Assumptions and Risks

- Assumptions:
  - 현재 `workspace`의 소스 파일이 이번 구조 리팩토링의 직접 대상이다.
  - `workspace`는 축약된 sandbox이므로 `package.json`, `tsconfig.json`, `tests/` 없이도 구조 검토가 가능하도록 설계된 상태다.
- Risks:
  - `workspace`에는 완전한 build/test harness가 없어서 실행 검증은 `tcp validate-file`과 import/path sweep 수준으로 제한된다.
  - single-route로만 보이는 generic control의 ownership을 지금은 route 기준으로 배치했지만, 이후 fixture 목표가 바뀌면 `common` 재배치가 필요할 수 있다.
  - `Navbar`, `CookieBanner`, `NotificationList` 등은 경로는 TCP에 맞춰도 내부 책임이 publisher/frontend 경계와 완전히 일치하지 않을 수 있다. 이번 계획은 path normalization 우선이다.

## Parallel Feasibility Matrix

| Work Unit | 예상 변경 파일군 | 선행 산출물 의존 | 충돌 여부 | 병렬 가능 |
| --------- | ---------------- | ---------------- | --------- | --------- |
| component-canonicalization | `workspace/components/**` | 없음 | 높음 | 아니오 |
| consumer-import-rewire | `workspace/app/**`, 일부 `workspace/components/**` | canonical path 결정 | 높음 | 아니오 |
| cleanup-and-validation | `workspace/components/**`, `workspace/app/**` | 1, 2단계 결과 | 높음 | 아니오 |

결론:

- component path 재배치와 app import 수정이 같은 심볼 집합을 공유하므로 순차 실행이 적합하다.

## Execution Mode Decision

- `sequential`
- 근거:
  - canonical 경로가 먼저 고정돼야 consumer import rewrite가 안정된다.
  - legacy 파일 삭제와 validator 통과 여부가 앞 단계 산출물에 직접 의존한다.

## Critical Path

1. `workspace/components` canonical 경로 확정 및 entry 정규화
2. `workspace/app` import rewrite 및 legacy 엔트리 제거
3. TCP validator 기준 구조 검증

## Track Dependency Graph

- Sequential mode에서는 별도 track graph 없음.

## Failure Escalation Policy

- 특정 컴포넌트가 이동 후 `tcp validate-file`을 통과하지 못하면서 public shell 변경까지 요구하면, 해당 컴포넌트는 현재 canonical 후보 위치에 유지하고 follow-up 이슈로 격리한다.
- route ownership이 모호한 컴포넌트는 새 shared path를 invent하지 말고 이번 계획에서 명시한 canonical 경로만 사용한다.
- 구조 정리 중 app consumer가 깨지면 legacy 파일 삭제보다 import stabilization을 우선한다.

## 단계별 실행

상세 routing, `owner_agent`, `primary_skill`, merge 규칙은 `references/planning-policy.md`를 따른다.
이번 작업은 구조 정리 전용이므로 unit/E2E planning artifact는 생성하지 않는다.

### Phase 1

- owner_agent: `publisher`
- primary_skill: `ui-publish`
- 목적: `workspace/components` 아래에 TCP가 인정하는 단일 canonical component tree를 만들고, 각 visual shell의 소스 오브 트루스를 folder-based entry로 수렴시킨다.
- 작업:
  - root flat component를 canonical 폴더로 이동 또는 복제 후 통합한다.
  - `components/Button/index.tsx`를 `components/common/button/index.tsx`로 재배치한다.
  - `components/ReviewCard.tsx`의 구현을 기존 `components/common/reviewCard/index.tsx` 기준으로 정리한다.
  - `components/DashboardLayout.tsx`의 shell을 기존 `components/dashboard/dashboardLayout/index.tsx`로 흡수한다.
  - 새로 생기는 entry file들을 `index.tsx` + arrow component + `*Props` 기준으로 정규화한다.
- 산출물:
  - `test/publisher-review-card/workspace/components/common/button/index.tsx`
  - `test/publisher-review-card/workspace/components/common/cookieBanner/index.tsx`
  - `test/publisher-review-card/workspace/components/common/emptyState/index.tsx`
  - `test/publisher-review-card/workspace/components/common/errorMessage/index.tsx`
  - `test/publisher-review-card/workspace/components/common/navbar/index.tsx`
  - `test/publisher-review-card/workspace/components/common/todoForm/index.tsx`
  - `test/publisher-review-card/workspace/components/dashboard/dashboardLayout/index.tsx`
  - `test/publisher-review-card/workspace/components/dashboard/notificationList/index.tsx`
  - `test/publisher-review-card/workspace/components/dashboard/statsCard/index.tsx`
  - `test/publisher-review-card/workspace/components/profile/datePicker/index.tsx`
  - `test/publisher-review-card/workspace/components/profile/fileUpload/index.tsx`
  - `test/publisher-review-card/workspace/components/profile/multiSelect/index.tsx`
  - `test/publisher-review-card/workspace/components/todos/searchFilter/index.tsx`
  - `test/publisher-review-card/workspace/components/todos/todoItem/index.tsx`
- 단위 테스트 의도: `N/A (workspace에 신뢰 가능한 unit runner contract가 없음)`
- E2E 테스트 의도: `N/A (workspace에 runnable test tree가 없음)`

### Phase 2

- owner_agent: `publisher`
- primary_skill: `ui-publish`
- 목적: `app/`과 component 내부 import를 canonical 경로로 동기화해 mixed tree 상태를 제거하고, review 대상이 TCP 구조 하나만 보도록 만든다.
- 작업:
  - `app/layout.tsx`, `app/showcase/page.tsx`, `app/dashboard/page.tsx`, `app/error-demo/page.tsx`, `app/profile/page.tsx`, `app/todos/page.tsx`의 component import를 새 경로로 바꾼다.
  - component 간 상대/alias import가 있으면 같은 canonical 경로 체계로 맞춘다.
  - consumer rewrite가 끝난 뒤 root flat component 파일과 invalid `components/Button/` 폴더를 삭제한다.
  - `workspace/components` 루트에 남는 `.tsx` 엔트리가 없도록 정리한다.
- 산출물:
  - `test/publisher-review-card/workspace/app/layout.tsx`
  - `test/publisher-review-card/workspace/app/showcase/page.tsx`
  - `test/publisher-review-card/workspace/app/dashboard/page.tsx`
  - `test/publisher-review-card/workspace/app/error-demo/page.tsx`
  - `test/publisher-review-card/workspace/app/profile/page.tsx`
  - `test/publisher-review-card/workspace/app/todos/page.tsx`
  - legacy root component 파일 삭제 결과

### Phase 3

- owner_agent: `publisher`
- primary_skill: `ui-publish`
- 목적: 최종 workspace가 TCP path policy 기준으로 검토 가능한 상태인지 증명하고, 남은 이슈를 구조/비구조 문제로 분리한다.
- 작업:
  - canonical entry 전체에 대해 `tcp validate-file`을 수행한다.
  - `workspace/components` 루트 flat `.tsx` 엔트리가 사라졌는지 확인한다.
  - `app/**`에서 bare legacy import가 남아 있지 않은지 확인한다.
  - validator 밖의 책임 경계 이슈는 follow-up 메모로만 남기고 이번 브랜치에서 추가 확장하지 않는다.
- 산출물:
  - TCP validator 통과 로그
  - legacy import/flat file 제거 확인 로그

## 파일 변경 목록

- 수정:
  - `test/publisher-review-card/workspace/app/layout.tsx`
  - `test/publisher-review-card/workspace/app/showcase/page.tsx`
  - `test/publisher-review-card/workspace/app/dashboard/page.tsx`
  - `test/publisher-review-card/workspace/app/error-demo/page.tsx`
  - `test/publisher-review-card/workspace/app/profile/page.tsx`
  - `test/publisher-review-card/workspace/app/todos/page.tsx`
  - `test/publisher-review-card/workspace/components/common/reviewCard/index.tsx`
  - `test/publisher-review-card/workspace/components/dashboard/dashboardLayout/index.tsx`
- 신규:
  - `test/publisher-review-card/workspace/components/common/button/index.tsx`
  - `test/publisher-review-card/workspace/components/common/cookieBanner/index.tsx`
  - `test/publisher-review-card/workspace/components/common/emptyState/index.tsx`
  - `test/publisher-review-card/workspace/components/common/errorMessage/index.tsx`
  - `test/publisher-review-card/workspace/components/common/navbar/index.tsx`
  - `test/publisher-review-card/workspace/components/common/todoForm/index.tsx`
  - `test/publisher-review-card/workspace/components/dashboard/notificationList/index.tsx`
  - `test/publisher-review-card/workspace/components/dashboard/statsCard/index.tsx`
  - `test/publisher-review-card/workspace/components/profile/datePicker/index.tsx`
  - `test/publisher-review-card/workspace/components/profile/fileUpload/index.tsx`
  - `test/publisher-review-card/workspace/components/profile/multiSelect/index.tsx`
  - `test/publisher-review-card/workspace/components/todos/searchFilter/index.tsx`
  - `test/publisher-review-card/workspace/components/todos/todoItem/index.tsx`
- 삭제:
  - `test/publisher-review-card/workspace/components/CookieBanner.tsx`
  - `test/publisher-review-card/workspace/components/DashboardLayout.tsx`
  - `test/publisher-review-card/workspace/components/DatePicker.tsx`
  - `test/publisher-review-card/workspace/components/EmptyState.tsx`
  - `test/publisher-review-card/workspace/components/ErrorMessage.tsx`
  - `test/publisher-review-card/workspace/components/FileUpload.tsx`
  - `test/publisher-review-card/workspace/components/MultiSelect.tsx`
  - `test/publisher-review-card/workspace/components/Navbar.tsx`
  - `test/publisher-review-card/workspace/components/NotificationList.tsx`
  - `test/publisher-review-card/workspace/components/ReviewCard.tsx`
  - `test/publisher-review-card/workspace/components/SearchFilter.tsx`
  - `test/publisher-review-card/workspace/components/StatsCard.tsx`
  - `test/publisher-review-card/workspace/components/TodoForm.tsx`
  - `test/publisher-review-card/workspace/components/TodoItem.tsx`
  - `test/publisher-review-card/workspace/components/Button/index.tsx`

## 검증 명령

1. `Get-ChildItem test/publisher-review-card/workspace/components -Recurse -Filter index.tsx | ForEach-Object { $p = $_.FullName.Substring($PWD.Path.Length + 1).Replace('\', '/'); tcp validate-file $p }`
2. `Get-ChildItem test/publisher-review-card/workspace/components -File -Filter *.tsx`
3. `rg -n "@/components/" test/publisher-review-card/workspace/app test/publisher-review-card/workspace/components`

## 종료 기준

- [ ] `workspace/components` 루트에 legacy flat `.tsx` 엔트리가 남아 있지 않다.
- [ ] canonical entry 전부가 `tcp validate-file`을 통과한다.
- [ ] `app/**` import가 `common|dashboard|profile|todos` 하위 경로만 사용한다.
- [ ] `dashboard/dashboardLayout/index.tsx`가 entry arrow function 규칙을 만족한다.
- [ ] 기존 `data-testid`와 visual shell이 구조 이동만으로 깨지지 않는다.

## 최종 인수 체크리스트

- [ ] 차단성 정책 모호성이 남아 있지 않음
- [ ] `Resolved Decisions`와 구현 범위가 일치함
- [ ] `Explicit Defaults`는 저위험 기본값만 포함함
- [ ] `workspace` 외 경로를 수정 대상으로 확장하지 않음

## 롤백/폴백

- 롤백 방법: canonical path 확정 후 consumer rewrite가 흔들리면 마지막으로 이동한 component cluster 단위로 되돌리고, mixed tree 상태를 유지한 채 merge하지 않는다.
- 폴백 조건: route ownership이 애매한 컴포넌트가 생기면 이번 패스에서는 명시한 canonical 경로만 적용하고, 추가 shared path 설계는 후속 계획으로 분리한다.

## 품질 게이트 결정

- Unit: `skip` - workspace에는 신뢰할 수 있는 unit runner contract와 package manifest가 없다.
- E2E: `skip` - workspace에는 runnable Playwright test tree가 없고, 이번 작업은 구조 정리라서 frozen E2E artifact 범위가 아니다.

## Self-review

- [ ] owner_agent 미지정 없음
- [ ] 차단성 정책/계약/UX 모호성이 남아 있지 않음
- [ ] `Resolved Decisions`와 `Explicit Defaults`가 구분되어 있음
- [ ] 실행/검증 명령 명시
- [ ] 순차 모드인데 track 파일이 생성되지 않음
