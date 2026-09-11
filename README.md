# TroubleLog-client

<img width="600" alt="troublelog" src="https://github.com/user-attachments/assets/fd7c6299-b033-4301-8d5a-92f2016c69e6" />

#### ㄴ Microsoft Azure 기반 AI 코드 분석을 통한 모의 면접 및 리포트 생성 플랫폼

<br />

## 주요 기능

1. 코드 및 컨텍스트 입력
    > 사용자가 작성한 코드와 개발 배경 입력

2. 코드 기반 질문 생성
    > 사용자가 작성한 코드와 개발 배경을 기반으로 AI가 면접 질문을 생성하고 답변을 돕는 AI 피드백 제공

3. 역량 점수 및 리포트 제공
    > AI 면접 질문에 대한 답변을 기반으로 역량 점수와 마크다운 복사가 가능한 트러블슈팅 리포트 생성

4. 중요 정보 입력 방지 및 보안 알림
    > 정규식 기반 코드 내 민감정보 탐지 및 경고 알림 제공

<br />

## 개발 환경
<table>
  <tr>
    <td>Library</td>
    <td>React 18</td>
  </tr>
  <tr>
    <td>Build Tool</td>
    <td>Vite 5</td>
  </tr>
  <tr>
    <td>Language</td>
    <td>JavaScript</td>
  </tr>
  <tr>
    <td>Styling</td>
    <td>Tailwind CSS</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>Vercel</td>
  </tr>
</table>

<br />

## 프로젝트 아키텍처
<table>
<td>
<img width="1285" height="780" alt="architecture" src="https://github.com/user-attachments/assets/e9c8da65-18eb-4ec1-a1fb-5f10f71bd925" />
</td>
</table>

<br />

## 사용자 흐름

1. 회원가입 및 로그인

2. 분석할 프로젝트 코드 및 사전 컨텍스트 입력

3. AI 기반 맞춤형 면접 질문 3개 생성

4. 문항별 답변 및 필요 시 AI 피드백 요청

5. 최종 제출 및 개인정보·민감정보 검증

6. 역량 점수 및 트러블슈팅 리포트 확인

<br />

## 책임 있는 AI

1. 감사로그 기록
    > 프로젝트 생성, AI 요청, 답변 제출, 로그인/회원가입의 성공·실패 이력을 별도 트랜잭션으로 저장

2. 개인 정보 Blocking
    > 소스 코드 입력 단계에서 이메일, 전화번호, 비밀번호, API Key 등을 정규식으로 탐지해 AI 요청 전 차단

3. 원문 최소 저장
    > 감사 로그에는 코드/답변 원문 대신 길이, 개수, 처리 상태 등 요약 정보만 기록

4. 프롬프트 인젝션 방어
    > `.replace()` 로 플레이스 홀더에 사용자 입력이 치환되는 구조

5. 개인정보 마스킹
    > 로그인/회원가입 로그의 이메일은 마스킹 처리 후 저장

<br />

## 프로토타입
https://github.com/user-attachments/assets/24686271-9711-48b4-870e-2732406ead8b
