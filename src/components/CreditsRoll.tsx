import type { Supporter } from '../api'

interface CreditsRollProps {
  supporters: Supporter[]
}

// 후원자 이름(+한마디)이 아래에서 올라와 위로 완전히 사라진 뒤,
// 다시 아래에서 올라오는 롤. 인원수와 상관없이(1명이어도) 항상 굴러간다.
export function CreditsRoll({ supporters = [] }: CreditsRollProps) {
  if (supporters.length === 0) return null

  // 이동 거리 ∝ 인원수 → 속도(px/s)를 일정하게 유지
  const duration = Math.max(9, 7 + supporters.length * 2.4)

  return (
    <div className="credits">
      <div
        className="credits__roll"
        style={{ animationDuration: `${duration}s` }}
      >
        {supporters.map((s, idx) => (
          <div className="credits__item" key={idx}>
            <div className="credits__name">{s.name}</div>
            {s.message && <div className="credits__msg">“{s.message}”</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
