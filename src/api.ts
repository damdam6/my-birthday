export interface Pledge {
  id: number
  name: string
  amount: number
  tier: string | null
  message: string | null
  created_at: string
}

export interface PledgesResponse {
  pledges: Pledge[]
  stats: {
    total: number
    count: number
  }
}

export interface NewPledge {
  name: string
  amount: number
  tier?: string | null
  message?: string | null
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function fetchPledges(): Promise<PledgesResponse> {
  const res = await fetch('/api/pledges')
  if (!res.ok) throw new Error(`불러오기 실패 (${res.status})`)
  return res.json()
}

export async function createPledge(pledge: NewPledge): Promise<Pledge> {
  const res = await fetch('/api/pledges', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(pledge),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || `후원 실패 (${res.status})`)
  }
  return res.json()
}

export function formatWon(n: number): string {
  return n.toLocaleString('ko-KR') + '원'
}
