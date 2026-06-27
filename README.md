# 🎂 내 생일 선물 펀딩 프로젝트

> "올해는 양말 말고 진짜를 받고 싶다."

내 생일 선물을 직접 펀딩하는 컨셉의 **스크롤형 모바일 웹페이지**입니다.
와디즈/킥스타터 같은 펀딩 소개 페이지를 패러디했습니다. 후원하면 실시간으로
모금 게이지가 차오르고, 명예의 전당에 이름이 박제됩니다. 😇

- **프론트엔드**: React 18 + Vite (모바일 우선, 스크롤 등장 애니메이션)
- **백엔드**: Cloudflare Pages Functions (서버리스)
- **데이터베이스**: Neon Serverless PostgreSQL (무료 티어)

가벼움이 목표입니다 — JS 약 50KB(gzip), CSS 약 2.6KB.

---

## 📁 구조

```
.
├── index.html
├── src/                  # React 앱
│   ├── App.tsx           # 전체 페이지(섹션 구성)
│   ├── config.ts         # 이름·목표금액·리워드 등 설정 (여기만 고치면 됨)
│   ├── api.ts            # API 클라이언트
│   ├── components/       # ProgressBar, Backers, PledgeForm, Reveal
│   └── styles.css
├── functions/
│   └── api/
│       └── pledges.ts    # GET(목록+통계) / POST(후원 등록)
├── schema.sql            # DB 테이블 정의
└── wrangler.toml         # Cloudflare Pages 설정
```

---

## 🚀 시작하기

### 1. 데이터베이스 준비 (Neon)

1. [neon.tech](https://neon.tech) 가입 후 프로젝트 생성 (무료 티어, 카드 등록 불필요)
2. SQL 에디터에서 [`schema.sql`](./schema.sql) 내용을 실행
3. **Connection string**(`postgresql://...`)을 복사해 둡니다

> Neon 무료 플랜은 자동 과금이 없습니다. 한도를 넘으면 결제가 청구되는 게
> 아니라 일시 정지됩니다. 부담 없이 사용하세요.

### 2. 로컬 개발

```bash
npm install

# DB 연결 정보 설정
cp .dev.vars.example .dev.vars
# .dev.vars 파일을 열어 DATABASE_URL 채우기

# 프론트 + Functions 함께 실행 (http://localhost:8788)
npm run pages:dev
```

> 프론트엔드만 빠르게 보려면 `npm run dev` (단, API는 동작하지 않음).

### 3. 내용 커스터마이징

[`src/config.ts`](./src/config.ts) 에서 이름, 생일, 목표 금액, 꿈의 선물,
리워드 등급을 바꾸면 페이지 전체가 그에 맞게 바뀝니다.

---

## ☁️ Cloudflare Pages 배포

### 방법 A — 대시보드(GitHub 연동) 추천

1. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git**
2. 이 저장소를 선택하고 빌드 설정 입력:
   - **Framework preset**: `None` (또는 Vite)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. **Settings → Environment variables**(Production/Preview 모두)에
   `DATABASE_URL` 추가 → Neon connection string 입력
4. 배포 완료. `functions/` 디렉터리는 자동으로 API로 연결됩니다.

### 방법 B — CLI

```bash
# DB 시크릿 등록 (최초 1회)
npx wrangler pages secret put DATABASE_URL

# 빌드 + 배포
npm run deploy
```

---

## 🔌 API

| 메서드 | 경로            | 설명                              |
| ------ | --------------- | --------------------------------- |
| GET    | `/api/pledges`  | 후원 목록(최근 100건) + 합계 통계 |
| POST   | `/api/pledges`  | 새 후원 등록                      |

**POST 요청 본문**

```json
{
  "name": "익명의 천사",
  "amount": 10000,
  "tier": "치킨 후원자",
  "message": "생일 축하해!"
}
```

서버에서 이름(1~20자), 금액(100원 이상), 메시지(100자 이내)를 검증합니다.

---

## ⚠️ 참고

실제 결제 기능은 없습니다. "마음의 펀딩"이며, 후원 내역은 DB에 기록되어
모금 게이지와 명예의 전당에 반영됩니다. 진짜 결제(토스/카카오페이 등)를
붙이고 싶다면 `PledgeForm` 제출 시점에 결제 위젯을 연동하면 됩니다.
