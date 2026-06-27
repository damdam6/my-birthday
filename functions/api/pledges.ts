import { neon } from '@neondatabase/serverless'

interface Env {
  DATABASE_URL: string
}

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' }

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS })
}

// GET /api/pledges — 후원 목록 + 합계 통계
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.DATABASE_URL) {
    return json({ error: 'DATABASE_URL 환경변수가 설정되지 않았습니다.' }, 500)
  }
  try {
    const sql = neon(env.DATABASE_URL)
    const [pledges, stats] = await Promise.all([
      sql`
        SELECT id, name, amount, tier, message, created_at
        FROM pledges
        ORDER BY created_at DESC
        LIMIT 100
      `,
      sql`
        SELECT COALESCE(SUM(amount), 0)::bigint AS total, COUNT(*)::int AS count
        FROM pledges
      `,
    ])
    const row = stats[0] ?? { total: 0, count: 0 }
    return json({
      pledges,
      stats: { total: Number(row.total), count: Number(row.count) },
    })
  } catch (err) {
    return json(
      { error: '데이터를 불러오지 못했습니다.', detail: String(err) },
      500,
    )
  }
}

// POST /api/pledges — 새 후원 등록
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.DATABASE_URL) {
    return json({ error: 'DATABASE_URL 환경변수가 설정되지 않았습니다.' }, 500)
  }

  let body: {
    name?: unknown
    amount?: unknown
    tier?: unknown
    message?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return json({ error: '잘못된 요청 형식입니다.' }, 400)
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const amount = Number(body.amount)
  const tier =
    typeof body.tier === 'string' && body.tier.trim() ? body.tier.trim() : null
  const message =
    typeof body.message === 'string' && body.message.trim()
      ? body.message.trim()
      : null

  if (!name || name.length > 20) {
    return json({ error: '이름은 1~20자로 입력해주세요.' }, 400)
  }
  if (!Number.isFinite(amount) || amount < 100 || amount > 100_000_000) {
    return json({ error: '후원 금액이 올바르지 않습니다.' }, 400)
  }
  if (message && message.length > 100) {
    return json({ error: '메시지는 100자 이내로 입력해주세요.' }, 400)
  }

  try {
    const sql = neon(env.DATABASE_URL)
    const rows = await sql`
      INSERT INTO pledges (name, amount, tier, message)
      VALUES (${name}, ${Math.floor(amount)}, ${tier}, ${message})
      RETURNING id, name, amount, tier, message, created_at
    `
    return json(rows[0], 201)
  } catch (err) {
    return json(
      { error: '후원 저장에 실패했습니다.', detail: String(err) },
      500,
    )
  }
}
