import { useCallback, useEffect, useState } from 'react'
import { config, tiers } from './config'
import { fetchPledges, formatWon, type PledgesResponse } from './api'
import { Reveal } from './components/Reveal'
import { ProgressBar } from './components/ProgressBar'
import { Backers } from './components/Backers'
import { PledgeForm } from './components/PledgeForm'

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
}

// 예산 사용처 (웃긴 가상 내역)
const budget = [
  { emoji: '🎧', label: '꿈의 무선 헤드폰', value: 35 },
  { emoji: '🥩', label: '한우 오마카세 (혼밥 아님)', value: 30 },
  { emoji: '🍰', label: '내가 나에게 사주는 케이크', value: 15 },
  { emoji: '🚕', label: '집에 가는 택시비', value: 10 },
  { emoji: '😭', label: '예비비 (현실은 통장)', value: 10 },
]

export default function App() {
  const [data, setData] = useState<PledgesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetchPledges()
      setData(res)
      setLoadError(false)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const dday = daysUntil(config.birthday)
  const total = data?.stats.total ?? 0
  const count = data?.stats.count ?? 0
  const pledges = data?.pledges ?? []

  return (
    <main className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__inner">
          <span className="hero__pill">🚀 FUNDING NOW</span>
          <h1 className="hero__title">
            올해는 <span className="hl">양말</span> 말고<br />
            <span className="hero__big">진짜</span>를 받고 싶다
          </h1>
          <p className="hero__sub">
            매년 핸드크림과 양말의 굴레… 이제는 끝.<br />
            제 생일 선물, 제가 직접 펀딩합니다. 🎂
          </p>
          <div className="hero__dday">
            {dday > 0 ? (
              <>
                내 생일까지 <strong>D-{dday}</strong>
              </>
            ) : dday === 0 ? (
              <>오늘이 바로 그날! 🎉 D-DAY</>
            ) : (
              <>생일은 지났지만 후원은 계속됩니다 🫠</>
            )}
          </div>
          <a className="btn btn--primary hero__cta" href="#pledge">
            지금 후원하기 🎁
          </a>
          <div className="hero__scroll">스크롤해서 사연 보기 ↓</div>
        </div>
      </section>

      {/* LIVE PROGRESS */}
      <section className="section section--progress">
        <Reveal>
          {loading ? (
            <div className="loading">모금 현황 불러오는 중… ⏳</div>
          ) : loadError ? (
            <div className="loading loading--err">
              모금 현황을 못 불러왔어요 😢<br />
              <small>DATABASE_URL 설정을 확인해주세요</small>
            </div>
          ) : (
            <ProgressBar total={total} count={count} />
          )}
        </Reveal>
      </section>

      {/* 문제 정의 */}
      <section className="section">
        <Reveal>
          <span className="kicker">CHAPTER 1. 문제</span>
          <h2 className="section__title">매년 반복되는 비극 🧦</h2>
          <p className="section__text">
            작년 생일 선물: 양말 3켤레 (검은색).<br />
            재작년 생일 선물: 핸드크림 (향 별로).<br />
            올해 예상 선물: <strong>또 양말.</strong>
          </p>
          <p className="section__text muted">
            이대로라면 제 서랍은 양말 박물관이 됩니다.
          </p>
        </Reveal>
      </section>

      {/* 해결책 */}
      <section className="section section--tint">
        <Reveal>
          <span className="kicker">CHAPTER 2. 해결책</span>
          <h2 className="section__title">그래서 펀딩을 엽니다 💡</h2>
          <p className="section__text">
            여러분의 작은 마음이 모이면,<br />
            저는 <strong>{config.dreamGift}</strong>를 손에 넣습니다.
          </p>
          <div className="bigGoal">
            <span>목표 금액</span>
            <strong>{formatWon(config.goal)}</strong>
          </div>
        </Reveal>
      </section>

      {/* 예산 사용처 */}
      <section className="section">
        <Reveal>
          <span className="kicker">CHAPTER 3. 예산 사용처</span>
          <h2 className="section__title">한 푼도 허투루 안 씁니다 💸</h2>
        </Reveal>
        <div className="budget">
          {budget.map((b, i) => (
            <Reveal key={b.label} delay={i * 80}>
              <div className="budget__row">
                <span className="budget__label">
                  {b.emoji} {b.label}
                </span>
                <span className="budget__pct">{b.value}%</span>
                <div className="budget__bar">
                  <div
                    className="budget__bar-fill"
                    style={{ width: `${b.value}%` }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 리워드 */}
      <section className="section section--tint">
        <Reveal>
          <span className="kicker">CHAPTER 4. 리워드</span>
          <h2 className="section__title">후원 등급 🎖️</h2>
          <p className="section__text muted">금액이 클수록 제 감동도 커집니다.</p>
        </Reveal>
        <div className="tiers">
          {tiers.map((t, i) => (
            <Reveal key={t.amount} delay={i * 60}>
              <div className={`tier ${t.badge ? 'tier--badge' : ''}`}>
                {t.badge && <span className="tier__badge">{t.badge}</span>}
                <div className="tier__head">
                  <span className="tier__emoji">{t.emoji}</span>
                  <div>
                    <div className="tier__amount">{formatWon(t.amount)}</div>
                    <div className="tier__title">{t.title}</div>
                  </div>
                </div>
                <ul className="tier__perks">
                  {t.perks.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 후원 폼 */}
      <section className="section" id="pledge">
        <Reveal>
          <span className="kicker">CHAPTER 5. 참여하기</span>
          <h2 className="section__title">후원하기 🙌</h2>
          <p className="section__text muted">
            천사가 되는 데 3초면 충분합니다.
          </p>
          <PledgeForm onSuccess={load} />
        </Reveal>
      </section>

      {/* 명예의 전당 */}
      <section className="section section--tint">
        <Reveal>
          <span className="kicker">HALL OF FAME</span>
          <h2 className="section__title">명예의 전당 👑</h2>
          <p className="section__text muted">
            이 은혜, 평생 잊지 않겠습니다.
          </p>
          {loading ? (
            <div className="loading">불러오는 중…</div>
          ) : (
            <Backers pledges={pledges} />
          )}
        </Reveal>
      </section>

      <footer className="footer">
        <div className="footer__emoji">🎂🎈🎉</div>
        <p>이 펀딩은 농담 반 진담 반으로 만들어졌습니다.</p>
        <p className="muted">
          React · Cloudflare Pages · Neon Postgres 로 만든 모바일 페이지
        </p>
      </footer>
    </main>
  )
}
