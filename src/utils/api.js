const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function parseError(res) {
  try {
    const data = await res.json();
    return data.message || data.error || `요청 실패 (${res.status})`;
  } catch {
    return `요청 실패 (${res.status})`;
  }
}

// 회원가입
export async function signup({ email, password, username }) {
  const res = await fetch(`${BASE_URL}/api/members/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}

// 로그인
export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/members/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}

// 로그아웃
export async function logout() {
  const res = await fetch(`${BASE_URL}/api/members/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}

// 프로젝트 세션 생성
export async function createProject({ memberId, codeContent, githubUrl = "" }) {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, codeContent, githubUrl }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

// 사전 컨텍스트 입력 + 질문 생성
export async function submitPreContext({ memberId, sessionId, codePurpose, techRationale, exceptionHandling, projectScale = "" }) {
  const res = await fetch(`${BASE_URL}/api/projects/${sessionId}/pre-context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, sessionId, codePurpose, techRationale, exceptionHandling, projectScale }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

// 면접 최종 제출
export async function submitInterview({ sessionId, memberId, answers }) {
  const res = await fetch(`${BASE_URL}/api/projects/${sessionId}/interview/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, answers }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

// 리포트 생성
export async function generateReport({ sessionId }) {
  const res = await fetch(`${BASE_URL}/api/projects/${sessionId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

// 피드백 요청
export async function requestFeedbackApi({ questionId, memberId, answer }) {
  const res = await fetch(`${BASE_URL}/api/interview/questions/${questionId}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, answer }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}