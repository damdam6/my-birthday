import { useState } from 'react'
import { revealAccount, addSupporter } from '../api'
import { copy } from '../config'

interface AccountRevealProps {
  onSupporterAdded: () => void
}

// 1) 공용 비밀코드 입력 → 서버 검증 → 계좌번호 공개(+복사)
// 2) 송금 후 이름 + 한마디 남기기 (관리자 승인 후 크레딧에 노출)
export function AccountReveal({ onSupporterAdded }: AccountRevealProps) {
  const [code, setCode] = useState('')
  const [account, setAccount] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
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
    const match = account.match(/[\d-]{6,}/)
    const text = match ? match[0] : account
    try {
      await navigator.clipboard.writeText(text)
    } catch {
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
      await addSupporter(code.trim(), name.trim(), message.trim())
      setNameDone(true)
      setName('')
      setMessage('')
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
          {copy.accountLead}
          <br />
          <small>{copy.accountHint}</small>
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
      <p className="reveal-card__lead">{copy.accountRevealTitle}</p>
      <div className="account-box">
        <span className="account-box__text">{account}</span>
        <button className="btn btn--copy" onClick={handleCopy}>
          {copied ? '복사됨 ✓' : copy.accountCopyBtn}
        </button>
      </div>

      <div className="reveal-card__divider">송금 완료하셨나요?</div>

      {nameDone ? (
        <div className="name-done">
          등록 완료! 확인 후 노출돼요. (제가 검토하고 올립니다)
        </div>
      ) : (
        <form className="name-form" onSubmit={handleName}>
          <input
            type="text"
            value={name}
            maxLength={20}
            placeholder="이름 / 닉네임"
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            value={message}
            maxLength={50}
            rows={2}
            placeholder="한마디 (선택) — 검토 후 올라가요"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn--dark" type="submit" disabled={naming}>
            {naming ? '등록 중…' : '이름과 한마디 남기기'}
          </button>
        </form>
      )}
      {nameError && <div className="form__error">{nameError}</div>}
    </div>
  )
}
