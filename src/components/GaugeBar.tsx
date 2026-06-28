import { copy } from '../config'

interface GaugeBarProps {
  goal: number
  raised: number
  percent: number
}

// 목표 금액 대비 모은 금액을 보여주는 손그림 게이지.
// (모은금액 ÷ 목표금액 = 진행률, 금액과 퍼센트를 함께 노출)
export function GaugeBar({ goal, raised, percent }: GaugeBarProps) {
  const p = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0))
  return (
    <div className="gauge" aria-label="모금 진행 막대">
      <div className="gauge__amounts">
        <span className="gauge__raised">{raised.toLocaleString()}원</span>
        <span className="gauge__goal">목표 {goal.toLocaleString()}원</span>
      </div>
      <div className="gauge__track">
        <div className="gauge__fill" style={{ width: `${Math.max(p, 3)}%` }}>
          <span className="gauge__pct">{p}%</span>
        </div>
      </div>
      <div className="gauge__caption">
        {copy.gaugeCaption}
        <span className="gauge__hint">{copy.gaugeHint}</span>
      </div>
    </div>
  )
}
