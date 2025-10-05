// Base Mini App SDK Integration
export class BaseMiniAppSDK {
  private static instance: BaseMiniAppSDK;
  private isReady = false;
  private isBaseMiniApp = false;

  static getInstance(): BaseMiniAppSDK {
    if (!BaseMiniAppSDK.instance) {
      BaseMiniAppSDK.instance = new BaseMiniAppSDK();
    }
    return BaseMiniAppSDK.instance;
  }

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Base mini app detection
    this.isBaseMiniApp = this.detectBaseMiniApp();
    
    if (this.isBaseMiniApp) {
      this.initializeBaseMiniApp();
    } else {
      // Regular web app initialization
      this.initializeWebApp();
    }
  }

  private detectBaseMiniApp(): boolean {
    // Check for Base mini app environment
    const userAgent = navigator.userAgent;
    const isBaseMiniApp = 
      userAgent.includes('Base') || 
      userAgent.includes('Farcaster') ||
      window.location.href.includes('base.org') ||
      document.querySelector('meta[name="base-miniapp"]') !== null;
    
    console.log('Base Mini App detected:', isBaseMiniApp);
    return isBaseMiniApp;
  }

  private initializeBaseMiniApp() {
    console.log('Initializing Base Mini App SDK...');
    
    // Base mini app specific initialization
    try {
      // Check if Base SDK is available
      if (typeof window !== 'undefined' && (window as any).sdk) {
        const sdk = (window as any).sdk;
        
        // Call ready function
        if (sdk.actions && typeof sdk.actions.ready === 'function') {
          sdk.actions.ready();
          this.isReady = true;
          console.log('Base SDK ready() called successfully');
        } else {
          console.warn('Base SDK ready() function not found');
          this.fallbackReady();
        }
      } else {
        console.warn('Base SDK not found, using fallback');
        this.fallbackReady();
      }
    } catch (error) {
      console.error('Error initializing Base Mini App SDK:', error);
      this.fallbackReady();
    }
  }

  private initializeWebApp() {
    console.log('Initializing as regular web app...');
    this.isReady = true;
  }

  private fallbackReady() {
    // Fallback ready implementation
    console.log('Using fallback ready implementation');
    
    // Simulate SDK ready call
    setTimeout(() => {
      this.isReady = true;
      console.log('Fallback ready completed');
      
      // Dispatch custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('baseMiniAppReady'));
      }
    }, 100);
  }

  public getIsReady(): boolean {
    return this.isReady;
  }

  public getIsBaseMiniApp(): boolean {
    return this.isBaseMiniApp;
  }

  public onReady(callback: () => void) {
    if (this.isReady) {
      callback();
    } else {
      // Wait for ready state
      const checkReady = () => {
        if (this.isReady) {
          callback();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    }
  }

  // Base mini app specific methods
  public share(data: { text?: string; url?: string }) {
    if (this.isBaseMiniApp && (window as any).sdk?.actions?.share) {
      return (window as any).sdk.actions.share(data);
    } else {
      // Fallback to Web Share API or custom implementation
      if (navigator.share) {
        return navigator.share(data);
      } else {
        console.log('Share fallback:', data);
        return Promise.resolve();
      }
    }
  }

  public close() {
    if (this.isBaseMiniApp && (window as any).sdk?.actions?.close) {
      (window as any).sdk.actions.close();
    } else {
      console.log('Close action not available in web app');
    }
  }

  public openUrl(url: string) {
    if (this.isBaseMiniApp && (window as any).sdk?.actions?.openUrl) {
      (window as any).sdk.actions.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  }
}

// Global SDK instance
export const baseSdk = BaseMiniAppSDK.getInstance();