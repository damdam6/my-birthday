import { type Env, json, db, readJson } from '../_lib'

// GET /api/supporters — 승인된 후원자만(이름 + 한마디). 크레딧 롤용.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.DATABASE_URL) return json({ supporters: [] })
  try {
    const rows = await db(env)`
      SELECT name, message FROM supporters
      WHERE approved = true
      ORDER BY created_at DESC
      LIMIT 500
    `
    return json({
      supporters: rows.map((r) => ({
        name: r.name as string,
        message: (r.message as string | null) ?? null,
      })),
    })
  } catch {
    return json({ supporters: [] })
  }
}

// POST /api/supporters — 비밀코드 검증 후 등록(이름 + 한마디). approved=false 로 대기.
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.SUPPORTER_CODE) {
    return json({ error: '서버 설정이 누락되었습니다 (SUPPORTER_CODE).' }, 500)
  }
  const body = await readJson(request)
  const code = typeof body.code === 'string' ? body.code.trim() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const message =
    typeof body.message === 'string' && body.message.trim()
      ? body.message.trim()
      : null
  if (code !== env.SUPPORTER_CODE) {
    return json({ error: '비밀코드가 올바르지 않아요 🤔' }, 401)
  }
  if (!name || name.length > 20) {
    return json({ error: '이름은 1~20자로 입력해주세요.' }, 400)
  }
  if (message && message.length > 50) {
    return json({ error: '한마디는 50자 이내로 입력해주세요.' }, 400)
  }
  try {
    await db(env)`
      INSERT INTO supporters (name, message, approved)
      VALUES (${name}, ${message}, false)
    `
    return json({ ok: true })
  } catch {
    return json({ error: '등록에 실패했어요. 잠시 후 다시 시도해주세요.' }, 500)
  }
}
