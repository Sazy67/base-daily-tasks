'use client'

import { useState, useEffect } from 'react'
import { Web3Service } from '@/lib/web3'
import { DAILY_TASKS, SPIN_WHEEL_COST, SPIN_WHEEL_FEE, Task } from '@/lib/tasks'
import { RevenueTracker } from '@/lib/revenue'
import { ReferralSystem } from '@/lib/referral'
import { baseSdk } from '@/lib/base-sdk'
import { FarcasterSDK } from '@/lib/farcaster-sdk'
import ThemeToggle from '@/components/ThemeToggle'

interface Prize {
  id: string
  label: string
  points: number
  color: string
  probability: number
}

const PRIZES: Prize[] = [
  { id: '1', label: '10 Puan', points: 10, color: '#FF6B6B', probability: 25 },
  { id: '2', label: '25 Puan', points: 25, color: '#4ECDC4', probability: 20 },
  { id: '3', label: '50 Puan', points: 50, color: '#45B7D1', probability: 18 },
  { id: '4', label: '100 Puan', points: 100, color: '#96CEB4', probability: 15 },
  { id: '5', label: '200 Puan', points: 200, color: '#FFEAA7', probability: 12 },
  { id: '6', label: '500 Puan', points: 500, color: '#DDA0DD', probability: 8 },
  { id: '7', label: '1000 Puan', points: 1000, color: '#FFD93D', probability: 2 }
]

