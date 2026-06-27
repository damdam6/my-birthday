interface PersonSpeechProps {
  label: string
  line: string
}

// 사람(의사) 그림 + 말풍선 — MS페인트 크루드 스타일
export function PersonSpeech({ label, line }: PersonSpeechProps) {
  return (
    <div className="person-speech">
      <div className="person">
        <svg className="person__svg" viewBox="0 0 100 122" aria-hidden="true">
          {/* 가운(몸통) */}
          <path
            d="M18 122 Q18 72 50 66 Q82 72 82 122 Z"
            fill="#fff"
            stroke="#111"
            strokeWidth="3"
          />
          {/* 가운 깃 */}
          <path d="M50 66 L40 112 M50 66 L60 112" stroke="#111" strokeWidth="2" fill="none" />
          {/* 목 */}
          <rect x="44" y="56" width="12" height="14" fill="#f6d3a8" stroke="#111" strokeWidth="2" />
          {/* 머리 */}
          <circle cx="50" cy="38" r="22" fill="#f6d3a8" stroke="#111" strokeWidth="3" />
          {/* 머리카락 */}
          <path
            d="M27 34 Q29 14 50 14 Q71 14 73 34 Q60 24 50 26 Q40 24 27 34 Z"
            fill="#111"
          />
          {/* 눈 */}
          <circle cx="42" cy="38" r="2.5" fill="#111" />
          <circle cx="58" cy="38" r="2.5" fill="#111" />
          {/* 능청스러운 입 */}
          <path d="M42 48 Q50 53 58 48" stroke="#111" strokeWidth="2" fill="none" />
          {/* 청진기 */}
          <path d="M44 70 Q38 92 52 94" stroke="#2f6bd8" strokeWidth="2.5" fill="none" />
          <circle cx="52" cy="96" r="4" fill="#2f6bd8" stroke="#111" strokeWidth="1.5" />
          {/* 빨간 십자 배지 */}
          <rect x="62" y="80" width="13" height="13" fill="#e5392c" stroke="#111" strokeWidth="1.5" />
          <path d="M68.5 82.5 V90.5 M64.5 86.5 H72.5" stroke="#fff" strokeWidth="2" />
        </svg>
        <div className="person__label">{label}</div>
      </div>
      <div className="person-bubble">{line}</div>
    </div>
  )
}
