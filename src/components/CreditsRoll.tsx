interface CreditsRollProps {
  names: string[]
}

// 영화 엔딩 크레딧처럼 이름이 아래에서 위로 끝없이 흐르는 섹션.
export function CreditsRoll({ names = [] }: CreditsRollProps) {
  if (names.length === 0) {
    return (
      <div className="credits credits--empty">
        아직 첫 후원자를 기다리는 중… 🥺
        <br />
        당신의 이름이 여기 1번으로 올라갈 수 있어요!
      </div>
    )
  }

  // 끊김 없이 반복되도록 목록을 두 번 이어 붙임
  const loop = [...names, ...names]

  return (
    <div className="credits">
      <div
        className="credits__roll"
        style={{ animationDuration: `${Math.max(12, names.length * 1.6)}s` }}
      >
        {loop.map((name, idx) => (
          <div className="credits__name" key={idx}>
            {name}
          </div>
        ))}
      </div>
    </div>
  )
}
