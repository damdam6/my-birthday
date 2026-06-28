import type { Supporter } from '../api'

interface CreditsRollProps {
  supporters: Supporter[]
}

// 영화 엔딩 크레딧처럼 이름(+한마디)이 아래에서 위로 흐르는 섹션.
// 후원자가 적으면 스크롤 없이 내용 높이에 맞춰 그대로 보여준다.
const ROLL_THRESHOLD = 6

export function CreditsRoll({ supporters = [] }: CreditsRollProps) {
  if (supporters.length === 0) return null

  const item = (s: Supporter, idx: number) => (
    <div className="credits__item" key={idx}>
      <div className="credits__name">{s.name}</div>
      {s.message && <div className="credits__msg">“{s.message}”</div>}
    </div>
  )

  // 적을 때: 정적 목록 (높이 자동 → 빈 공간 없음)
  if (supporters.length < ROLL_THRESHOLD) {
    return <div className="credits credits--static">{supporters.map(item)}</div>
  }

  // 많을 때: 끊김 없이 반복되도록 목록을 두 번 이어 붙여 스크롤
  const loop = [...supporters, ...supporters]
  return (
    <div className="credits">
      <div
        className="credits__roll"
        style={{ animationDuration: `${Math.max(12, supporters.length * 2)}s` }}
      >
        {loop.map(item)}
      </div>
    </div>
  )
}
