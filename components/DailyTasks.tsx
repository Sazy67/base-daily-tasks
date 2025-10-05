'use client'

import { useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  reward: number
  type: 'social' | 'interaction' | 'referral'
}

const DAILY_TASKS: Task[] = [
  {
    id: 'connect_wallet',
    title: 'Cüzdan Bağla',
    description: 'Base ağında cüzdanını bağla',
    reward: 10,
    type: 'interaction'
  },
  {
    id: 'share_app',
    title: 'Uygulamayı Paylaş',
    description: 'Sosyal medyada uygulamayı paylaş',
    reward: 25,
    type: 'social'
  },
  {
    id: 'invite_friend',
    title: 'Arkadaş Davet Et',
    description: 'Bir arkadaşını uygulamaya davet et',
    reward: 50,
    type: 'referral'
  },
  {
    id: 'daily_checkin',
    title: 'Günlük Giriş',
    description: 'Bugün uygulamaya giriş yap',
    reward: 15,
    type: 'interaction'
  },
  {
    id: 'spin_wheel',
    title: 'Çarkıfelek Çevir',
    description: 'Günlük çarkıfelek hakkını kullan',
    reward: 20,
    type: 'interaction'
  }
]

interface DailyTasksProps {
  completedTasks: string[]
  onTaskComplete: (taskId: string, reward: number) => void
}

export function DailyTasks({ completedTasks, onTaskComplete }: DailyTasksProps) {
  const [processingTask, setProcessingTask] = useState<string | null>(null)

  const handleTaskComplete = async (task: Task) => {
    if (completedTasks.includes(task.id) || processingTask) return

    setProcessingTask(task.id)
    
    // Simüle edilmiş görev tamamlama süreci
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onTaskComplete(task.id, task.reward)
    setProcessingTask(null)
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'social': return '📱'
      case 'interaction': return '⚡'
      case 'referral': return '👥'
      default: return '✨'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Günlük Görevler
      </h2>
      
      <div className="space-y-4">
        {DAILY_TASKS.map((task) => {
          const isCompleted = completedTasks.includes(task.id)
          const isProcessing = processingTask === task.id
          
          return (
            <div
              key={task.id}
              className={`task-card ${isCompleted ? 'completed-task' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">
                    {getTaskIcon(task.type)}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {task.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-blue-600">
                    +{task.reward} puan
                  </span>
                  
                  {isCompleted ? (
                    <span className="text-green-600 font-medium">
                      ✅ Tamamlandı
                    </span>
                  ) : (
                    <button
                      onClick={() => handleTaskComplete(task)}
                      disabled={isProcessing}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isProcessing
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isProcessing ? 'İşleniyor...' : 'Tamamla'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>İpucu:</strong> Tüm günlük görevleri tamamlayarak bonus puan kazanabilirsin!
        </p>
      </div>
    </div>
  )
}