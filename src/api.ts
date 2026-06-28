// 프론트엔드 ↔ Cloudflare Functions 통신

async function parse<T>(res: Response): Promise<T> {
  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error || `오류 (${res.status})`)
  }
  if (data == null) throw new Error('서버 응답을 해석하지 못했어요')
  return data as T
}

// 모금 현황 (관리자가 수동으로 갱신) — 목표/모은 금액(원)과 진행률(%)
export interface Status {
  goal: number
  raised: number
  percent: number
}
export async function fetchStatus(): Promise<Status> {
  return parse(await fetch('/api/status'))
}

export interface Supporter {
  name: string
  message: string | null
}

// 승인된 후원자 목록 (엔딩 크레딧용) — 이름 + 한마디
export async function fetchSupporters(): Promise<{ supporters: Supporter[] }> {
  return parse(await fetch('/api/supporters'))
}

// 비밀코드 검증 → 계좌번호 공개
export async function revealAccount(code: string): Promise<{ account: string }> {
  return parse(
    await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }),
  )
}

// 후원자 등록 (비밀코드 필요) — 이름 + 한마디. 관리자 승인 전까지는 비공개.
export async function addSupporter(
  code: string,
  name: string,
  message: string,
): Promise<{ ok: true }> {
  return parse(
    await fetch('/api/supporters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name, message }),
    }),
  )
}

// ─── 관리자용 ───
export interface PendingSupporter {
  id: number
  name: string
  message: string | null
  created_at: string
}

export async function adminListSupporters(
  adminCode: string,
): Promise<{ pending: PendingSupporter[] }> {
  return parse(
    await fetch('/api/admin/supporters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminCode, action: 'list' }),
    }),
  )
}

export async function adminModerateSupporter(
  adminCode: string,
  id: number,
  action: 'approve' | 'reject',
): Promise<{ ok: true }> {
  return parse(
    await fetch('/api/admin/supporters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminCode, action, id }),
    }),
  )
}

// (관리자) 모금 현황 수동 갱신 — 목표/모은 금액(원). 진행률은 서버가 계산해 반환.
export async function setProgress(
  adminCode: string,
  goal: number,
  raised: number,
): Promise<{ ok: true; goal: number; raised: number; percent: number }> {
  return parse(
    await fetch('/api/admin/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminCode, goal, raised }),
    }),
  )
}
