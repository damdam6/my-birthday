import { type Env, json, db, readJson } from '../_lib'

// GET /api/supporters — 후원자 이름 목록(크레딧 롤용). 이름만 반환.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.DATABASE_URL) return json({ names: [] })
  try {
    const rows = await db(env)`
      SELECT name FROM supporters ORDER BY created_at DESC LIMIT 500
    `
    return json({ names: rows.map((r) => r.name as string) })
  } catch {
    return json({ names: [] })
  }
}

// POST /api/supporters — 비밀코드 검증 후 후원자 이름 등록.
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.SUPPORTER_CODE) {
    return json({ error: '서버 설정이 누락되었습니다 (SUPPORTER_CODE).' }, 500)
  }
  const body = await readJson(request)
  const code = typeof body.code === 'string' ? body.code.trim() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (code !== env.SUPPORTER_CODE) {
    return json({ error: '비밀코드가 올바르지 않아요 🤔' }, 401)
  }
  if (!name || name.length > 20) {
    return json({ error: '이름은 1~20자로 입력해주세요.' }, 400)
  }
  try {
    await db(env)`INSERT INTO supporters (name) VALUES (${name})`
    return json({ ok: true })
  } catch {
    return json({ error: '이름 등록에 실패했어요. 잠시 후 다시 시도해주세요.' }, 500)
  }
}
