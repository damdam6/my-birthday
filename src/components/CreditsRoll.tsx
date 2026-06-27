import type { Supporter } from '../api'

interface CreditsRollProps {
  supporters: Supporter[]
}

// 영화 엔딩 크레딧처럼 이름(+한마디)이 아래에서 위로 끝없이 흐르는 섹션.
export function CreditsRoll({ supporters = [] }: CreditsRollProps) {
  // 후원자가 없으면 공백 (0번은 직접 미리 넣어둠)
  if (supporters.length === 0) return null

  // 끊김 없이 반복되도록 목록을 두 번 이어 붙임
  const loop = [...supporters, ...supporters]

  return (
    <div className="credits">
      <div
        className="credits__roll"
        style={{ animationDuration: `${Math.max(12, supporters.length * 2)}s` }}
      >
        {loop.map((s, idx) => (
          <div className="credits__item" key={idx}>
            <div className="credits__name">{s.name}</div>
            {s.message && <div className="credits__msg">“{s.message}”</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
