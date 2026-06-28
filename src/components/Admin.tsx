import { useEffect, useState } from 'react'
import {
  fetchStatus,
  setProgress,
  adminListSupporters,
  adminModerateSupporter,
  type PendingSupporter,
} from '../api'

// 관리자 화면 (#admin): 진행률 수동 갱신 + 후원자 승인
export function Admin() {
  const [adminCode, setAdminCode] = useState('')

  // 모금 현황 (목표/모은 금액)
  const [goal, setGoal] = useState(0)
  const [raised, setRaised] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // 진행률 미리보기 (모은 금액 ÷ 목표 금액)
  const percent =
    goal > 0 ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100))) : 0

  // 후원자 승인
  const [pending, setPending] = useState<PendingSupporter[]>([])
  const [pmsg, setPmsg] = useState<string | null>(null)
  const [loadingP, setLoadingP] = useState(false)

  useEffect(() => {
    fetchStatus()
      .then((s) => {
        setGoal(s.goal)
        setRaised(s.raised)
      })
      .catch(() => {})
  }, [])

  async function saveProgress(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setSaving(true)
    try {
      const res = await setProgress(adminCode.trim(), goal, raised)
      setMsg(
        `✅ 저장됨: ${res.raised.toLocaleString()}원 / ${res.goal.toLocaleString()}원 (${res.percent}%)`,
      )
    } catch (err) {
      setMsg(`❌ ${err instanceof Error ? err.message : '오류'}`)
    } finally {
      setSaving(false)
    }
  }

  async function loadPending() {
    setPmsg(null)
    setLoadingP(true)
    try {
      const res = await adminListSupporters(adminCode.trim())
      setPending(res.pending)
      if (res.pending.length === 0) setPmsg('대기 중인 후원자가 없어요.')
    } catch (err) {
      setPmsg(`❌ ${err instanceof Error ? err.message : '오류'}`)
    } finally {
      setLoadingP(false)
    }
  }

  async function moderate(id: number, action: 'approve' | 'reject') {
    try {
      await adminModerateSupporter(adminCode.trim(), id, action)
      setPending((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setPmsg(`❌ ${err instanceof Error ? err.message : '오류'}`)
    }
  }

  return (
    <main className="admin">
      <h1>관리자</h1>

      <label className="admin__field">
        관리자 코드
        <input
          type="password"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          placeholder="ADMIN_CODE"
        />
      </label>

      {/* 모금 현황 (목표/모은 금액) */}
      <section className="admin__card">
        <h2>모금 현황</h2>
        <form className="admin__form" onSubmit={saveProgress}>
          <label>
            목표 금액 (원)
            <input
              type="number"
              min={0}
              step={1000}
              value={goal}
              onChange={(e) => setGoal(Math.max(0, Number(e.target.value)))}
              placeholder="예: 300000"
            />
          </label>
          <label>
            모은 금액 (원)
            <input
              type="number"
              min={0}
              step={1000}
              value={raised}
              onChange={(e) => setRaised(Math.max(0, Number(e.target.value)))}
              placeholder="예: 120000"
            />
          </label>
          <div className="admin__calc">
            {raised.toLocaleString()}원 / {goal.toLocaleString()}원 →{' '}
            <strong>{percent}%</strong>
          </div>
          <div className="admin__preview">
            <div className="admin__bar" style={{ width: `${percent}%` }} />
          </div>
          <button className="btn btn--dark" type="submit" disabled={saving}>
            {saving ? '저장 중…' : '현황 저장'}
          </button>
          {msg && <div className="admin__msg">{msg}</div>}
        </form>
      </section>

      {/* 후원자 승인 */}
      <section className="admin__card">
        <h2>후원자 승인</h2>
        <p className="muted">승인해야 크레딧에 노출됩니다.</p>
        <button className="btn btn--ghost" onClick={loadPending} disabled={loadingP}>
          {loadingP ? '불러오는 중…' : '대기 목록 불러오기'}
        </button>
        {pmsg && <div className="admin__msg">{pmsg}</div>}
        <ul className="admin__pending">
          {pending.map((p) => (
            <li key={p.id}>
              <div>
                <div className="admin__pname">{p.name}</div>
                {p.message && <div className="admin__pmsg">“{p.message}”</div>}
              </div>
              <div className="admin__pbtns">
                <button className="btn btn--copy" onClick={() => moderate(p.id, 'approve')}>
                  승인
                </button>
                <button className="btn btn--ghost" onClick={() => moderate(p.id, 'reject')}>
                  거절
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <a className="admin__back" href="#">
        ← 메인으로
      </a>
    </main>
  )
}
