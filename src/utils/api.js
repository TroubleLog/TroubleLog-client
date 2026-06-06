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
