'use client'

interface UserStatsProps {
  points: number
}

export function UserStats({ points }: UserStatsProps) {
  const getLevel = (points: number) => {
    return Math.floor(points / 100) + 1
  }

  const getProgressToNextLevel = (points: number) => {
    return points % 100
  }

  const level = getLevel(points)
  const progress = getProgressToNextLevel(points)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        İstatistikler
      </h2>
      
      <div className="space-y-6">
        {/* Toplam Puan */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {points.toLocaleString()}
          </div>
          <div className="text-gray-600">Toplam Puan</div>
        </div>
        
        {/* Seviye */}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            Seviye {level}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            Sonraki seviyeye {100 - progress} puan
          </div>
        </div>
        
        {/* Günlük Hedef */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              Günlük Hedef
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Günde 100 puan hedefine ulaş!
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((points % 100), 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Başarımlar */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Başarımlar</h3>
          <div className="space-y-2">
            <div className={`flex items-center space-x-2 ${points >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{points >= 50 ? '🏆' : '🔒'}</span>
              <span className="text-sm">İlk 50 Puan</span>
            </div>
            <div className={`flex items-center space-x-2 ${points >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{points >= 100 ? '🏆' : '🔒'}</span>
              <span className="text-sm">Yüzlük Kulüp</span>
            </div>
            <div className={`flex items-center space-x-2 ${points >= 500 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{points >= 500 ? '🏆' : '🔒'}</span>
              <span className="text-sm">Puan Avcısı</span>
            </div>
            <div className={`flex items-center space-x-2 ${points >= 1000 ? 'text-green-600' : 'text-gray-400'}`}>
              <span>{points >= 1000 ? '🏆' : '🔒'}</span>
              <span className="text-sm">Efsane Oyuncu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}