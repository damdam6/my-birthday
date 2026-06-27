import { type Env, json, db, readJson } from '../../_lib'

// POST /api/admin/progress — 관리자 코드 검증 후 진행률(0~100) 수동 갱신.
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.ADMIN_CODE) {
    return json({ error: '서버 설정이 누락되었습니다 (ADMIN_CODE).' }, 500)
  }
  const body = await readJson(request)
  const adminCode = typeof body.adminCode === 'string' ? body.adminCode.trim() : ''
  const percent = Math.round(Number(body.percent))
  if (adminCode !== env.ADMIN_CODE) {
    return json({ error: '관리자 코드가 올바르지 않아요.' }, 401)
  }
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    return json({ error: '진행률은 0~100 사이여야 해요.' }, 400)
  }
  try {
    await db(env)`
      INSERT INTO funding (id, percent, updated_at)
      VALUES (1, ${percent}, now())
      ON CONFLICT (id) DO UPDATE SET percent = ${percent}, updated_at = now()
    `
    return json({ ok: true, percent })
  } catch {
    return json({ error: '진행률 갱신에 실패했어요.' }, 500)
  }
}
