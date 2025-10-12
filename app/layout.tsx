import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Base Daily Tasks',
  description: 'Complete daily tasks and spin the wheel to earn rewards on Base network',
  manifest: '/miniapp-manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#0052ff',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Base Daily Tasks',
    'base-miniapp': 'true',
    'base-network': 'base'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/miniapp-manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0052ff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="miniapp-manifest" content="/miniapp-manifest.json" />
        <meta name="base-miniapp" content="true" />
        <meta name="base-network" content="base" />
        <meta name="miniapp-ready" content="true" />
        <meta name="sdk-version" content="1.0.0" />
        <meta name="base-sdk-ready" content="true" />
        {/* Farcaster Mini App Meta Tags */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://baseaapp-q52c8mohm-suat-ayazs-projects-64e3ae06.vercel.app/frame-image.png" />
        <meta name="fc:frame:button:1" content="🎯 Open App" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://baseaapp-q52c8mohm-suat-ayazs-projects-64e3ae06.vercel.app" />
        
        {/* Farcaster Mini App Specific */}
        <meta name="farcaster:miniapp" content="true" />
        <meta name="farcaster:miniapp:name" content="Base Daily Tasks" />
        <meta name="farcaster:miniapp:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta name="farcaster:miniapp:icon" content="https://baseaapp-q52c8mohm-suat-ayazs-projects-64e3ae06.vercel.app/icon.svg" />
        <meta property="og:title" content="Base Daily Tasks" />
        <meta property="og:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta property="og:image" content="https://baseaapp-q52c8mohm-suat-ayazs-projects-64e3ae06.vercel.app/icon.svg" />
        <meta property="og:url" content="https://baseaapp-q52c8mohm-suat-ayazs-projects-64e3ae06.vercel.app" />
        
        {/* Farcaster Mini App SDK - Fixed Implementation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Farcaster Mini App SDK - Ready Signal Fix
              (function() {
                console.log('🟣 Farcaster SDK initializing...');
                
                // Create SDK structure immediately
                window.sdk = {
                  actions: {
                    ready() {
                      console.log('📡 SDK ready() called');
                      try {
                        // Send ready signal to parent
                        if (window.parent && window.parent !== window) {
                          console.log('📤 Sending ready to parent...');
                          
                          // Multiple ready formats for compatibility
                          const readyMessages = [
                            { type: 'sdk_ready', ready: true, timestamp: Date.now() },
                            { type: 'miniapp_ready', ready: true, source: 'farcaster' },
                            { type: 'frame_ready', ready: true },
                            { type: 'ready', ready: true },
                            'ready'
                          ];
                          
                          readyMessages.forEach(msg => {
                            try {
                              window.parent.postMessage(msg, '*');
                            } catch (e) {
                              console.log('Message send error:', e);
                            }
                          });
                        }
                        
                        return Promise.resolve({ success: true });
                      } catch (error) {
                        console.error('Ready error:', error);
                        return Promise.resolve({ success: false, error });
                      }
                    },
                    
                    share(data) {
                      console.log('📤 Share called:', data);
                      return navigator.share ? navigator.share(data) : Promise.resolve();
                    },
                    
                    close() {
                      console.log('❌ Close called');
                      try {
                        if (window.parent !== window) {
                          window.parent.postMessage({ type: 'close' }, '*');
                        }
                      } catch (e) {
                        console.log('Close error:', e);
                      }
                    },
                    
                    openUrl(url) {
                      console.log('🔗 OpenUrl called:', url);
                      try {
                        window.open(url, '_blank');
                      } catch (e) {
                        console.log('OpenUrl error:', e);
                      }
                    }
                  }
                };
                
                // Set global ready flags
                window._ready = true;
                window._farcasterReady = true;
                window._miniappReady = true;
                
                // Initialize function
                function initialize() {
                  console.log('🚀 SDK initialize called');
                  
                  // Call ready immediately
                  if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                    window.sdk.actions.ready();
                  }
                  
                  // Call ready with delays for safety
                  setTimeout(() => {
                    if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                      window.sdk.actions.ready();
                    }
                  }, 100);
                  
                  setTimeout(() => {
                    if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                      window.sdk.actions.ready();
                    }
                  }, 500);
                }
                
                // Listen for parent requests
                window.addEventListener('message', function(event) {
                  console.log('📨 Message received:', event.data);
                  
                  try {
                    if (event.data && (
                      event.data.type === 'request_ready' ||
                      event.data.type === 'ping' ||
                      event.data === 'ping' ||
                      event.data === 'ready?'
                    )) {
                      console.log('🔄 Ready request received, responding...');
                      if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                        setTimeout(() => window.sdk.actions.ready(), 10);
                      }
                    }
                  } catch (e) {
                    console.log('Message handler error:', e);
                  }
                });
                
                // Initialize based on document state
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initialize);
                } else {
                  initialize();
                }
                
                // Also initialize on window load
                window.addEventListener('load', initialize);
                
                // Periodic ready signaling for first 30 seconds
                let readyCount = 0;
                const readyInterval = setInterval(() => {
                  if (readyCount < 30) {
                    console.log('⏰ Periodic ready signal:', readyCount);
                    if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                      window.sdk.actions.ready();
                    }
                    readyCount++;
                  } else {
                    clearInterval(readyInterval);
                    console.log('✅ Periodic ready signals completed');
                  }
                }, 1000);
                
                console.log('✅ Farcaster SDK setup complete');
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}