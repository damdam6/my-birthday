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

  // 많을 때: 목록을 두 번 이어 붙이고 -50% 로 굴려 끊김 없이 반복.
  // (간격은 gap 대신 각 항목의 margin-bottom 으로 줘서 경계 점프를 없앰)
  const loop = [...supporters, ...supporters]
  const duration = Math.max(16, supporters.length * 3)
  return (
    <div className="credits">
      <div className="credits__roll" style={{ animationDuration: `${duration}s` }}>
        {loop.map(item)}
      </div>
    </div>
  )
}
