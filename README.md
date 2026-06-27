# 🎂 내 생일 선물 펀딩 프로젝트

> "올해는 양말 말고 **인체공학 키보드**를 받고 싶다."

내 생일 선물을 직접 펀딩하는 컨셉의 **스크롤형 모바일 웹페이지**입니다.
**손그림 낙서 스타일**(모눈종이 배경·손글씨 폰트·스티커 테두리)로,
생일 펀딩 사연 → 선물 소개 → 후원 방법으로 이어지는 1장짜리 페이지예요.

- **프론트엔드**: React 18 + Vite (모바일 우선, 스크롤 등장 애니메이션)
- **백엔드**: Cloudflare Pages Functions (서버리스)
- **데이터베이스**: Neon Serverless PostgreSQL (무료 티어)

가벼움이 목표 — JS 약 51KB(gzip), CSS 약 3KB.

---

## ✨ 주요 기능

- **스크롤 스토리텔링**: 표지 → 인사 → 선물 소개 → 게이지 → 리워드 → 계좌 → 크레딧
- **손그림 상품 캐러셀**: 키보드 이미지를 "1/N" 스와이프로 구경
- **막대 게이지**: 구체적인 금액은 숨기고 진행 "느낌"만 막대로 표현
- **공용 비밀코드 → 계좌 공개 + 복사**: 코드를 서버에서 검증, 계좌번호는 코드가 맞을 때만 내려옴
- **후원자 크레딧 롤**: 송금 후 이름을 남기면 영화 엔딩처럼 흘러감 (이름만 표시)
- **관리자 화면(`#admin`)**: 진행률(0~100%)을 직접 갱신

---

## 📁 구조

```
.
├── index.html
├── src/                       # React 앱
│   ├── App.tsx                # 전체 페이지(섹션 구성) + #admin 라우팅
│   ├── config.ts              # 이름·생일·선물·리워드·문구 (여기만 고치면 됨)
│   ├── api.ts                 # API 클라이언트
│   ├── components/            # Carousel, GaugeBar, AccountReveal, CreditsRoll, Admin, Reveal
│   └── styles.css             # 낙서 테마 스타일
├── public/gift/               # 상품(키보드) 이미지
├── functions/
│   ├── _lib.ts                # 공용 헬퍼(DB·JSON·env)
│   └── api/
│       ├── status.ts          # GET 진행률(percent만)
│       ├── account.ts         # POST 비밀코드 검증 → 계좌 공개
│       ├── supporters.ts      # GET 이름목록 / POST 이름등록
│       └── admin/progress.ts  # POST 관리자 진행률 갱신
├── schema.sql                 # DB 테이블 정의
└── wrangler.toml              # Cloudflare Pages 설정
```

---

## 🚀 시작하기

### 1. 데이터베이스 준비 (Neon)

1. [neon.tech](https://neon.tech) 가입 후 프로젝트 생성 (무료 티어, 카드 등록 불필요)
2. SQL 에디터에서 [`schema.sql`](./schema.sql) 실행
3. **Connection string**(`postgresql://...`)을 복사

> Neon 무료 플랜은 자동 과금이 없습니다. 한도를 넘으면 청구가 아니라 일시 정지됩니다.

### 2. 로컬 개발

```bash
npm install

# 비밀값 설정
cp .dev.vars.example .dev.vars
# .dev.vars 를 열어 DATABASE_URL / SUPPORTER_CODE / ADMIN_CODE / ACCOUNT_INFO 채우기

# 프론트 + Functions 함께 실행 (http://localhost:8788)
npm run pages:dev
```

> 프론트엔드만 빠르게 보려면 `npm run dev` (단, API는 동작하지 않아 게이지/계좌는 비활성).

### 3. 내용 커스터마이징

[`src/config.ts`](./src/config.ts) 에서 아래를 본인 것으로 바꾸세요.

- `name` — 생일 주인공 이름
- `birthday` — 생일 날짜(D-day 계산)
- `gift` — 선물 제목/링크/이미지/사연
- `rewards` — 상상해서 만든 후원자 혜택
- `copy` — 표지/인사 문구

상품 이미지는 `public/gift/` 안의 파일을 교체하면 됩니다.

---

## ☁️ Cloudflare Pages 배포

### 방법 A — 대시보드(GitHub 연동) 추천

1. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git**
2. 이 저장소 선택 후 빌드 설정:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. **Settings → Environment variables**(Production/Preview 모두)에
   `DATABASE_URL`, `SUPPORTER_CODE`, `ADMIN_CODE`, `ACCOUNT_INFO` 추가
4. 배포 완료. `functions/` 디렉터리가 자동으로 API로 연결됩니다.

### 방법 B — CLI

```bash
npx wrangler pages secret put DATABASE_URL
npx wrangler pages secret put SUPPORTER_CODE
npx wrangler pages secret put ADMIN_CODE
npx wrangler pages secret put ACCOUNT_INFO
npm run deploy
```

---

## 🔌 API

| 메서드 | 경로                  | 설명                                  |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/api/status`         | 모금 진행률(percent)만 반환           |
| POST   | `/api/account`        | `{code}` 검증 → 계좌 공개             |
| GET    | `/api/supporters`     | 후원자 이름 목록                      |
| POST   | `/api/supporters`     | `{code, name}` 검증 후 이름 등록      |
| POST   | `/api/admin/progress` | `{adminCode, percent}` 진행률 갱신    |

---

## 🛠 운영 팁

- **진행률 올리기**: 배포된 사이트에서 `…/#admin` 으로 접속 → 관리자 코드 입력 →
  슬라이더로 진행률 조절 → 저장. (송금이 들어올 때마다 직접 올려주세요)
- **비밀코드 공유**: `SUPPORTER_CODE` 를 친구들에게 알려주면 계좌가 보입니다.
- 실제 결제 위젯은 없습니다. 계좌 송금 기반의 "마음 펀딩"입니다.
