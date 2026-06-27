// 프로젝트 설정 - 여기 값만 바꾸면 페이지 내용이 바뀝니다.
export const config = {
  // 생일 주인공 이름
  name: '나',
  // 생일 (YYYY-MM-DD) - D-day 계산에 사용
  birthday: '2026-07-15',
  // 모금 목표 금액 (원)
  goal: 1_000_000,
  // 펀딩으로 사고 싶은 "꿈의 선물"
  dreamGift: '신상 무선 헤드폰 + 한우 오마카세',
  // 펀딩 마감일 (YYYY-MM-DD)
  deadline: '2026-07-14',
}

// 후원 등급(리워드)
export interface Tier {
  amount: number
  emoji: string
  title: string
  perks: string[]
  badge?: string
}

export const tiers: Tier[] = [
  {
    amount: 1_000,
    emoji: '🫶',
    title: '마음만 받을게요',
    perks: ['진심 어린 감사 인사 (카톡)', '명단에 익명으로 기록될 권리'],
  },
  {
    amount: 5_000,
    emoji: '☕',
    title: '커피 한 잔의 정',
    perks: ['위 혜택 전부', '생일 당일 셀카 1장 전송', '이름 영구 박제'],
  },
  {
    amount: 10_000,
    emoji: '🍗',
    title: '치킨 후원자',
    perks: ['위 혜택 전부', '손글씨 감사 카드 사진', '다음 만남 때 무한 칭찬'],
    badge: 'HOT',
  },
  {
    amount: 50_000,
    emoji: '🎁',
    title: '진정한 친구',
    perks: ['위 혜택 전부', '영상통화 3분권', '생일 파티 VIP 초대', '평생 은인 등극'],
    badge: 'BEST',
  },
  {
    amount: 100_000,
    emoji: '👑',
    title: '명예의 전당',
    perks: ['위 혜택 전부', '명예의 전당 최상단 고정', '원할 때 밥 한 끼 (제가 삽니다)', '신화로 남기'],
  },
]
