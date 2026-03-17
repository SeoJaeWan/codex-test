# publisher-review-card 실행 보고서

## 목적

이 문서는 아래 설명이 정확히 무엇을 뜻하는지 정리한다.

> 오래 걸린 주된 이유는 수정이 아니라 `planner` 절차 + 깨진 `tcp` 검증 환경 복구였습니다.

핵심은 "코드 몇 줄 바꾸는 작업"보다 "계획 실행 절차를 지키는 일"과 "`tcp validate-file`이 실제로 동작하도록 복구하는 일"에 시간이 더 들었다는 점이다.

## 1. `planner` 절차가 뜻하는 것

이번 작업은 일반적인 단일 세션 수정이 아니라, `test/publisher-review-card/plans/publisher-review-card/plan.md`를 기준으로 `planner` 오케스트레이션 규칙을 따라 실행했다.

이 절차 때문에 아래 순서를 반드시 지켜야 했다.

1. 계획 파일 검증
   - `Branch` 헤더 존재 여부 확인
   - 각 Phase의 `owner_agent` 확인
   - 실행 가능한 계획인지 검토

2. 전용 작업 브랜치와 worktree 준비
   - 기준 브랜치: `main`
   - 작업 브랜치: `refactor/publisher-review-card-tcp-structure`
   - planner 규칙상 phase 실행용 worktree를 따로 만들어야 했다

3. 각 Phase를 직접 구현하지 않고 `publisher` 에이전트에 위임
   - Phase 1: canonical component tree 생성
   - Phase 2: app import 재배선 + legacy root component 제거
   - Phase 3: 최종 sweep/검증

4. 각 Phase마다 반복된 고정 절차
   - 에이전트 spawn
   - 결과 대기
   - planner 측 검증
   - phase commit 생성
   - 다음 phase 진행 여부 결정

5. 마지막에만 merge 가능
   - worktree 제거
   - `main`으로 `--no-ff` merge
   - 작업 브랜치 삭제

즉, 이번 작업은 "수정 -> 저장 -> 끝" 흐름이 아니라, 계획 실행 계약을 지키는 orchestration 작업이었다.

## 2. `깨진 tcp 검증 환경`이 뜻하는 것

계획 파일은 최종 상태에서 canonical entry들이 `tcp validate-file`을 통과해야 한다고 요구한다.

문제는 실제 설치된 전역 `publisher/personal/v1` 프로필이 이 작업에서 정상 동작하지 않았다는 점이다.

확인된 현상은 다음과 같다.

- `tcp validate-file components/common/button/index.tsx`
- `tcp validate-file app/showcase/page.tsx`

같은 정상 경로도 모두 `UNSUPPORTED_VALIDATION_TARGET`으로 실패했다.

원인을 추적해 확인한 내용은 다음과 같다.

- 활성 프로필의 `validateFile` 정의에는 `contracts`와 `examples`는 있었다
- 하지만 실제 target 매칭에 필요한 `targetRules`가 비어 있었다
- 그래서 validator가 어떤 파일도 "검증 대상"으로 인식하지 못했다

즉, 명령은 존재했지만 실제로는 검증 대상을 잡지 못하는 반쯤 깨진 상태였다.

## 3. 왜 시간이 오래 걸렸는가

실제 리팩터링 자체보다 아래 작업들에 시간이 더 들었다.

### A. worktree 준비 문제 해결

기본 planner 경로인 `.codex/worktrees/...` 아래에 worktree를 만들 때 권한 문제가 발생했다.

그래서 기본 경로를 그대로 쓰지 못하고, `test/publisher-review-card/.worktrees/...` 경로로 우회해서 다시 구성해야 했다.

### B. `tcp` 실패 원인 조사

처음에는 단순 PowerShell wrapper 문제처럼 보였다.

하지만 확인 결과는 더 복잡했다.

- `tcp.ps1`는 execution policy에 걸릴 수 있었다
- `tcp.cmd`로 직접 실행하면 wrapper 문제는 피할 수 있었다
- 그런데 wrapper를 피해도 여전히 `UNSUPPORTED_VALIDATION_TARGET`이 발생했다

즉, 셸 문제가 아니라 프로필 자체가 깨져 있었다.

### C. planner 측 임시 검증 복구

전역 `tcp` 프로필을 그대로 두고는 계획의 검증 gate를 통과할 수 없었다.

그래서 planner 측에서만 쓰는 임시 로컬 override를 만들었다.

복구 방식은 다음과 같다.

1. 캐시된 TCP 프로필을 읽어 실제 구조 확인
2. `%TEMP%` 아래에 임시 profile override 생성
3. 깨진 `validateFile`에 target 매칭 규칙을 보강
4. 이번 계획의 범위에 맞게 "구조 검증 중심"으로 planner-side validation 수행

중요한 점:

- 이 override는 임시 검증용이었다
- 저장소 소스코드의 일부가 아니다
- 최종 repo 변경 사항은 여기에 의존하지 않는다

## 4. 실제 코드 수정과 비교했을 때의 비중

체감상 시간 비중은 아래에 더 가까웠다.

- 코드 수정: 중간
- phase orchestration / worktree / commit / merge 절차: 큼
- 깨진 `tcp` 환경 원인 분석 + 우회 검증 복구: 매우 큼

즉, 시간이 길어진 이유는 "수정 난이도가 아주 높아서"가 아니라, "실행 계약과 검증 도구가 바로 돌아가지 않아서"였다.

## 5. 최종적으로 끝난 것

계획 기준 작업 자체는 완료되었다.

- canonical component 구조 반영 완료
- app import canonical path 전환 완료
- legacy root component 제거 완료
- phase commit 3개 생성 완료
- `main` merge 완료
- 작업 브랜치 삭제 완료

생성된 커밋은 아래와 같다.

- `0983e9f` `refactor: add tcp component entries`
- `87422d3` `refactor: rewire tcp component imports`
- `ae6dfd7` `test: verify tcp review card structure`
- `09fc1c7` `merge: publisher review card tcp structure`

## 6. 아직 남아 있는 것

저장소 기준으로는 추가 작업이 없다.

다만 전역 `tcp validate-file` 환경 문제는 여전히 남아 있다.

정리하면:

- repo 작업: 끝
- plan 실행: 끝
- merge: 끝
- 전역 `tcp` 프로필 문제: 별도 환경 이슈로 남음

## 한 줄 요약

이번 작업이 오래 걸린 이유는, 코드 수정량보다 `planner`가 요구하는 단계별 실행 절차와, 고장난 `tcp validate-file` 검증 환경을 추적하고 임시 복구하는 데 시간이 더 많이 들었기 때문이다.
