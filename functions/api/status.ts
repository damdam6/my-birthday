import { type Env, json, db } from '../_lib'

// GET /api/status — 모금 진행률(percent)만 반환. 구체 금액은 노출하지 않음.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.DATABASE_URL) return json({ percent: 0 })
  try {
    const rows = await db(env)`SELECT percent FROM funding WHERE id = 1`
    const percent = rows[0] ? Number(rows[0].percent) : 0
    return json({ percent: Math.max(0, Math.min(100, percent)) })
  } catch {
    return json({ percent: 0 })
  }
}
