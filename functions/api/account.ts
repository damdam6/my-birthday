import { type Env, json, readJson } from '../_lib'

// POST /api/account — 공용 비밀코드 검증 후 계좌번호 공개.
// (계좌번호는 서버 환경변수에만 있고, 코드가 맞을 때만 응답에 담깁니다.)
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.SUPPORTER_CODE || !env.ACCOUNT_INFO) {
    return json({ error: '서버 설정이 누락되었습니다 (SUPPORTER_CODE/ACCOUNT_INFO).' }, 500)
  }
  const body = await readJson(request)
  const code = typeof body.code === 'string' ? body.code.trim() : ''
  if (code !== env.SUPPORTER_CODE) {
    return json({ error: '비밀코드가 올바르지 않아요 🤔' }, 401)
  }
  return json({ account: env.ACCOUNT_INFO })
}
