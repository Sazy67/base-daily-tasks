// Farcaster Mini Apps SDK
export interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  custodyAddress?: string
  verifiedAddresses?: string[]
}

export interface FarcasterContext {
  user?: FarcasterUser
  cast?: {
    hash: string
    author: FarcasterUser
  }
}

export class FarcasterSDK {
  private static instance: FarcasterSDK
  private context: FarcasterContext | null = null
  private isReady = false

  static getInstance(): FarcasterSDK {
    if (!FarcasterSDK.instance) {
      FarcasterSDK.instance = new FarcasterSDK()
    }
    return FarcasterSDK.instance
  }

  constructor() {
    this.initialize()
  }

  private async initialize() {
    if (typeof window === 'undefined') return

    try {
      // Farcaster Mini App detection
      const isFarcasterMiniApp = this.detectFarcasterMiniApp()
      
      if (isFarcasterMiniApp) {
        console.log('🟣 Farcaster Mini App ortamı tespit edildi')
        await this.loadFarcasterContext()
      } else {
        console.log('🌐 Normal web ortamı - Farcaster Mini App değil')
      }
    } catch (error) {
      console.error('Farcaster SDK initialization error:', error)
    }
  }

  private detectFarcasterMiniApp(): boolean {
    try {
      // Farcaster Mini App detection kriterleri
      const isInIframe = window.parent !== window
      const hasWarpcastUA = navigator.userAgent.includes('Warpcast')
      const hasFarcasterUA = navigator.userAgent.includes('farcaster')
      const referrer = document.referrer
      const isFarcasterReferrer = referrer.includes('warpcast.com') || referrer.includes('farcaster.xyz')
      
      // URL kontrolleri
      const url = window.location.href
      const isFarcasterURL = url.includes('farcaster') || url.includes('warpcast')
      
      // Farcaster Mini App spesifik kontroller
      const hasFarcasterAPI = (window as any).parent?.postMessage !== undefined
      
      console.log('🔍 Farcaster Mini App Detection:', {
        isInIframe,
        hasWarpcastUA,
        hasFarcasterUA,
        isFarcasterReferrer,
        isFarcasterURL,
        hasFarcasterAPI
      })

      return isInIframe && (hasWarpcastUA || hasFarcasterUA || isFarcasterReferrer)
    } catch (error) {
      console.error('Farcaster detection error:', error)
      return false
    }
  }

  private async loadFarcasterContext(): Promise<void> {
    try {
      // Farcaster Mini App context'ini yükle
      const context = await this.requestFarcasterContext()
      
      if (context) {
        this.context = context
        this.isReady = true
        console.log('✅ Farcaster context yüklendi:', context)
      } else {
        // Fallback: URL parametrelerinden context oluştur
        this.context = this.createContextFromURL()
        this.isReady = true
        console.log('⚠️ Fallback context oluşturuldu:', this.context)
      }
    } catch (error) {
      console.error('Farcaster context loading error:', error)
      this.context = null
      this.isReady = true
    }
  }

