import type { ReactNode } from 'react'
import { useReveal } from '../useReveal'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

// 스크롤 시 아래에서 위로 부드럽게 등장
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'reveal--shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
