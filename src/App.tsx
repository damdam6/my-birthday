import { useCallback, useEffect, useState } from 'react'
import { config, copy } from './config'
import { fetchStatus, fetchSupporters } from './api'
import { Reveal } from './components/Reveal'
import { Carousel } from './components/Carousel'
import { GaugeBar } from './components/GaugeBar'
import { AccountReveal } from './components/AccountReveal'
import { CreditsRoll } from './components/CreditsRoll'
import { Admin } from './components/Admin'

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
}

function useHashRoute(): string {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  const [percent, setPercent] = useState(0)
  const [names, setNames] = useState<string[]>([])

  const loadStatus = useCallback(() => {
    fetchStatus()
      .then((s) => setPercent(Number.isFinite(s?.percent) ? s.percent : 0))
      .catch(() => {})
  }, [])
  const loadSupporters = useCallback(() => {
    fetchSupporters()
      .then((s) => setNames(Array.isArray(s?.names) ? s.names : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadStatus()
    loadSupporters()
  }, [loadStatus, loadSupporters])

  if (hash === '#admin') return <Admin />

  const dday = daysUntil(config.birthday)

  return (
    <main className="page">
      {/* ───── 표지 ───── */}
      <section className="cover">
        <span className="cover__kicker">{copy.coverKicker}</span>
        <div className="speech speech--big">
          <h1>
            {copy.coverTitle[0]}
            <br />
            {copy.coverTitle[1]}
          </h1>
          <p className="cover__yes">{copy.coverYes}</p>
        </div>
        <div className="cover__doodle">🎉🥳⌨️</div>
        <div className="cover__dday">
          {dday > 0 ? (
            <>
              내 생일까지 <strong>D-{dday}</strong>
            </>
          ) : dday === 0 ? (
            <>오늘이 바로 그날 🎂 D-DAY!</>
          ) : (
            <>생일은 지났지만 후원은 계속됩니다 🫠</>
          )}
        </div>
        <a className="btn btn--primary cover__cta" href="#pledge">
          후원하러 가기 ➡️
        </a>
        <div className="cover__scroll">스크롤해서 사연 보기 ↓</div>
      </section>

      {/* ───── 인사 ───── */}
      <section className="section">
        <Reveal>
          <div className="speech">
            <p className="speech__hi">
              안녕하세요! 오늘 💗생일💗인 <strong>{config.name}</strong> 입니다
            </p>
          </div>
          <p className="handwrite thanks">{copy.greetingThanks}</p>
          <p className="section__text">{copy.greetingAsk}</p>

          <div className="options">
            <div className="option">
              <span className="option__num">1</span>
              <div>
                <b>{copy.option1}</b>
                <div className="option__reply">➡️ {copy.option1Reply}</div>
              </div>
            </div>
            <div className="option option--hot">
              <span className="option__num">2</span>
              <div>
                <b>{copy.option2}</b>
                <div className="option__reply">➡️ {copy.option2Reply}</div>
              </div>
            </div>
          </div>
          <div className="arrows">➡️➡️➡️➡️➡️➡️</div>
        </Reveal>
      </section>

      {/* ───── 선물 소개 ───── */}
      <section className="section section--paper">
        <Reveal>
          <p className="handwrite intro-line">제가 이번에 받고 싶은 선물은…</p>
          <h2 className="gift-title">
            <span className="hl-mark">{config.gift.title}</span> 입니다!
          </h2>
        </Reveal>
        <Reveal>
          <div className="gift-stage">
            <span className="burst burst--tl">최고</span>
            <span className="burst burst--br">손목 살려</span>
            <Carousel images={config.gift.images} alt={config.gift.title} />
          </div>
        </Reveal>
        <Reveal>
          <p className="section__text reason">{config.gift.reason}</p>
          {config.gift.link && (
            <a
              className="btn btn--ghost gift-link"
              href={config.gift.link}
              target="_blank"
              rel="noreferrer"
            >
              어떤 제품인지 구경하기 🔎
            </a>
          )}
          <p className="handwrite pledge-line">♥ {copy.pledgeLine} ♥</p>
        </Reveal>
      </section>

      {/* ───── 게이지 ───── */}
      <section className="section">
        <Reveal>
          <GaugeBar percent={percent} />
        </Reveal>
      </section>

      {/* ───── 리워드 ───── */}
      <section className="section section--paper">
        <Reveal>
          <h2 className="section__title">♥ 후원자 혜택 ♥</h2>
          <p className="section__text muted">(상품과는 별개! 제 마음을 담은 리워드예요)</p>
          <ul className="rewards">
            {config.rewards.map((r, idx) => (
              <li className="reward" key={idx}>
                <span className="reward__emoji">{r.emoji}</span>
                <span>
                  {idx + 1}. {r.text}
                </span>
              </li>
            ))}
          </ul>
          <p className="reward-note">* {config.rewardNote} *</p>
        </Reveal>
      </section>

      {/* ───── 계좌 공개 ───── */}
      <section className="section" id="pledge">
        <Reveal>
          <h2 className="section__title">♥ 마음 후원 굿 ♥</h2>
          <AccountReveal onSupporterAdded={loadSupporters} />
        </Reveal>
      </section>

      {/* ───── 크레딧 롤 ───── */}
      <section className="section section--credits">
        <Reveal>
          <h2 className="section__title">♥ 함께해주신 분들 ♥</h2>
          <p className="section__text muted">이 은혜, 평생 잊지 않겠습니다 🙇</p>
        </Reveal>
        <CreditsRoll names={names} />
      </section>

      {/* ───── 푸터 ───── */}
      <footer className="footer">
        <div className="footer__thanks">🙇 감사합니다 🙇</div>
        <p className="muted">
          {config.name}의 생일 펀딩 · React · Cloudflare · Neon
        </p>
      </footer>
    </main>
  )
}