export default function Home() {
  // State management
  const [points, setPoints] = useState(0)
  const [tasks, setTasks] = useState<Task[]>(DAILY_TASKS)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [lastSpin, setLastSpin] = useState<Date | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [ethBalance, setEthBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [totalEarnings, setTotalEarnings] = useState<string>('0')
  const [referralInfo, setReferralInfo] = useState<any>(null)
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState<string>('0x2105')
  const [networkName, setNetworkName] = useState<string>('Base Mainnet')
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<any[]>([])
  const [walletType, setWalletType] = useState<string>('')

  // Services
  const [web3Service] = useState(new Web3Service())
  const [revenueTracker] = useState(RevenueTracker.getInstance())
  const [referralSystem] = useState(ReferralSystem.getInstance())
  const [farcasterSDK] = useState(FarcasterSDK.getInstance())

  // Farcaster Frame context helper
  const getFarcasterFrameContext = async (): Promise<any> => {
    try {
      // Farcaster Frame API'sinden kullanıcı bilgilerini al
      if (typeof window !== 'undefined' && (window as any).parent) {
        // Frame context mesajı gönder
        const contextRequest = {
          type: 'frame_context_request',
          timestamp: Date.now()
        }
        
        // Parent window'a mesaj gönder
        window.parent.postMessage(contextRequest, '*')
        
        // Yanıt bekle
        return new Promise((resolve) => {
          const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'frame_context_response') {
              window.removeEventListener('message', handleMessage)
              resolve(event.data.context)
            }
          }
          
          window.addEventListener('message', handleMessage)
          
          // 5 saniye timeout
          setTimeout(() => {
            window.removeEventListener('message', handleMessage)
            resolve(null)
          }, 5000)
        })
      }
      
      // Fallback: URL parametrelerinden kullanıcı bilgilerini al
      const urlParams = new URLSearchParams(window.location.search)
      const fid = urlParams.get('fid')
      const username = urlParams.get('username')
      const address = urlParams.get('address')
      
      if (fid && address) {
        return {
          user: {
            fid: parseInt(fid),
            username: username || `user_${fid}`,
            custodyAddress: address,
            verifiedAddresses: [address]
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Farcaster Frame context alınamadı:', error)
      return null
    }
  }

  // Farcaster SDK Ready Signal - En öncelikli
  useEffect(() => {
    const sendReadySignal = async () => {
      try {
        console.log('🚀 Farcaster Mini App ready signal gönderiliyor...')
        
        // Farcaster SDK ready
        await farcasterSDK.ready()
        
        // Base SDK ready
        if ((window as any).sdk?.actions?.ready) {
          (window as any).sdk.actions.ready()
          console.log('✅ Base SDK ready() çağrıldı')
        }
        
        console.log('✅ Tüm ready signals gönderildi')
      } catch (error) {
        console.error('Ready signal error:', error)
      }
    }
    
    // Hemen ready signal gönder
    sendReadySignal()
    
    // Tekrar gönder (güvenlik için)
    setTimeout(sendReadySignal, 100)
    setTimeout(sendReadySignal, 500)
  }, [farcasterSDK])

  // Otomatik wallet initialization
  useEffect(() => {
    let mounted = true
    
    const initializeAutoWallet = async () => {
      if (!mounted) return
      
      try {
        console.log('🔄 Otomatik wallet detection başlatılıyor...')
        
        // Otomatik wallet bağlantısı dene
        await attemptAutoConnect()
        
      } catch (error) {
        console.error('Otomatik wallet başlatma hatası:', error)
      }
    }
    
    const attemptAutoConnect = async () => {
      try {
        console.log('🔗 Otomatik wallet bağlantısı deneniyor...')
        
        // Web3Service otomatik olarak environment'ı tespit eder
        const address = await web3Service.connectWallet()
        
        if (address && mounted) {
          console.log('✅ Otomatik wallet bağlandı:', address)
          
          setWalletAddress(address)
          setWalletConnected(true)
          setWalletType(web3Service.getWalletType())
          
          // Base ağına geç
          await web3Service.ensureBaseNetwork()
          
          // Bakiyeyi güncelle
          await updateBalance(address)
          
          // Referans bilgilerini güncelle
          const refInfo = referralSystem.getUserReferralInfo(address)
          setReferralInfo(refInfo)
          
          console.log(`🎉 ${web3Service.getWalletType()} otomatik bağlandı!`)
        } else {
          console.log('⚠️ Otomatik wallet bağlantısı başarısız')
        }
      } catch (error) {
        console.error('Otomatik wallet bağlantı hatası:', error)
        // Hata durumunda kullanıcı manuel bağlayabilir
      }
    }
    
    // Küçük bir gecikme ile başlat
    setTimeout(initializeAutoWallet, 500)
    
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    // LocalStorage'dan verileri yükle
    const savedPoints = localStorage.getItem('userPoints')
    const savedTasks = localStorage.getItem('userTasks')
    const savedLastSpin = localStorage.getItem('lastSpin')
    const savedWallet = localStorage.getItem('walletAddress')
    const savedEarnings = localStorage.getItem('totalEarnings')
    
    if (savedPoints) setPoints(parseInt(savedPoints))
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedLastSpin) setLastSpin(new Date(savedLastSpin))
    if (savedEarnings) setTotalEarnings(savedEarnings)
    
    if (savedWallet) {
      setWalletAddress(savedWallet)
      setWalletConnected(true)
      updateBalance(savedWallet)
      
      // Referans bilgilerini yükle
      const refInfo = referralSystem.getUserReferralInfo(savedWallet)
      setReferralInfo(refInfo)
    }
    
    // Gelir verilerini yükle
    revenueTracker.loadFromStorage()
    
    // Referans sistemini yükle
    referralSystem.loadFromStorage()
  }, [])

  const saveData = () => {
    localStorage.setItem('userPoints', points.toString())
    localStorage.setItem('userTasks', JSON.stringify(tasks))
    localStorage.setItem('totalEarnings', totalEarnings)
    if (lastSpin) localStorage.setItem('lastSpin', lastSpin.toISOString())
    if (walletAddress) localStorage.setItem('walletAddress', walletAddress)
  }

  useEffect(() => {
    saveData()
  }, [points, tasks, lastSpin, walletAddress, totalEarnings])

  // Network monitoring - Safe implementation
  useEffect(() => {
    let mounted = true
    
    const checkNetwork = async () => {
      if (!mounted || !walletConnected) return
      
      try {
        // SADECE FARCASTER WALLET ÜZERİNDEN AĞ KONTROLÜ
        const chainId = await web3Service.getCurrentNetwork()
        
        if (mounted && chainId) {
          setCurrentNetwork(chainId)
          
          const networkNames: { [key: string]: string } = {
            '0x2105': 'Base Mainnet',
            '0x1': 'Ethereum Mainnet',
            '0x89': 'Polygon',
            '0xa4b1': 'Arbitrum One',
            '0xa': 'Optimism',
            '0x38': 'BNB Chain'
          }
          
          setNetworkName(networkNames[chainId] || `Ağ ${chainId}`)
        }
      } catch (error) {
        // Silent error handling to reduce console noise
        if (mounted) {
          setCurrentNetwork('0x2105') // Default to Base
          setNetworkName('Base Mainnet')
        }
      }
    }

    if (walletConnected) {
      checkNetwork()
    }
    
    // Network change listener - only if wallet is connected
    let chainChangeHandler: ((chainId: string) => void) | null = null
    let networkChangeHandler: ((event: any) => void) | null = null
    
    // FARCASTER WALLET EVENT LISTENER'LARI DEVRE DIŞI
    // Network değişikliklerini sadece manuel kontrol ile yapacağız
    // Çünkü Farcaster Wallet event listener'ları MetaMask hatalarına sebep oluyor
    
    if (walletConnected) {
      console.log('🟣 Farcaster Wallet bağlı - event listener\'lar devre dışı')
      
      // Sadece custom network change event'ini dinle
      networkChangeHandler = (event: any) => {
        if (!mounted || !event.detail) return
        
        const { chainId } = event.detail
        setCurrentNetwork(chainId)
        
        const networkNames: { [key: string]: string } = {
          '0x2105': 'Base Mainnet',
          '0x1': 'Ethereum Mainnet',
          '0x89': 'Polygon',
          '0xa4b1': 'Arbitrum One',
          '0xa': 'Optimism',
          '0x38': 'BNB Chain'
        }
        
        setNetworkName(networkNames[chainId] || `Ağ ${chainId}`)
      }
      
      try {
        // SADECE custom event listener - ethereum provider event'leri YOK
        window.addEventListener('networkChanged', networkChangeHandler)
      } catch (error) {
        // Silent error handling
      }
    }
    
    return () => {
      mounted = false
      
      // ETHEREUM PROVIDER EVENT LISTENER'LARI KALDIRILDI
      // Sadece custom event listener'ı temizle
      
      if (networkChangeHandler) {
        try {
          window.removeEventListener('networkChanged', networkChangeHandler)
        } catch (error) {
          // Silent error handling
        }
      }
    }
  }, [walletConnected])

  // Farcaster Frame wallet check - Simplified
  useEffect(() => {
    let mounted = true
    
    const checkFarcasterWallets = async () => {
      if (!mounted) return
      
      try {
        console.log('🔍 Farcaster wallets kontrol ediliyor...')
        const wallets = await web3Service.getAvailableWallets()
        
        if (mounted) {
          setAvailableWallets(wallets)
          console.log('✅ Farcaster wallets yüklendi:', wallets.length)
        }
      } catch (error) {
        console.log('⚠️ Wallet check error (normal):', error)
        if (mounted) {
          setAvailableWallets([{ name: 'Farcaster Wallet', provider: null, icon: '🟣' }])
        }
      }
    }
    
    // Hemen kontrol et
    setTimeout(checkFarcasterWallets, 500)
    
    return () => {
      mounted = false
    }
  }, [])

  const updateBalance = async (address: string) => {
    try {
      const balance = await web3Service.getBalance(address)
      setEthBalance(balance)
    } catch (error) {
      console.error('Bakiye güncelleme hatası:', error)
    }
  }

  const addEarnings = (amount: string) => {
    const current = parseFloat(totalEarnings)
    const newTotal = (current + parseFloat(amount)).toFixed(6)
    setTotalEarnings(newTotal)
  }

  const completeTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.completed || loading) return

    // Minimum bakiye kontrolü
    if (task.minBalance && parseFloat(ethBalance) < parseFloat(task.minBalance)) {
      alert(`❌ Bu görev için en az ${task.minBalance} ETH bakiyeniz olmalı!`)
      return
    }

    // Fee kontrolü
    if (parseFloat(ethBalance) < parseFloat(task.feeAmount)) {
      alert(`❌ Yetersiz bakiye! Bu görev için ${task.feeAmount} ETH fee gerekli.`)
      return
    }

    setLoading(true)

    try {
      // Özel görev işlemleri
      let success = false
      
      switch (taskId) {
        case 'make_transaction':
          // Küçük bir işlem yap
          const txHash = await web3Service.sendTransaction(walletAddress, '0.001')
          success = !!txHash
          if (success) alert(`✅ İşlem başarılı! Hash: ${txHash}`)
          break
          
        case 'share_social':
          // Önce takip sayfasını aç
          window.open('https://twitter.com/suatayaz_', '_blank')
          
          // Sonra tweet paylaşım sayfasını aç
          setTimeout(() => {
            const tweetText = encodeURIComponent('Base Daily Tasks ile günlük görevler yapıp puan kazanıyorum! 🚀 #BaseDailyTasks #BaseNetwork @suatayaz_')
            const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=https://base-daily-tasks.vercel.app`
            window.open(tweetUrl, '_blank')
          }, 2000)
          
          success = confirm('@suatayaz_ hesabını takip ettiniz ve tweet\'i paylaştınız mı?')
          break
          
        case 'hold_eth':
          // ETH bakiye kontrolü
          success = parseFloat(ethBalance) >= 0.1
          if (!success) alert('❌ En az 0.1 ETH bakiyeniz olmalı!')
          break
          
        case 'invite_friend':
          // Referans modalını aç
          setShowReferralModal(true)
          success = false // Modal'dan kontrol edilecek
          return // Fonksiyondan çık, modal'dan devam edilecek
          
        default:
          // Diğer görevler için basit onay
          success = confirm(`"${task.title}" görevini tamamladınız mı?`)
          break
      }

      if (success) {
        // Fee ödeme işlemi
        const feeHash = await web3Service.collectFee(task.feeAmount, walletAddress, 'task_fee', task.id)
        
        if (feeHash) {
          // Görev tamamlandı olarak işaretle
          setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, completed: true } : t
          ))
          setPoints(prev => prev + task.reward)
          
          // Kazancı kaydet
          addEarnings(task.feeAmount)
          
          // Bakiyeyi güncelle
          await updateBalance(walletAddress)
          
          alert(`✅ Görev tamamlandı! ${task.reward} puan kazandınız.\n💰 Fee: ${task.feeAmount} ETH\n📝 İşlem Hash: ${feeHash}`)
        } else {
          alert('❌ Fee ödeme işlemi başarısız oldu.')
        }
      }
    } catch (error) {
      console.error('Görev tamamlama hatası:', error)
      alert('❌ İşlem sırasında hata oluştu.')
    }

    setLoading(false)
  }

  // Farcaster Frame wallet bağlantısı
  const connectFarcasterWallet = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      console.log('🟣 Farcaster Frame wallet bağlantısı başlatılıyor...')
      
      // Önce Frame context'ini kontrol et
      const frameContext = await getFarcasterFrameContext()
      
      if (frameContext && (frameContext as any).user) {
        const { user } = frameContext as any
        const walletAddr = user.custodyAddress || user.verifiedAddresses?.[0]
        
        if (walletAddr) {
          console.log('✅ Farcaster kullanıcısı bulundu:', user.username)
          console.log('💰 Wallet adresi:', walletAddr)
          
          setWalletAddress(walletAddr)
          setWalletConnected(true)
          setWalletType('Farcaster Wallet')
          
          // Base ağına geç
          await web3Service.ensureBaseNetwork()
          
          // Bakiyeyi güncelle
          await updateBalance(walletAddr)
          
          // Referans bilgilerini güncelle
          const refInfo = referralSystem.getUserReferralInfo(walletAddr)
          setReferralInfo(refInfo)
          
          alert(`✅ Farcaster Wallet bağlandı!\n\n👤 Kullanıcı: ${user.username}\n📍 Adres: ${walletAddr.slice(0,8)}...${walletAddr.slice(-6)}\n🌐 Ağ: Base Mainnet\n\n🎯 Artık görevleri tamamlayabilirsiniz!`)
        } else {
          throw new Error('Farcaster kullanıcısının wallet adresi bulunamadı')
        }
      } else {
        // Fallback: Manuel wallet bağlantısı
        console.log('⚠️ Farcaster Frame context bulunamadı, manuel bağlantı deneniyor...')
        const address = await web3Service.connectWallet()
        
        if (address) {
          setWalletAddress(address)
          setWalletConnected(true)
          setWalletType('Farcaster Wallet')
          
          await web3Service.ensureBaseNetwork()
          await updateBalance(address)
          
          const refInfo = referralSystem.getUserReferralInfo(address)
          setReferralInfo(refInfo)
          
          alert(`✅ Wallet bağlandı!\n\n📍 Adres: ${address.slice(0,8)}...${address.slice(-6)}\n🌐 Ağ: Base Mainnet`)
        } else {
          throw new Error('Wallet bağlantısı başarısız')
        }
      }
    } catch (error: any) {
      console.error('❌ Farcaster wallet bağlantı hatası:', error)
      
      let errorMessage = 'Farcaster wallet bağlantısında hata oluştu.'
      
      if (error.message?.includes('context')) {
        errorMessage = 'Farcaster Frame context\'i alınamadı. Lütfen uygulamayı Farcaster üzerinden açın.'
      } else if (error.message?.includes('address')) {
        errorMessage = 'Farcaster hesabınızın wallet adresi bulunamadı.'
      }
      
      alert(`❌ ${errorMessage}\n\n💡 Lütfen uygulamayı Farcaster veya Warpcast üzerinden açın.`)
    }
    
    setLoading(false)
  }

  // ESKI WALLET BAĞLANTISI (Fallback)
  const connectWallet = async (selectedProvider?: any) => {
    if (loading) return // Zaten işlem devam ediyorsa çık
    
    setLoading(true)
    
    try {
      console.log('🟣 SADECE Farcaster Wallet bağlantısı başlatılıyor...')
      
      // Farcaster Wallet ile bağlan
      const address = await web3Service.connectWallet()
      
      if (address) {
        console.log('✅ Farcaster Wallet başarıyla bağlandı:', address)
        
        setWalletAddress(address)
        setWalletConnected(true)
        setWalletType('Farcaster Wallet') // Her zaman Farcaster
        setShowWalletSelector(false)
        
        // Base ağına geç
        console.log('🌐 Base ağına geçiliyor...')
        const switched = await web3Service.ensureBaseNetwork()
        if (!switched) {
          console.log('⚠️ Base ağına geçilemedi, devam ediliyor...')
        }
        
        // Bakiyeyi güncelle
        await updateBalance(address)
        
        // Referans bilgilerini güncelle
        const refInfo = referralSystem.getUserReferralInfo(address)
        setReferralInfo(refInfo)
        
        // Referans kodunu kaydet
        referralSystem.saveReferralCode(address, refInfo.referralCode)
        
        // URL'den referans kodu kontrol et
        const refCode = referralSystem.getReferralFromURL()
        if (refCode && refCode !== refInfo.referralCode) {
          const referrerAddress = referralSystem.getAddressFromCode(refCode)
          if (referrerAddress) {
            const success = referralSystem.addReferral(referrerAddress, address)
            if (success) {
              alert(`🎉 Referans kodu kabul edildi!\n👥 Davet eden: ${referrerAddress.slice(0,8)}...`)
            }
          }
        }
        
        // Başarı mesajı - Farcaster özel
        alert(`✅ Farcaster Wallet başarıyla bağlandı!\n\n📍 Adres: ${address.slice(0,8)}...${address.slice(-6)}\n🟣 Cüzdan: Farcaster Wallet\n🌐 Ağ: Base Mainnet\n💰 Bakiye: ${parseFloat(ethBalance).toFixed(4)} ETH\n\n🎯 Artık görevleri tamamlayabilirsiniz!`)
        
      } else {
        console.log('❌ Farcaster Wallet bağlantısı başarısız')
        alert('❌ Farcaster Wallet bağlantısı başarısız!\n\nLütfen uygulamayı Farcaster üzerinden açın.')
      }
    } catch (error: any) {
      console.error('❌ Cüzdan bağlantı hatası:', error)
      
      let errorMessage = 'Cüzdan bağlantısında hata oluştu.'
      
      if (error.code === 4001) {
        errorMessage = 'Cüzdan bağlantısı kullanıcı tarafından reddedildi.'
      } else if (error.code === -32002) {
        errorMessage = 'Cüzdan zaten bir bağlantı isteği bekliyor. Lütfen cüzdanınızı kontrol edin.'
      } else if (error.message?.includes('network')) {
        errorMessage = 'Ağ bağlantısında sorun var. Lütfen Base ağına geçin.'
      }
      
      alert(`❌ ${errorMessage}`)
    }
    
    setLoading(false)
  }

  const handleWalletSelection = async () => {
    console.log('🟣 Farcaster Wallet seçimi başlatılıyor...')
    
    try {
      // Farcaster wallet kontrolü
      const wallets = await web3Service.getAvailableWallets()
      
      if (wallets.length === 0) {
        console.log('⚠️ Wallet listesi boş - direkt bağlantı deneniyor')
      }
      
      // Direkt Farcaster wallet bağlantısı
      console.log('🟣 Farcaster Wallet bağlantısı başlatılıyor...')
      await connectFarcasterWallet()
      
    } catch (error) {
      console.error('Farcaster wallet selection error:', error)
      alert('❌ Farcaster Wallet bağlantısında hata!\n\nLütfen uygulamayı Farcaster üzerinden açın.')
    }
  }

  const canSpin = () => {
    const totalCost = parseFloat(SPIN_WHEEL_COST) + parseFloat(SPIN_WHEEL_FEE)
    if (parseFloat(ethBalance) < totalCost) return false
    if (!lastSpin) return true
    
    const now = new Date()
    const timeDiff = now.getTime() - lastSpin.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    return hoursDiff >= 1
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
    
    return PRIZES[0]
  }

  const spinWheel = async () => {
    if (!canSpin() || isSpinning || loading) return

    setIsSpinning(true)
    setLoading(true)

    try {
      // Çevirme ücreti + fee öde
      const totalCost = (parseFloat(SPIN_WHEEL_COST) + parseFloat(SPIN_WHEEL_FEE)).toString()
      const feeHash = await web3Service.collectFee(totalCost, walletAddress, 'spin_fee')
      
      if (feeHash) {
        // Kazancı kaydet
        addEarnings(SPIN_WHEEL_FEE)
        
        const prize = getRandomPrize()
        const prizeIndex = PRIZES.findIndex(p => p.id === prize.id)
        const segmentAngle = 360 / PRIZES.length
        const targetAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2)
        const spins = 5 + Math.random() * 5
        const finalRotation = rotation + (spins * 360) + (360 - targetAngle)
        
        setRotation(finalRotation)
        
        setTimeout(async () => {
          setPoints(prev => prev + prize.points)
          setLastSpin(new Date())
          setIsSpinning(false)
          setLoading(false)
          
          // Bakiyeyi güncelle
          await updateBalance(walletAddress)
          
          alert(`🎉 Tebrikler! ${prize.points} puan kazandınız!\n💰 Maliyet: ${totalCost} ETH\n📝 İşlem Hash: ${feeHash}`)
        }, 3000)
      } else {
        setIsSpinning(false)
        setLoading(false)
        alert('❌ Çarkıfelek işlemi başarısız oldu.')
      }
    } catch (error) {
      console.error('Çarkıfelek hatası:', error)
      setIsSpinning(false)
      setLoading(false)
      alert('❌ İşlem sırasında hata oluştu.')
    }
  }

  const getLevel = () => Math.floor(points / 100) + 1
  const getProgress = () => points % 100

  // Ana sayfa artık direkt görev sayfası - cüzdan bağlantısı header'da

  return (
    <div className="container">
      <ThemeToggle />
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
          Base Daily Tasks
        </h1>
        
        {/* Farcaster Frame durumu */}
        {!walletConnected ? (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '15px', fontSize: '1.1rem' }}>
              🎯 Günlük görevleri tamamla • 🎰 Çarkıfelek çevir • 💰 ETH kazan
            </p>
            
            <div style={{
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid #8B5CF6',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🟣</div>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>Base Daily Tasks</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '15px' }}>
                🦊 Browser'da MetaMask • 🟣 Farcaster'da otomatik wallet • 🎭 Demo mode
              </p>
              
              <button 
                className="button" 
                onClick={connectFarcasterWallet}
                disabled={loading}
                style={{ 
                  fontSize: '1rem', 
                  padding: '12px 24px',
                  background: loading ? '#666' : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '10px'
                }}
              >
                {loading ? '⏳ Bağlanıyor...' : '🔗 Wallet Bağla'}
              </button>
              
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                💡 Otomatik wallet detection aktif
              </p>
            </div>
          </div>
        ) : (
          /* Cüzdan bağlıysa bilgileri göster */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', opacity: 0.9 }}>
                {walletType === 'MetaMask' ? '🦊' : walletType === 'Farcaster Wallet' ? '🟣' : '🎭'} {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <span style={{ color: 'white', opacity: 0.9 }}>
                💰 {parseFloat(ethBalance).toFixed(4)} ETH
              </span>
              <span style={{ 
                color: currentNetwork === '0x2105' ? '#22c55e' : '#ff6b6b',
                backgroundColor: currentNetwork === '0x2105' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                border: `1px solid ${currentNetwork === '0x2105' ? '#22c55e' : '#ff6b6b'}`
              }}>
                🌐 {networkName}
              </span>
              <span style={{ color: 'white', opacity: 0.9 }}>
                📊 Seviye {getLevel()}
              </span>
            </div>
          <button
            onClick={() => {
              if (confirm('Cüzdan bağlantısını kesmek istediğinizden emin misiniz?')) {
                setWalletConnected(false)
                setWalletAddress('')
                setEthBalance('0')
                setReferralInfo(null)
                localStorage.removeItem('walletAddress')
                window.location.reload()
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🔌 Bağlantıyı Kes
          </button>
          </div>
        )}
        <p style={{ color: '#FFD93D', fontSize: '0.9rem', marginTop: '5px' }}>
          💸 Toplam Kazancınız: {parseFloat(totalEarnings).toFixed(6)} ETH
        </p>
        
        {currentNetwork !== '0x2105' && (
          <div style={{
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '10px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>
              ⚠️ Base ağında değilsiniz! Görevleri tamamlamak için Base ağına geçin.
            </p>
            <button
              onClick={async () => {
                const switched = await web3Service.ensureBaseNetwork()
                if (switched) {
                  window.location.reload()
                }
              }}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              🔄 Base Ağına Geç
            </button>
          </div>
        )}
      </header>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-number">{points.toLocaleString()}</div>
          <div className="stat-label">Toplam Puan</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{parseFloat(ethBalance).toFixed(4)}</div>
          <div className="stat-label">ETH Bakiye</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{tasks.filter(t => t.completed).length}</div>
          <div className="stat-label">Tamamlanan Görev</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{getLevel()}</div>
          <div className="stat-label">Seviye</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div className="card">
          <h2 style={{ marginBottom: '20px', color: '#333' }}>🎯 Günlük Görevler</h2>
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'task-completed' : ''}`}
            >
              <div>
                <h3 style={{ marginBottom: '4px' }}>{task.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>
                    💸 Fee: {task.feeAmount} ETH
                  </span>
                  {task.minBalance && (
                    <span style={{ color: '#ff9500', fontSize: '0.8rem' }}>
                      💎 Min: {task.minBalance} ETH
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#667eea', fontWeight: 'bold', marginBottom: '8px' }}>
                  +{task.reward} puan
                </div>
                {task.completed ? (
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✅ Tamamlandı</span>
                ) : (
                  <button 
                    className="button"
                    onClick={() => {
                      if (!walletConnected) {
                        handleWalletSelection()
                      } else {
                        completeTask(task.id)
                      }
                    }}
                    disabled={loading || (walletConnected && parseFloat(ethBalance) < parseFloat(task.feeAmount))}
                  >
                    {loading ? 'İşleniyor...' : !walletConnected ? '🔗 Bağlan' : 'Tamamla'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🎰 Şans Çarkı</h2>
          
          <div className="spin-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="wheel-pointer"></div>
            {PRIZES.map((prize, index) => {
              const angle = (index * 360) / PRIZES.length
              return (
                <div
                  key={prize.id}
                  className="wheel-segment"
                  style={{
                    background: prize.color,
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${-angle + 25}deg)`,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}>
                    {prize.label}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '10px', color: '#666', fontSize: '0.9rem' }}>
              💰 Maliyet: {SPIN_WHEEL_COST} ETH + {SPIN_WHEEL_FEE} ETH fee
            </p>
            {!canSpin() && parseFloat(ethBalance) >= parseFloat(SPIN_WHEEL_COST) && (
              <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '10px' }}>
                ⏰ Sonraki çevirme: {Math.ceil(60 - ((new Date().getTime() - (lastSpin?.getTime() || 0)) / (1000 * 60)))} dakika
              </p>
            )}
            <button 
              className="button"
              onClick={() => {
                if (!walletConnected) {
                  handleWalletSelection()
                } else {
                  spinWheel()
                }
              }}
              disabled={loading || isSpinning || (walletConnected && !canSpin())}
              style={{ width: '100%' }}
            >
              {loading ? 'İşleniyor...' : isSpinning ? 'Çevriliyor...' : !walletConnected ? '🔗 Bağlan' : '🎰 Çarkı Çevir!'}
            </button>
            {parseFloat(ethBalance) < (parseFloat(SPIN_WHEEL_COST) + parseFloat(SPIN_WHEEL_FEE)) && (
              <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '10px' }}>
                ❌ Yetersiz ETH! En az {(parseFloat(SPIN_WHEEL_COST) + parseFloat(SPIN_WHEEL_FEE)).toFixed(3)} ETH gerekli.
              </p>
            )}
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '10px' }}>📈 Seviye İlerlemesi</h4>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${getProgress()}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              Sonraki seviyeye {100 - getProgress()} puan
            </p>
          </div>
        </div>
      </div>

      {/* Referans Modal */}
      {showReferralModal && referralInfo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', margin: '20px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>👥 Arkadaş Davet Et</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                🔗 Referans Linkiniz:
              </label>
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <input
                  type="text"
                  value={referralInfo.referralLink}
                  readOnly
                  style={{
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  className="button"
                  onClick={() => {
                    navigator.clipboard.writeText(referralInfo.referralLink)
                    alert('📋 Link kopyalandı!')
                  }}
                  style={{ padding: '5px 15px', fontSize: '0.8rem' }}
                >
                  Kopyala
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                🎯 Referans Kodunuz:
              </label>
              <div style={{ 
                padding: '15px',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1976d2',
                letterSpacing: '2px'
              }}>
                {referralInfo.referralCode}
              </div>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '10px' }}>📊 Referans İstatistikleriniz:</h4>
              <p>👥 Davet Edilen: {referralInfo.referralCount} kişi</p>
              <p>🏆 Kazanılan Puan: {referralInfo.totalRewards}</p>
              {referralInfo.referredBy && (
                <p>🎯 Sizi Davet Eden: {referralInfo.referredBy.slice(0,8)}...</p>
              )}
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '10px' }}>💡 Nasıl Çalışır?</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.9rem' }}>
                <li>Referans linkinizi arkadaşlarınızla paylaşın</li>
                <li>Arkadaşınız linke tıklayıp cüzdan bağlasın</li>
                <li>Arkadaşınız herhangi bir görev tamamlasın</li>
                <li>Siz 250 puan kazanın! 🎉</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="button"
                onClick={() => {
                  // WhatsApp ile paylaş
                  const message = encodeURIComponent(`🚀 Base Daily Tasks'a katıl ve günlük görevlerle ETH kazan!\n\n🎯 Referans kodum: ${referralInfo.referralCode}\n🔗 Link: ${referralInfo.referralLink}\n\n#BaseDailyTasks #BaseNetwork`)
                  window.open(`https://wa.me/?text=${message}`, '_blank')
                }}
              >
                📱 WhatsApp'ta Paylaş
              </button>
              <button
                className="button"
                onClick={() => {
                  // Twitter'da paylaş
                  const message = encodeURIComponent(`🚀 Base Daily Tasks'a katıl ve günlük görevlerle ETH kazan!\n\n🎯 Referans kodum: ${referralInfo.referralCode}\n🔗 ${referralInfo.referralLink}\n\n#BaseDailyTasks #BaseNetwork @suatayaz_`)
                  window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank')
                }}
              >
                🐦 Twitter'da Paylaş
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={async () => {
                  const referralCount = referralSystem.getReferralCount(walletAddress)
                  if (referralCount >= 1) {
                    // Görev tamamlanabilir
                    setShowReferralModal(false)
                    await completeTask('invite_friend')
                  } else {
                    alert('❌ En az 1 arkadaşınızın görev tamamlaması gerekiyor!')
                  }
                }}
                className="button"
                style={{ marginRight: '10px' }}
              >
                ✅ Görevi Tamamla
              </button>
              <button
                onClick={() => setShowReferralModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                ❌ Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Selection Modal */}
      {showWalletSelector && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
              🔗 Cüzdan Seçin
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {availableWallets.map((wallet, index) => (
                <button
                  key={index}
                  onClick={() => connectWallet(wallet.provider)}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px 20px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1.1rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.backgroundColor = '#f8f9ff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.backgroundColor = 'white'
                    }
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{wallet.icon}</span>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>{wallet.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Farcaster built-in wallet
                    </div>
                  </div>
                  <span style={{ color: '#667eea' }}>→</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowWalletSelector(false)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ❌ İptal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}