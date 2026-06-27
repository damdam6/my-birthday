import { type Env, json, db, readJson } from '../../_lib'

// POST /api/admin/supporters — 관리자 승인 관리
//   { adminCode, action: 'list' }            → 승인 대기 목록
//   { adminCode, action: 'approve', id }     → 승인
//   { adminCode, action: 'reject',  id }     → 삭제(거절)
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.ADMIN_CODE) {
    return json({ error: '서버 설정이 누락되었습니다 (ADMIN_CODE).' }, 500)
  }
  const body = await readJson(request)
  const adminCode = typeof body.adminCode === 'string' ? body.adminCode.trim() : ''
  const action = typeof body.action === 'string' ? body.action : ''
  if (adminCode !== env.ADMIN_CODE) {
    return json({ error: '관리자 코드가 올바르지 않아요.' }, 401)
  }

  try {
    const sql = db(env)

    if (action === 'list') {
      const rows = await sql`
        SELECT id, name, message, created_at FROM supporters
        WHERE approved = false
        ORDER BY created_at ASC
      `
      return json({
        pending: rows.map((r) => ({
          id: Number(r.id),
          name: r.name as string,
          message: (r.message as string | null) ?? null,
          created_at: r.created_at as string,
        })),
      })
    }

    const id = Math.round(Number(body.id))
    if (!Number.isFinite(id) || id <= 0) {
      return json({ error: '잘못된 id 입니다.' }, 400)
    }

    if (action === 'approve') {
      await sql`UPDATE supporters SET approved = true WHERE id = ${id}`
      return json({ ok: true })
    }
    if (action === 'reject') {
      await sql`DELETE FROM supporters WHERE id = ${id}`
      return json({ ok: true })
    }
    return json({ error: '알 수 없는 action 입니다.' }, 400)
  } catch {
    return json({ error: '처리에 실패했어요.' }, 500)
  }
}
