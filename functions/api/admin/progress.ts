import { type Env, json, db, readJson } from '../../_lib'

// POST /api/admin/progress — 관리자 코드 검증 후 목표/모은 금액(원) 수동 갱신.
//   { adminCode, goal, raised } → 진행률은 raised/goal 로 자동 계산해 저장·반환.
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.ADMIN_CODE) {
    return json({ error: '서버 설정이 누락되었습니다 (ADMIN_CODE).' }, 500)
  }
  const body = await readJson(request)
  const adminCode = typeof body.adminCode === 'string' ? body.adminCode.trim() : ''
  const goal = Math.floor(Number(body.goal))
  const raised = Math.floor(Number(body.raised))
  if (adminCode !== env.ADMIN_CODE) {
    return json({ error: '관리자 코드가 올바르지 않아요.' }, 401)
  }
  if (!Number.isFinite(goal) || goal < 0) {
    return json({ error: '목표 금액은 0 이상이어야 해요.' }, 400)
  }
  if (!Number.isFinite(raised) || raised < 0) {
    return json({ error: '모은 금액은 0 이상이어야 해요.' }, 400)
  }
  const percent =
    goal > 0 ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100))) : 0
  try {
    await db(env)`
      INSERT INTO funding (id, percent, goal_amount, raised_amount, updated_at)
      VALUES (1, ${percent}, ${goal}, ${raised}, now())
      ON CONFLICT (id) DO UPDATE
        SET percent = ${percent},
            goal_amount = ${goal},
            raised_amount = ${raised},
            updated_at = now()
    `
    return json({ ok: true, goal, raised, percent })
  } catch {
    return json({ error: '현황 갱신에 실패했어요.' }, 500)
  }
}
