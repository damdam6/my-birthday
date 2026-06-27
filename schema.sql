-- 내 생일 선물 펀딩 - 데이터베이스 스키마
-- Neon(또는 모든 PostgreSQL) 콘솔의 SQL 에디터에서 한 번 실행하세요.

CREATE TABLE IF NOT EXISTS pledges (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL,
  amount      INTEGER     NOT NULL CHECK (amount >= 100),
  tier        TEXT,
  message     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 최신순 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS pledges_created_at_idx ON pledges (created_at DESC);

-- (선택) 테스트용 샘플 데이터
-- INSERT INTO pledges (name, amount, tier, message) VALUES
--   ('익명의 천사', 10000, '치킨 후원자', '생일 축하해! 🎉'),
--   ('절친', 50000, '진정한 친구', '양말은 내가 안 줄게 ㅎㅎ');
