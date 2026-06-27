interface GiftPhotosProps {
  images: string[] // [0] = 메인(중요), [1] = 보조(팜레스트 등, 덜 중요)
  alt: string
}

// 메인 사진 1장은 크게, 나머지(보조)는 작게 — 둘 다 노출하되 중요도 차이를 둠
export function GiftPhotos({ images, alt }: GiftPhotosProps) {
  const [main, ...rest] = images
  return (
    <div className="gift-photos">
      <div className="gift-photos__main">
        <img src={main} alt={alt} draggable={false} />
      </div>
      {rest.map((src, i) => (
        <div className="gift-photos__sub" key={src}>
          <div className="gift-photos__subframe">
            <img src={src} alt={`${alt} 참고 ${i + 1}`} draggable={false} />
          </div>
          <div className="gift-photos__cap">참고 사진</div>
        </div>
      ))}
    </div>
  )
}
