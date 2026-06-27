import { copy } from '../config'

interface GaugeBarProps {
  percent: number
}

// 수치는 숨기고 막대만 보여주는 손그림 게이지.
// (얼마나 모였는지 "느낌"만 전달하고 구체적인 금액은 비공개)
export function GaugeBar({ percent }: GaugeBarProps) {
  const p = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0))
  return (
    <div className="gauge" aria-label="모금 진행 막대">
      <div className="gauge__track">
        <div className="gauge__fill" style={{ width: `${Math.max(p, 3)}%` }}>
          <span className="gauge__runner">🎂</span>
        </div>
      </div>
      <div className="gauge__caption">
        {copy.gaugeCaption}
        <span className="gauge__hint">{copy.gaugeHint}</span>
      </div>
    </div>
  )
}
