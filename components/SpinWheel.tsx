'use client'

import { useState } from 'react'

interface Prize {
  id: string
  label: string
  points: number
  color: string
  probability: number
}

const PRIZES: Prize[] = [
  { id: '1', label: '5 Puan', points: 5, color: '#FF6B6B', probability: 30 },
  { id: '2', label: '10 Puan', points: 10, color: '#4ECDC4', probability: 25 },
  { id: '3', label: '25 Puan', points: 25, color: '#45B7D1', probability: 20 },
  { id: '4', label: '50 Puan', points: 50, color: '#96CEB4', probability: 15 },
  { id: '5', label: '100 Puan', points: 100, color: '#FFEAA7', probability: 8 },
  { id: '6', label: '500 Puan', points: 500, color: '#DDA0DD', probability: 2 }
]

interface SpinWheelProps {
  userPoints: number
  onSpinComplete: (points: number) => void
}

export function SpinWheel({ userPoints, onSpinComplete }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [lastSpin, setLastSpin] = useState<Date | null>(null)
  const [spinCost] = useState(10) // Her çevirme 10 puan

  const canSpin = () => {
    if (userPoints < spinCost) return false
    if (!lastSpin) return true
    
    const now = new Date()
    const timeDiff = now.getTime() - lastSpin.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    return hoursDiff >= 1 // Saatte bir çevirebilir
  }

  const getRandomPrize = (): Prize => {
    const random = Math.random() * 100
    let cumulative = 0
    
    for (const prize of PRIZES) {
      cumulative += prize.probability
      if (random <= cumulative) {
        return prize
      }
    }
    
    return PRIZES[0] // Fallback
  }

  const handleSpin = () => {
    if (!canSpin() || isSpinning) return

    setIsSpinning(true)
    
    // Rastgele ödül seç
    const prize = getRandomPrize()
    const prizeIndex = PRIZES.findIndex(p => p.id === prize.id)
    
    // Çarkın dönme açısını hesapla
    const segmentAngle = 360 / PRIZES.length
    const targetAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2)
    const spins = 5 + Math.random() * 5 // 5-10 tam tur
    const finalRotation = rotation + (spins * 360) + (360 - targetAngle)
    
    setRotation(finalRotation)
    
    // Çevirme maliyetini düş
    onSpinComplete(-spinCost)
    
    setTimeout(() => {
      // Ödülü ver
      onSpinComplete(prize.points)
      setLastSpin(new Date())
      setIsSpinning(false)
      
      alert(`🎉 Tebrikler! ${prize.points} puan kazandınız!`)
    }, 3000)
  }

  const getTimeUntilNextSpin = () => {
    if (!lastSpin) return null
    
    const now = new Date()
    const nextSpin = new Date(lastSpin.getTime() + (60 * 60 * 1000)) // 1 saat sonra
    
    if (now >= nextSpin) return null
    
    const diff = nextSpin.getTime() - now.getTime()
    const minutes = Math.ceil(diff / (1000 * 60))
    
    return minutes
  }

  const nextSpinMinutes = getTimeUntilNextSpin()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Şans Çarkı
      </h2>
      
      <div className="relative mx-auto w-64 h-64 mb-6">
        {/* Çark */}
        <div
          className="spin-wheel w-full h-full rounded-full border-4 border-gray-300 relative overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${PRIZES.map((prize, index) => {
              const startAngle = (index * 360) / PRIZES.length
              const endAngle = ((index + 1) * 360) / PRIZES.length
              return `${prize.color} ${startAngle}deg ${endAngle}deg`
            }).join(', ')})`
          }}
        >
          {PRIZES.map((prize, index) => {
            const angle = (index * 360) / PRIZES.length + (360 / PRIZES.length / 2)
            return (
              <div
                key={prize.id}
                className="absolute text-white font-bold text-sm"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-80px)`,
                  transformOrigin: 'center'
                }}
              >
                <span style={{ transform: `rotate(-${angle}deg)` }}>
                  {prize.label}
                </span>
              </div>
            )
          })}
        </div>
        
        {/* Ok işareti */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          Çevirme maliyeti: {spinCost} puan
        </p>
        
        {nextSpinMinutes && (
          <p className="text-sm text-orange-600">
            Sonraki çevirme: {nextSpinMinutes} dakika sonra
          </p>
        )}
        
        <button
          onClick={handleSpin}
          disabled={!canSpin() || isSpinning}
          className={`spin-button w-full ${
            !canSpin() || isSpinning
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-105'
          }`}
        >
          {isSpinning ? 'Çevriliyor...' : 'Çarkı Çevir!'}
        </button>
        
        {userPoints < spinCost && (
          <p className="text-sm text-red-600">
            Yetersiz puan! En az {spinCost} puana ihtiyacınız var.
          </p>
        )}
      </div>
    </div>
  )
}