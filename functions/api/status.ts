import { type Env, json, db } from '../_lib'

// GET /api/status — 모금 현황: 목표 금액 / 모은 금액 / 진행률(%).
// percent 는 raised/goal 로 계산해서 함께 내려줍니다.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.DATABASE_URL) return json({ goal: 0, raised: 0, percent: 0 })
  try {
    const rows = await db(env)`
      SELECT goal_amount, raised_amount FROM funding WHERE id = 1
    `
    const goal = rows[0] ? Number(rows[0].goal_amount) : 0
    const raised = rows[0] ? Number(rows[0].raised_amount) : 0
    const percent =
      goal > 0 ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100))) : 0
    return json({ goal, raised, percent })
  } catch {
    return json({ goal: 0, raised: 0, percent: 0 })
  }
}
