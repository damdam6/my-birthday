import type { Pledge } from '../api'
import { formatWon } from '../api'

interface BackersProps {
  pledges: Pledge[]
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return '방금 전'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  const day = Math.floor(hr / 24)
  return `${day}일 전`
}

export function Backers({ pledges }: BackersProps) {
  if (pledges.length === 0) {
    return (
      <div className="backers__empty">
        아직 후원자가 없어요. <br /> 첫 번째 천사가 되어주세요 😇
      </div>
    )
  }

  // 금액 큰 순으로 명예의 전당 상위 3명 강조
  const ranked = [...pledges].sort((a, b) => b.amount - a.amount)
  const medals = ['🥇', '🥈', '🥉']

  return (
    <ul className="backers__list">
      {pledges.map((p) => {
        const rank = ranked.indexOf(p)
        const medal = rank < 3 ? medals[rank] : null
        return (
          <li key={p.id} className={`backer ${medal ? 'backer--top' : ''}`}>
            <div className="backer__left">
              <span className="backer__avatar">{medal || '🎈'}</span>
              <div>
                <div className="backer__name">{p.name}</div>
                {p.message && <div className="backer__msg">“{p.message}”</div>}
              </div>
            </div>
            <div className="backer__right">
              <div className="backer__amount">{formatWon(p.amount)}</div>
              <div className="backer__time">{timeAgo(p.created_at)}</div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
