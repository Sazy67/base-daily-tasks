export interface Task {
  id: string
  title: string
  description: string
  reward: number
  feeAmount: string // ETH cinsinden fee miktarı
  completed: boolean
  type: 'transaction' | 'social' | 'interaction'
  minBalance?: string // Minimum ETH bakiyesi gereksinimi
}

export const DAILY_TASKS: Task[] = [
  {
    id: 'daily_checkin',
    title: '📅 Günlük Giriş',
    description: '5 gün üst üste uygulamaya giriş yapın',
    reward: 100,
    feeAmount: '0.0005',
    completed: false,
    type: 'interaction'
  },
  {
    id: 'share_social',
    title: '📱 Sosyal Medya Paylaşımı',
    description: '@suatayaz_ takip edin ve Base Daily Tasks\'ı Twitter\'da paylaşın #BaseDailyTasks',
    reward: 100,
    feeAmount: '0.001',
    completed: false,
    type: 'social'
  },
  {
    id: 'invite_friend',
    title: '👥 Arkadaş Davet Et',
    description: 'Referans kodunuzla arkadaş davet edin',
    reward: 250,
    feeAmount: '0.001',
    completed: false,
    type: 'social'
  },
  {
    id: 'make_transaction',
    title: '💸 İşlem Yap',
    description: 'Base ağında 0.005 ETH değerinde işlem yapın',
    reward: 120,
    feeAmount: '0.001',
    completed: false,
    type: 'transaction',
    minBalance: '0.008'
  },
  {
    id: 'nft_interaction',
    title: '🎨 NFT İşlemi',
    description: 'Base ağında NFT mint veya transfer yapın',
    reward: 150,
    feeAmount: '0.0015',
    completed: false,
    type: 'transaction',
    minBalance: '0.01'
  },
  {
    id: 'bridge_funds',
    title: '🌉 Bridge İşlemi',
    description: 'Ethereum\'dan Base\'e 0.02 ETH bridge yapın',
    reward: 200,
    feeAmount: '0.002',
    completed: false,
    type: 'transaction',
    minBalance: '0.025'
  }
]

export const SPIN_WHEEL_COST = '0.002' // ETH cinsinden çarkıfelek maliyeti
export const SPIN_WHEEL_FEE = '0.001' // Sizin fee payınız

// Referans sistemi
export const REFERRAL_BONUS = 100 // Referans başına puan
export const REFERRAL_FEE = '0.001' // Referans fee'si