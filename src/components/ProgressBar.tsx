import { config } from '../config'
import { formatWon } from '../api'

interface ProgressBarProps {
  total: number
  count: number
}

export function ProgressBar({ total, count }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((total / config.goal) * 100))
  const overAchieved = total > config.goal

  return (
    <div className="progress">
      <div className="progress__numbers">
        <div className="progress__raised">
          <span className="progress__amount">{formatWon(total)}</span>
          <span className="progress__percent">
            {percent}% {overAchieved && '🎉 목표 초과 달성!'}
          </span>
        </div>
        <div className="progress__goal">목표 {formatWon(config.goal)}</div>
      </div>
      <div className="progress__track">
        <div
          className="progress__fill"
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
      <div className="progress__meta">
        <span>
          <strong>{count}</strong>명의 천사가 후원했어요
        </span>
        <span>D-Day까지 직진 🏃</span>
      </div>
    </div>
  )
}
