import { useCallback, useEffect, useState } from 'react'
import { config, copy } from './config'
import { fetchStatus, fetchSupporters, type Supporter } from './api'
import { Reveal } from './components/Reveal'
import { GiftPhotos } from './components/GiftPhotos'
import { PersonSpeech } from './components/PersonSpeech'
import { GaugeBar } from './components/GaugeBar'
import { AccountReveal } from './components/AccountReveal'
import { CreditsRoll } from './components/CreditsRoll'
import { Admin } from './components/Admin'

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
  const [status, setStatus] = useState({ goal: 0, raised: 0, percent: 0 })
  const [supporters, setSupporters] = useState<Supporter[]>([])

  const loadStatus = useCallback(() => {
    fetchStatus()
      .then((s) =>
        setStatus({
          goal: Number.isFinite(s?.goal) ? s.goal : 0,
          raised: Number.isFinite(s?.raised) ? s.raised : 0,
          percent: Number.isFinite(s?.percent) ? s.percent : 0,
        }),
      )
      .catch(() => {})
  }, [])
  const loadSupporters = useCallback(() => {
    fetchSupporters()
      .then((s) => setSupporters(Array.isArray(s?.supporters) ? s.supporters : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadStatus()
    loadSupporters()
  }, [loadStatus, loadSupporters])

  if (hash === '#admin') return <Admin />

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
        <div className="cover__dday">{copy.coverDday}</div>
        <a className="btn btn--primary cover__cta" href="#pledge">
          {copy.cta}
        </a>
        <div className="cover__scroll">{copy.coverScroll}</div>
      </section>

      {/* ───── 사건의 발단 (카톡) ───── */}
      <section className="section">
        <Reveal>
          <p className="handwrite chat-cap">사건의 발단 ↓</p>
          <figure className="chat-shot">
            <img src={config.chatImage} alt="친구의 펀딩 제안 카톡 캡처" />
          </figure>
        </Reveal>
      </section>

      {/* ───── 인사 ───── */}
      <section className="section">
        <Reveal>
          <div className="speech">
            <p className="speech__hi">{copy.greetingHi}</p>
          </div>
          <p className="handwrite thanks">{copy.greetingThanks}</p>
          <p className="section__text ask">{copy.greetingAsk}</p>

          <div className="options">
            <div className="option">
              <span className="option__num">1</span>
              <div>
                <b>{copy.option1}</b>
                <div className="option__reply">→ {copy.option1Reply}</div>
              </div>
            </div>
            <div className="option option--hot">
              <span className="option__num">2</span>
              <div>
                <b>{copy.option2}</b>
                <div className="option__reply">→ {copy.option2Reply}</div>
              </div>
            </div>
          </div>
          <div className="arrows">▼ ▼ ▼</div>
        </Reveal>
      </section>

      {/* ───── 선물 소개 ───── */}
      <section className="section section--paper">
        <Reveal>
          <p className="handwrite intro-line">{copy.introLine}</p>
          <h2 className="gift-title">
            <span className="hl-mark">{config.gift.title}</span>
          </h2>
        </Reveal>
        <Reveal>
          <div className="gift-stage">
            <span className="burst burst--tl">{copy.burstTL}</span>
            <span className="burst burst--br">{copy.burstBR}</span>
            <GiftPhotos images={config.gift.images} alt={config.gift.title} />
          </div>
          {config.gift.link && (
            <a
              className="btn btn--ghost gift-link"
              href={config.gift.link}
              target="_blank"
              rel="noreferrer"
            >
              어떤 제품인지 구경하기
            </a>
          )}
        </Reveal>
        <Reveal>
          <p className="section__text reason">{config.gift.reason}</p>
          <PersonSpeech
            label={config.gift.doctor.label}
            line={config.gift.doctor.line}
          />
          <p className="handwrite pledge-line">{copy.storyLine}</p>
        </Reveal>
      </section>

      {/* ───── 리워드 ───── */}
      <section className="section section--paper">
        <Reveal>
          <h2 className="section__title">{copy.rewardTitle}</h2>
          <p className="section__text muted">{copy.rewardSubtitle}</p>
          <ul className="rewards">
            {config.rewards.map((r, idx) => (
              <li className="reward" key={idx}>
                <span className="reward__num">{idx + 1}</span>
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
          <p className="reward-note">* {config.rewardNote} *</p>
        </Reveal>
      </section>

      {/* ───── 게이지 (감사한 분 바로 위) ───── */}
      <section className="section">
        <Reveal>
          <GaugeBar
            goal={status.goal}
            raised={status.raised}
            percent={status.percent}
          />
        </Reveal>
      </section>

      {/* ───── 계좌 공개 ───── */}
      <section className="section" id="pledge">
        <Reveal>
          <h2 className="section__title">{copy.accountTitle}</h2>
          <AccountReveal onSupporterAdded={loadSupporters} />
        </Reveal>
      </section>

      {/* ───── 크레딧 롤 ───── */}
      <section className="section section--credits">
        <Reveal>
          <h2 className="section__title">{copy.creditsTitle}</h2>
          <p className="section__text muted">{copy.creditsSubtitle}</p>
        </Reveal>
        <CreditsRoll supporters={supporters} />
      </section>

      {/* ───── 푸터 ───── */}
      <footer className="footer">
        <div className="footer__thanks">{copy.footerThanks}</div>
        <p className="muted">
          {config.name}의 생일 펀딩 · React · Cloudflare · Neon
        </p>
      </footer>
    </main>
  )
}
