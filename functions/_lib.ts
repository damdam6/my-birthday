import { neon } from '@neondatabase/serverless'

// Cloudflare Pages 환경변수 바인딩
export interface Env {
  DATABASE_URL: string
  SUPPORTER_CODE: string // 계좌 공개 + 이름 등록에 필요한 공용 비밀코드
  ADMIN_CODE: string // 진행률을 수동 갱신할 때 쓰는 관리자 코드
  ACCOUNT_INFO: string // 공개할 계좌 문자열 (예: "카카오뱅크 3333-00-0000000 홍길동")
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export const db = (env: Env) => neon(env.DATABASE_URL)

// 요청 본문을 안전하게 JSON으로 파싱
export async function readJson(
  request: Request,
): Promise<Record<string, unknown>> {
  try {
    const data = await request.json()
    return (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  } catch {
    return {}
  }
}
