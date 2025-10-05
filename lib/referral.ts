export interface ReferralData {
  referrerAddress: string
  referredAddress: string
  timestamp: Date
  rewardClaimed: boolean
  taskCompleted: boolean
}

export class ReferralSystem {
  private static instance: ReferralSystem
  private referrals: ReferralData[] = []

  static getInstance(): ReferralSystem {
    if (!ReferralSystem.instance) {
      ReferralSystem.instance = new ReferralSystem()
    }
    return ReferralSystem.instance
  }

  // Referans kodu oluştur (cüzdan adresinden)
  generateReferralCode(address: string): string {
    return address.slice(2, 8).toUpperCase()
  }

  // Referans kodu ile cüzdan adresi bul
  getAddressFromCode(code: string): string | null {
    // Bu basit implementasyon için localStorage'da saklanan kodları kontrol edelim
    const savedCodes = localStorage.getItem('referralCodes')
    if (savedCodes) {
      const codes = JSON.parse(savedCodes)
      return codes[code] || null
    }
    return null
  }

  // Referans kodunu kaydet
  saveReferralCode(address: string, code: string): void {
    const savedCodes = localStorage.getItem('referralCodes')
    const codes = savedCodes ? JSON.parse(savedCodes) : {}
    codes[code] = address
    localStorage.setItem('referralCodes', JSON.stringify(codes))
  }

  // Referans ekle
  addReferral(referrerAddress: string, referredAddress: string): boolean {
    // Aynı kişi kendini davet edemez
    if (referrerAddress.toLowerCase() === referredAddress.toLowerCase()) {
      return false
    }

    // Zaten davet edilmiş mi kontrol et
    const existing = this.referrals.find(r => 
      r.referredAddress.toLowerCase() === referredAddress.toLowerCase()
    )
    if (existing) {
      return false
    }

    const referral: ReferralData = {
      referrerAddress,
      referredAddress,
      timestamp: new Date(),
      rewardClaimed: false,
      taskCompleted: false
    }

    this.referrals.push(referral)
    this.saveToStorage()
    return true
  }

  // Kullanıcının davet ettiği kişi sayısı
  getReferralCount(address: string): number {
    return this.referrals.filter(r => 
      r.referrerAddress.toLowerCase() === address.toLowerCase() && 
      r.taskCompleted
    ).length
  }

  // Kullanıcının toplam referans ödülü
  getTotalReferralRewards(address: string): number {
    return this.referrals.filter(r => 
      r.referrerAddress.toLowerCase() === address.toLowerCase() && 
      r.rewardClaimed
    ).length * 250 // Her referans için 250 puan
  }

  // Referans görevini tamamla
  completeReferralTask(referredAddress: string): void {
    const referral = this.referrals.find(r => 
      r.referredAddress.toLowerCase() === referredAddress.toLowerCase()
    )
    if (referral) {
      referral.taskCompleted = true
      this.saveToStorage()
    }
  }

  // Referans ödülünü talep et
  claimReferralReward(referrerAddress: string, referredAddress: string): boolean {
    const referral = this.referrals.find(r => 
      r.referrerAddress.toLowerCase() === referrerAddress.toLowerCase() &&
      r.referredAddress.toLowerCase() === referredAddress.toLowerCase() &&
      r.taskCompleted && !r.rewardClaimed
    )
    
    if (referral) {
      referral.rewardClaimed = true
      this.saveToStorage()
      return true
    }
    return false
  }

  // Kullanıcının referans bilgileri
  getUserReferralInfo(address: string) {
    const referralCode = this.generateReferralCode(address)
    const referredBy = this.referrals.find(r => 
      r.referredAddress.toLowerCase() === address.toLowerCase()
    )
    const referralCount = this.getReferralCount(address)
    const totalRewards = this.getTotalReferralRewards(address)
    
    return {
      referralCode,
      referredBy: referredBy?.referrerAddress || null,
      referralCount,
      totalRewards,
      referralLink: `${window.location.origin}?ref=${referralCode}`
    }
  }

  // URL'den referans kodunu al
  getReferralFromURL(): string | null {
    if (typeof window === 'undefined') return null
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('ref')
  }

  // LocalStorage'a kaydet
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('referralData', JSON.stringify(this.referrals))
    }
  }

  // LocalStorage'dan yükle
  loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('referralData')
      if (saved) {
        this.referrals = JSON.parse(saved).map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp)
        }))
      }
    }
  }

  // Tüm referansları getir
  getAllReferrals(): ReferralData[] {
    return [...this.referrals]
  }
}