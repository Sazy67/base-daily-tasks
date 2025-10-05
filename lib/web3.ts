import { ethers } from 'ethers'
import { FarcasterSDK } from './farcaster-sdk'

declare global {
  interface Window {
    ethereum?: any
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private isConnecting: boolean = false
  private walletType: 'metamask' | 'farcaster' | 'demo' = 'demo'
  private farcasterSDK: FarcasterSDK

  constructor() {
    // Farcaster SDK'yı başlat
    this.farcasterSDK = FarcasterSDK.getInstance()

    // Otomatik environment detection
    this.detectEnvironment()
  }

  // Environment detection - Browser vs Farcaster Mini App
  private detectEnvironment() {
    if (typeof window === 'undefined') return

    try {
      // Farcaster SDK'dan environment bilgisini al
      const isInFarcaster = this.farcasterSDK.isInFarcaster()

      console.log('🔍 Environment Detection:', {
        isInFarcaster,
        sdkReady: this.farcasterSDK.isSDKReady()
      })

      if (isInFarcaster) {
        console.log('🟣 Farcaster Mini App ortamı tespit edildi')
        this.walletType = 'farcaster'
        this.initializeFarcasterMode()
      } else {
        // MetaMask kontrolü
        if (typeof window.ethereum !== 'undefined') {
          console.log('🦊 MetaMask tespit edildi')
          this.walletType = 'metamask'
          this.initializeBrowserMode()
        } else {
          console.log('🎭 Demo mode aktif')
          this.walletType = 'demo'
          this.initializeDemoMode()
        }
      }
    } catch (error) {
      console.error('Environment detection error:', error)
      this.walletType = 'demo'
      this.initializeDemoMode()
    }
  }

  // Farcaster Mini App mode
  private initializeFarcasterMode() {
    console.log('🟣 Farcaster Mini App mode başlatılıyor...')

    // Farcaster ready signal gönder
    this.farcasterSDK.ready()

    // Base RPC provider başlat
    try {
      const rpcUrl = 'https://mainnet.base.org'
      this.provider = new ethers.JsonRpcProvider(rpcUrl)
      console.log('✅ Farcaster Mini App - Base RPC provider hazır')
    } catch (error) {
      console.error('❌ Farcaster Mini App provider hatası:', error)
    }
  }

  // Browser mode - MetaMask detection
  private initializeBrowserMode() {
    console.log('🦊 Browser mode başlatılıyor - MetaMask aranıyor...')

    // MetaMask detection
    if (typeof window.ethereum !== 'undefined') {
      console.log('✅ MetaMask tespit edildi')
      // MetaMask provider'ı kullanmaya hazır
    } else {
      console.log('⚠️ MetaMask bulunamadı - demo mode')
      this.walletType = 'demo'
      this.initializeDemoMode()
    }
  }

  // Demo mode fallback
  private initializeDemoMode() {
    console.log('🎭 Demo mode başlatılıyor...')

    try {
      const rpcUrl = 'https://mainnet.base.org'
      this.provider = new ethers.JsonRpcProvider(rpcUrl)
      console.log('✅ Demo mode - Base RPC provider hazır')
    } catch (error) {
      console.error('❌ Demo mode provider hatası:', error)
    }
  }

  // Otomatik wallet bağlantısı
  async connectWallet(): Promise<string | null> {
    if (this.isConnecting) {
      console.log('🔄 Zaten bağlantı işlemi devam ediyor...')
      return null
    }

    this.isConnecting = true

    try {
      switch (this.walletType) {
        case 'farcaster':
          return await this.connectFarcasterWallet()
        case 'metamask':
          return await this.connectMetaMaskWallet()
        case 'demo':
        default:
          return await this.connectDemoWallet()
      }
    } finally {
      this.isConnecting = false
    }
  }

  // Farcaster Mini App Wallet bağlantısı
  private async connectFarcasterWallet(): Promise<string | null> {
    console.log('🟣 Farcaster Mini App Wallet bağlantısı başlatılıyor...')

    try {
      // 1. Farcaster SDK'dan kullanıcı bilgilerini al
      const user = this.farcasterSDK.getUser()

      if (user) {
        const walletAddr = this.farcasterSDK.getUserWalletAddress()

        if (walletAddr) {
          console.log('✅ Farcaster Mini App kullanıcısı bulundu:', user.username || user.displayName)
          console.log('�  FID:', user.fid)
          console.log('💰 Wallet adresi:', walletAddr)
          return walletAddr
        }
      }

      // 2. Farcaster context'i bekle (SDK henüz hazır değilse)
      if (!this.farcasterSDK.isSDKReady()) {
        console.log('⏳ Farcaster SDK hazır olması bekleniyor...')

        // 3 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 3000))

        const userAfterWait = this.farcasterSDK.getUser()
        if (userAfterWait) {
          const walletAddr = this.farcasterSDK.getUserWalletAddress()
          if (walletAddr) {
            console.log('✅ Farcaster kullanıcısı (gecikme sonrası) bulundu:', userAfterWait.username)
            return walletAddr
          }
        }
      }

      // 3. Fallback: window.ethereum varsa kullan (Farcaster built-in wallet)
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('🔄 Farcaster built-in ethereum provider deneniyor...')

        try {
          this.provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

          if (accounts && accounts.length > 0) {
            this.signer = await this.provider.getSigner()
            const address = await this.signer.getAddress()
            console.log('✅ Farcaster built-in wallet bağlandı:', address)
            return address
          }
        } catch (ethError) {
          console.log('⚠️ Ethereum provider hatası:', ethError)
        }
      }

      // 4. Son fallback: demo address
      console.log('⚠️ Hiçbir Farcaster wallet bulunamadı - demo address kullanılıyor')
      return '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'

    } catch (error) {
      console.error('❌ Farcaster Mini App Wallet bağlantı hatası:', error)
      return '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    }
  }

  // MetaMask Wallet bağlantısı
  private async connectMetaMaskWallet(): Promise<string | null> {
    console.log('🦊 MetaMask Wallet bağlantısı başlatılıyor...')

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask bulunamadı')
      }

      // MetaMask bağlantısı
      this.provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      if (!accounts || accounts.length === 0) {
        throw new Error('MetaMask hesapları bulunamadı')
      }

      this.signer = await this.provider.getSigner()
      const address = await this.signer.getAddress()

      console.log('✅ MetaMask Wallet bağlandı:', address)
      return address

    } catch (error: any) {
      console.error('❌ MetaMask bağlantı hatası:', error)

      if (error.code === 4001) {
        throw new Error('MetaMask bağlantısı kullanıcı tarafından reddedildi')
      } else if (error.code === -32002) {
        throw new Error('MetaMask zaten bir bağlantı isteği bekliyor')
      }

      throw new Error('MetaMask bağlantısında hata: ' + error.message)
    }
  }

  // Demo Wallet bağlantısı
  private async connectDemoWallet(): Promise<string | null> {
    console.log('🎭 Demo Wallet bağlantısı...')

    const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    console.log('✅ Demo wallet bağlandı:', demoAddress)
    return demoAddress
  }

  // Farcaster Frame context helper
  private async getFarcasterFrameContext(): Promise<any> {
    try {
      if (typeof window !== 'undefined' && window.parent) {
        // Frame context mesajı gönder
        const contextRequest = {
          type: 'frame_context_request',
          timestamp: Date.now()
        }

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

          // 3 saniye timeout
          setTimeout(() => {
            window.removeEventListener('message', handleMessage)
            resolve(null)
          }, 3000)
        })
      }

      // Fallback: URL parametrelerinden
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
      console.error('Farcaster Frame context error:', error)
      return null
    }
  }

  // Network yönetimi
  async ensureBaseNetwork(): Promise<boolean> {
    try {
      if (this.walletType === 'demo' || this.walletType === 'farcaster') {
        console.log('✅ Base RPC kullanılıyor - zaten Base ağında')
        this.dispatchNetworkChange('0x2105')
        return true
      }

      if (this.walletType === 'metamask' && window.ethereum) {
        console.log('🌐 MetaMask ağı kontrol ediliyor...')

        const chainId = await window.ethereum.request({ method: 'eth_chainId' })

        if (chainId === '0x2105') {
          console.log('✅ Zaten Base ağındasınız')
          return true
        }

        console.log('🔄 Base ağına geçiliyor...')

        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }],
          })

          console.log('✅ Base ağına başarıyla geçildi')
          this.dispatchNetworkChange('0x2105')
          return true

        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Ağ eklenmemişse ekle
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x2105',
                  chainName: 'Base Mainnet',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org']
                },
              ],
            })

            console.log('✅ Base ağı başarıyla eklendi')
            this.dispatchNetworkChange('0x2105')
            return true
          }

          throw switchError
        }
      }

      return false
    } catch (error) {
      console.error('❌ Network yönetim hatası:', error)
      return false
    }
  }

  async getCurrentNetwork(): Promise<string | null> {
    try {
      if (this.walletType === 'demo' || this.walletType === 'farcaster') {
        return '0x2105' // Her zaman Base
      }

      if (this.walletType === 'metamask' && window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        return chainId
      }

      return '0x2105' // Fallback Base
    } catch (error) {
      console.error('Ağ bilgisi alma hatası:', error)
      return '0x2105'
    }
  }

  // Network değişikliği event'i
  private dispatchNetworkChange(chainId: string) {
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('networkChanged', {
          detail: { chainId, timestamp: Date.now() }
        }))
        console.log('📡 Network change event dispatched:', chainId)
      }
    } catch (error) {
      console.error('Network change event dispatch error:', error)
    }
  }

  // İşlem gönderme
  async sendTransaction(to: string, amount: string): Promise<string | null> {
    try {
      if (this.walletType === 'demo' || this.walletType === 'farcaster') {
        // Demo işlem
        console.log('🎭 Demo işlem:', { to, amount })
        const demoTxHash = '0x' + Math.random().toString(16).substring(2, 66)
        console.log('✅ Demo işlem hash:', demoTxHash)
        return demoTxHash
      }

      if (this.walletType === 'metamask' && this.signer) {
        // Gerçek MetaMask işlemi
        const tx = await this.signer.sendTransaction({
          to,
          value: ethers.parseEther(amount),
        })

        console.log('✅ MetaMask işlem gönderildi:', tx.hash)
        return tx.hash
      }

      throw new Error('Signer bulunamadı')
    } catch (error) {
      console.error('İşlem hatası:', error)
      return null
    }
  }

  // Bakiye sorgulama
  async getBalance(address: string): Promise<string> {
    try {
      if (this.walletType === 'demo') {
        return '1.5' // Demo bakiye
      }

      if (this.provider) {
        const balance = await this.provider.getBalance(address)
        return ethers.formatEther(balance)
      }

      return '0'
    } catch (error) {
      console.error('Bakiye alma hatası:', error)
      return '0'
    }
  }

  // Fee toplama
  async collectFee(amount: string, userAddress: string, type: 'task_fee' | 'spin_fee' = 'task_fee', taskId?: string): Promise<string | null> {
    console.log('💸 Fee toplama:', { amount, userAddress, type, taskId })

    const feeWallet = process.env.NEXT_PUBLIC_FEE_WALLET || '0x0f797c30d549144973f7bb87bfd29d3a7070ce64'
    const txHash = await this.sendTransaction(feeWallet, amount)

    if (txHash) {
      // Gelir kaydını ekle
      try {
        const { RevenueTracker } = await import('./revenue')
        const tracker = RevenueTracker.getInstance()

        tracker.addRevenue({
          type,
          amount,
          userAddress,
          txHash,
          taskId
        })
      } catch (error) {
        console.error('Revenue tracking error:', error)
      }
    }

    return txHash
  }

  // Mevcut cüzdanları listele
  async getAvailableWallets() {
    const wallets = []

    if (this.walletType === 'metamask') {
      wallets.push({
        name: 'MetaMask',
        provider: window.ethereum,
        icon: '🦊'
      })
    } else if (this.walletType === 'farcaster') {
      wallets.push({
        name: 'Farcaster Wallet',
        provider: this.provider,
        icon: '🟣'
      })
    } else {
      wallets.push({
        name: 'Demo Wallet',
        provider: this.provider,
        icon: '🎭'
      })
    }

    return wallets
  }

  // Wallet türü
  getWalletType(): string {
    switch (this.walletType) {
      case 'metamask':
        return 'MetaMask'
      case 'farcaster':
        return 'Farcaster Wallet'
      case 'demo':
      default:
        return 'Demo Wallet'
    }
  }
}