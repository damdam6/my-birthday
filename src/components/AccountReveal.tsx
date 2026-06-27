import { useState } from 'react'
import { revealAccount, addSupporter } from '../api'

interface AccountRevealProps {
  onSupporterAdded: () => void
}

// 1) 공용 비밀코드 입력 → 서버 검증 → 계좌번호 공개(+복사)
// 2) 송금 후 이름 남기기 (크레딧 롤에 등록)
export function AccountReveal({ onSupporterAdded }: AccountRevealProps) {
  const [code, setCode] = useState('')
  const [account, setAccount] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [name, setName] = useState('')
  const [naming, setNaming] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameDone, setNameDone] = useState(false)

  async function handleReveal(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!code.trim()) {
      setError('비밀코드를 입력해주세요!')
      return
    }
    setLoading(true)
    try {
      const res = await revealAccount(code.trim())
      setAccount(res.account)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했어요')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!account) return
    // 계좌 문자열에서 숫자/하이픈 위주의 계좌번호만 추출 시도, 실패 시 전체 복사
    const match = account.match(/[\d-]{6,}/)
    const text = match ? match[0] : account
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 일부 브라우저 폴백
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  async function handleName(e: React.FormEvent) {
    e.preventDefault()
    setNameError(null)
    if (!name.trim()) {
      setNameError('이름(닉네임)을 입력해주세요!')
      return
    }
    setNaming(true)
    try {
      await addSupporter(code.trim(), name.trim())
      setNameDone(true)
      setName('')
      onSupporterAdded()
    } catch (err) {
      setNameError(err instanceof Error ? err.message : '오류가 발생했어요')
    } finally {
      setNaming(false)
    }
  }

  if (!account) {
    return (
      <form className="reveal-card" onSubmit={handleReveal}>
        <p className="reveal-card__lead">
          🔒 후원 계좌는 <strong>공용 비밀코드</strong>를 입력해야 보여요.
          <br />
          <small>(코드는 저에게 물어봐 주세요 😉)</small>
        </p>
        <div className="reveal-card__row">
          <input
            type="text"
            value={code}
            placeholder="비밀코드 입력"
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn btn--dark" type="submit" disabled={loading}>
            {loading ? '확인 중…' : '계좌 보기'}
          </button>
        </div>
        {error && <div className="form__error">{error}</div>}
      </form>
    )
  }

  return (
    <div className="reveal-card">
      <p className="reveal-card__lead">💌 마음 후원 계좌</p>
      <div className="account-box">
        <span className="account-box__text">{account}</span>
        <button className="btn btn--copy" onClick={handleCopy}>
          {copied ? '복사됨 ✓' : '계좌 복사 📋'}
        </button>
      </div>

      <div className="reveal-card__divider">송금 완료하셨나요?</div>

      {nameDone ? (
        <div className="name-done">
          🙇 등록 완료! 하단 크레딧에서 이름을 확인해보세요.
        </div>
      ) : (
        <form className="reveal-card__row" onSubmit={handleName}>
          <input
            type="text"
            value={name}
            maxLength={20}
            placeholder="이름/닉네임 남기기"
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn--dark" type="submit" disabled={naming}>
            {naming ? '등록 중…' : '이름 올리기'}
          </button>
        </form>
      )}
      {nameError && <div className="form__error">{nameError}</div>}
    </div>
  )
}