  private async requestFarcasterContext(): Promise<FarcasterContext | null> {
    return new Promise((resolve) => {
      try {
        // Farcaster Mini App API'sine context isteği gönder
        const requestId = Math.random().toString(36).substring(7)
        
        const contextRequest = {
          type: 'fc_requestContext',
          id: requestId,
          method: 'fc_getContext'
        }

        // Parent window'a mesaj gönder
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(contextRequest, '*')
        }

        // Response listener
        const handleMessage = (event: MessageEvent) => {
          try {
            if (event.data?.type === 'fc_contextResponse' && event.data?.id === requestId) {
              window.removeEventListener('message', handleMessage)
              resolve(event.data.context || null)
            }
          } catch (error) {
            console.error('Context response parsing error:', error)
          }
        }

        window.addEventListener('message', handleMessage)

        // 5 saniye timeout
        setTimeout(() => {
          window.removeEventListener('message', handleMessage)
          resolve(null)
        }, 5000)

      } catch (error) {
        console.error('Context request error:', error)
        resolve(null)
      }
    })
  }

  private createContextFromURL(): FarcasterContext | null {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      
      const fid = urlParams.get('fid')
      const username = urlParams.get('username')
      const displayName = urlParams.get('displayName')
      const pfpUrl = urlParams.get('pfpUrl')
      const custodyAddress = urlParams.get('custodyAddress')
      const verifiedAddresses = urlParams.get('verifiedAddresses')

      if (fid) {
        const user: FarcasterUser = {
          fid: parseInt(fid),
          username: username || undefined,
          displayName: displayName || undefined,
          pfpUrl: pfpUrl || undefined,
          custodyAddress: custodyAddress || undefined,
          verifiedAddresses: verifiedAddresses ? verifiedAddresses.split(',') : undefined
        }

        return { user }
      }

      return null
    } catch (error) {
      console.error('URL context creation error:', error)
      return null
    }
  }

  // Public API
  public getContext(): FarcasterContext | null {
    return this.context
  }

  public getUser(): FarcasterUser | null {
    return this.context?.user || null
  }

  public isInFarcaster(): boolean {
    return this.context !== null
  }

  public isSDKReady(): boolean {
    return this.isReady
  }

  public getUserWalletAddress(): string | null {
    const user = this.getUser()
    if (!user) return null

    // Önce custody address'i dene
    if (user.custodyAddress) {
      return user.custodyAddress
    }

    // Sonra verified addresses'i dene
    if (user.verifiedAddresses && user.verifiedAddresses.length > 0) {
      return user.verifiedAddresses[0]
    }

    return null
  }

  // Farcaster Mini App actions
  public async openUrl(url: string): Promise<void> {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'fc_openUrl',
          url: url
        }, '*')
      } else {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Open URL error:', error)
      window.open(url, '_blank')
    }
  }

  public async close(): Promise<void> {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'fc_close'
        }, '*')
      }
    } catch (error) {
      console.error('Close error:', error)
    }
  }

  public async ready(): Promise<void> {
    try {
      console.log('🟣 ENHANCED Farcaster ready signal başlatılıyor...')
      
      // 1. Parent window mesajları (iframe için)
      if (window.parent && window.parent !== window) {
        const readyMessages = [
          // Standard Farcaster messages
          { type: 'fc_ready' },
          { type: 'miniapp_ready', ready: true },
          { type: 'frame_ready', ready: true },
          { type: 'sdk_ready', ready: true },
          
          // Additional compatibility messages
          { type: 'ready', status: 'success' },
          { action: 'ready', timestamp: Date.now() },
          { event: 'ready', source: 'farcaster-sdk' },
          
          // Simple string messages
          'ready',
          'fc_ready',
          'miniapp_ready'
        ]
        
        let sentCount = 0
        readyMessages.forEach((message, index) => {
          try {
            window.parent.postMessage(message, '*')
            sentCount++
          } catch (e) {
            console.warn(`Ready message ${index + 1} failed:`, e)
          }
        })
        
        console.log(`✅ Sent ${sentCount}/${readyMessages.length} ready messages to parent`)
      }
      
      // 2. Global window SDK ready
      if ((window as any).sdk?.actions?.ready) {
        await (window as any).sdk.actions.ready()
        console.log('✅ Global SDK ready called')
      }
      
      // 3. Custom events dispatch
      const customEvents = ['sdk_ready', 'miniapp_ready', 'farcaster_ready', 'frame_ready']
      customEvents.forEach(eventName => {
        try {
          window.dispatchEvent(new CustomEvent(eventName, { 
            detail: { timestamp: Date.now(), source: 'farcaster-sdk' }
          }))
        } catch (e) {
          console.warn(`Custom event ${eventName} failed:`, e)
        }
      })
      
      // 4. Global ready flags
      ;(window as any)._ready = true
      ;(window as any)._miniappReady = true
      ;(window as any)._farcasterReady = true
      ;(window as any)._sdkReady = true
      
      // 5. Console notification
      console.log('🎉 ALL READY SIGNALS SENT - Farcaster should hide splash screen now')
      
      // 6. Delayed retry (for timing issues)
      setTimeout(() => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'sdk_ready', ready: true, retry: true }, '*')
          console.log('🔄 Delayed ready retry sent')
        }
      }, 100)
      
    } catch (error) {
      console.error('❌ Enhanced ready signal error:', error)
      throw error
    }
  }
}