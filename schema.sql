-- 내 생일 선물 펀딩 - 데이터베이스 스키마
-- Neon(또는 모든 PostgreSQL) 콘솔의 SQL 에디터에서 한 번 실행하세요.

-- 후원자 (하단 엔딩 크레딧 롤에 사용) — 이름 + 한마디, 관리자 승인(approved) 후 노출
CREATE TABLE IF NOT EXISTS supporters (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL,
  message     TEXT,
  approved    BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS supporters_created_at_idx ON supporters (created_at DESC);

-- 이미 supporters 테이블이 있던 경우(구버전)를 위한 컬럼 추가
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE supporters ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;

-- 모금 현황 (관리자가 수동으로 갱신하는 단일 행)
--  goal_amount   = 목표 금액(원), raised_amount = 모은 금액(원)
--  진행률(percent)은 raised/goal 로 자동 계산하므로 따로 의미를 두지 않습니다.
CREATE TABLE IF NOT EXISTS funding (
  id            INT         PRIMARY KEY,
  percent       INT         NOT NULL DEFAULT 0 CHECK (percent BETWEEN 0 AND 100),
  goal_amount   BIGINT      NOT NULL DEFAULT 0 CHECK (goal_amount >= 0),
  raised_amount BIGINT      NOT NULL DEFAULT 0 CHECK (raised_amount >= 0),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 이미 funding 테이블이 있던 경우(구버전)를 위한 컬럼 추가
ALTER TABLE funding ADD COLUMN IF NOT EXISTS goal_amount   BIGINT NOT NULL DEFAULT 0;
ALTER TABLE funding ADD COLUMN IF NOT EXISTS raised_amount BIGINT NOT NULL DEFAULT 0;

-- 현황 행 1개를 미리 만들어 둡니다.
INSERT INTO funding (id, percent, goal_amount, raised_amount) VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
