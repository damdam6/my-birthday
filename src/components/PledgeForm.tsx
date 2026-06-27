import { useState } from 'react'
import { createPledge, formatWon } from '../api'
import { tiers } from '../config'

interface PledgeFormProps {
  onSuccess: () => void
}

const QUICK_AMOUNTS = [1_000, 5_000, 10_000, 50_000]

export function PledgeForm({ onSuccess }: PledgeFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<number>(5_000)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const matchedTier = [...tiers]
    .reverse()
    .find((t) => amount >= t.amount)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError('이름(또는 닉네임)을 입력해주세요!')
      return
    }
    if (!amount || amount < 100) {
      setError('100원 이상부터 후원할 수 있어요 🙏')
      return
    }
    setSubmitting(true)
    try {
      await createPledge({
        name: name.trim(),
        amount,
        tier: matchedTier?.title ?? null,
        message: message.trim() || null,
      })
      setDone(true)
      setName('')
      setMessage('')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="form__done">
        <div className="form__done-emoji">🎉</div>
        <h3>후원 완료! 당신은 천사입니다</h3>
        <p>방금 모금액이 올라갔어요. 명예의 전당에서 확인해보세요!</p>
        <button className="btn btn--ghost" onClick={() => setDone(false)}>
          한 번 더 후원하기 😈
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="form__field">
        <span>이름 / 닉네임</span>
        <input
          type="text"
          value={name}
          maxLength={20}
          placeholder="예: 익명의 천사"
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className="form__field">
        <span>후원 금액</span>
        <div className="form__quick">
          {QUICK_AMOUNTS.map((a) => (
            <button
              type="button"
              key={a}
              className={`chip ${amount === a ? 'chip--active' : ''}`}
              onClick={() => setAmount(a)}
            >
              {formatWon(a)}
            </button>
          ))}
        </div>
        <input
          type="number"
          inputMode="numeric"
          min={100}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {matchedTier && (
          <div className="form__tierhint">
            {matchedTier.emoji} <strong>{matchedTier.title}</strong> 등급이 적용돼요!
          </div>
        )}
      </div>

      <label className="form__field">
        <span>한마디 (선택)</span>
        <textarea
          value={message}
          maxLength={100}
          rows={2}
          placeholder="생일 축하해! 양말은 내가 안 줄게 ㅎㅎ"
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      {error && <div className="form__error">{error}</div>}

      <button className="btn btn--primary" type="submit" disabled={submitting}>
        {submitting ? '후원하는 중...' : `${formatWon(amount)} 후원하기 🎁`}
      </button>
      <p className="form__notice">
        * 실제 결제는 일어나지 않아요. 마음의 펀딩입니다 (진짜 보내고 싶으면 말리지 않음 🤭)
      </p>
    </form>
  )
}
