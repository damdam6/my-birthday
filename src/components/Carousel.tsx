import { useState } from 'react'

interface CarouselProps {
  images: string[]
  alt: string
}

// 손그림 상품 이미지 캐러셀 ("1/N" 표시 + 좌우 스와이프/버튼)
export function Carousel({ images, alt }: CarouselProps) {
  const [i, setI] = useState(0)
  const [touchX, setTouchX] = useState<number | null>(null)
  const n = images.length

  const go = (next: number) => setI((next + n) % n)

  function onTouchStart(e: React.TouchEvent) {
    setTouchX(e.touches[0].clientX)
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1)
    setTouchX(null)
  }

  return (
    <div className="carousel">
      <div
        className="carousel__frame"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img src={images[i]} alt={`${alt} ${i + 1}`} draggable={false} />
        <span className="carousel__count">
          {i + 1}/{n}
        </span>
        {n > 1 && (
          <>
            <button
              className="carousel__nav carousel__nav--prev"
              onClick={() => go(i - 1)}
              aria-label="이전 이미지"
            >
              ‹
            </button>
            <button
              className="carousel__nav carousel__nav--next"
              onClick={() => go(i + 1)}
              aria-label="다음 이미지"
            >
              ›
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="carousel__dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`carousel__dot ${idx === i ? 'is-on' : ''}`}
              onClick={() => go(idx)}
              aria-label={`${idx + 1}번 이미지`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
