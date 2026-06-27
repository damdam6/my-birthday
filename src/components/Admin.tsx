import { useEffect, useState } from 'react'
import { fetchStatus, setProgress } from '../api'

// 관리자용 진행률 수동 갱신 화면 (#admin 으로 접속)
export function Admin() {
  const [adminCode, setAdminCode] = useState('')
  const [percent, setPercent] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStatus()
      .then((s) => setPercent(s.percent))
      .catch(() => {})
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setSaving(true)
    try {
      const res = await setProgress(adminCode.trim(), percent)
      setMsg(`✅ 저장됨: ${res.percent}%`)
    } catch (err) {
      setMsg(`❌ ${err instanceof Error ? err.message : '오류'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin">
      <h1>🔧 진행률 관리</h1>
      <p className="muted">모금 막대 게이지의 진행률(0~100%)을 직접 조절합니다.</p>
      <form className="admin__form" onSubmit={save}>
        <label>
          관리자 코드
          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="ADMIN_CODE"
          />
        </label>
        <label>
          진행률: <strong>{percent}%</strong>
          <input
            type="range"
            min={0}
            max={100}
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
          />
        </label>
        <div className="admin__preview">
          <div className="admin__bar" style={{ width: `${percent}%` }} />
        </div>
        <button className="btn btn--dark" type="submit" disabled={saving}>
          {saving ? '저장 중…' : '저장하기'}
        </button>
        {msg && <div className="admin__msg">{msg}</div>}
      </form>
      <a className="admin__back" href="#">
        ← 메인으로
      </a>
    </main>
  )
}
