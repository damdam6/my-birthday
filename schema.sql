-- 내 생일 선물 펀딩 - 데이터베이스 스키마
-- Neon(또는 모든 PostgreSQL) 콘솔의 SQL 에디터에서 한 번 실행하세요.

-- 후원자 이름 (하단 엔딩 크레딧 롤에 사용)
CREATE TABLE IF NOT EXISTS supporters (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS supporters_created_at_idx ON supporters (created_at DESC);

-- 모금 진행률 (관리자가 수동으로 갱신하는 단일 행, 0~100)
CREATE TABLE IF NOT EXISTS funding (
  id          INT         PRIMARY KEY,
  percent     INT         NOT NULL DEFAULT 0 CHECK (percent BETWEEN 0 AND 100),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 진행률 행 1개를 미리 만들어 둡니다.
INSERT INTO funding (id, percent) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
