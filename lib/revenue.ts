export interface RevenueRecord {
  id: string
  timestamp: Date
  type: 'task_fee' | 'spin_fee' | 'referral_bonus'
  amount: string // ETH cinsinden
  taskId?: string
  userAddress: string
  txHash: string
}

export class RevenueTracker {
  private static instance: RevenueTracker
  private revenues: RevenueRecord[] = []

  static getInstance(): RevenueTracker {
    if (!RevenueTracker.instance) {
      RevenueTracker.instance = new RevenueTracker()
    }
    return RevenueTracker.instance
  }

  // Gelir kaydı ekle
  addRevenue(record: Omit<RevenueRecord, 'id' | 'timestamp'>): void {
    const revenue: RevenueRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    this.revenues.push(revenue)
    this.saveToStorage()
    
    // Console'da gelir bildirimi
    console.log(`💰 Yeni Gelir: ${record.amount} ETH - ${record.type}`)
  }

  // Toplam gelir hesapla
  getTotalRevenue(): number {
    return this.revenues.reduce((total, record) => {
      return total + parseFloat(record.amount)
    }, 0)
  }

  // Günlük gelir
  getDailyRevenue(): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return this.revenues
      .filter(record => record.timestamp >= today)
      .reduce((total, record) => total + parseFloat(record.amount), 0)
  }

  // Aylık gelir
  getMonthlyRevenue(): number {
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    return this.revenues
      .filter(record => record.timestamp >= thisMonth)
      .reduce((total, record) => total + parseFloat(record.amount), 0)
  }

  // Gelir türüne göre breakdown
  getRevenueByType(): Record<string, number> {
    const breakdown: Record<string, number> = {}
    
    this.revenues.forEach(record => {
      if (!breakdown[record.type]) {
        breakdown[record.type] = 0
      }
      breakdown[record.type] += parseFloat(record.amount)
    })
    
    return breakdown
  }

  // En aktif kullanıcılar
  getTopUsers(limit: number = 10): Array<{address: string, totalSpent: number}> {
    const userSpending: Record<string, number> = {}
    
    this.revenues.forEach(record => {
      if (!userSpending[record.userAddress]) {
        userSpending[record.userAddress] = 0
      }
      userSpending[record.userAddress] += parseFloat(record.amount)
    })
    
    return Object.entries(userSpending)
      .map(([address, totalSpent]) => ({ address, totalSpent }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit)
  }

  // LocalStorage'a kaydet
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('revenueRecords', JSON.stringify(this.revenues))
    }
  }

  // LocalStorage'dan yükle
  loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('revenueRecords')
      if (saved) {
        this.revenues = JSON.parse(saved).map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }))
      }
    }
  }

  // Tüm kayıtları getir
  getAllRecords(): RevenueRecord[] {
    return [...this.revenues].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // İstatistikleri getir
  getStats() {
    const total = this.getTotalRevenue()
    const daily = this.getDailyRevenue()
    const monthly = this.getMonthlyRevenue()
    const byType = this.getRevenueByType()
    const topUsers = this.getTopUsers(5)
    
    return {
      total,
      daily,
      monthly,
      byType,
      topUsers,
      totalTransactions: this.revenues.length,
      averageTransaction: total / (this.revenues.length || 1)
    }
  }
}