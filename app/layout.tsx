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
        <meta name="fc:frame:image" content="https://baseaapp.vercel.app/frame-image.png" />
        <meta name="fc:frame:button:1" content="🎯 Open App" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://baseaapp.vercel.app" />
        
        {/* Farcaster Mini App Specific */}
        <meta name="farcaster:miniapp" content="true" />
        <meta name="farcaster:miniapp:name" content="Base Daily Tasks" />
        <meta name="farcaster:miniapp:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta name="farcaster:miniapp:icon" content="https://baseaapp.vercel.app/icon.svg" />
        <meta property="og:title" content="Base Daily Tasks" />
        <meta property="og:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta property="og:image" content="https://baseaapp.vercel.app/icon.svg" />
        <meta property="og:url" content="https://baseaapp.vercel.app" />
        
        {/* Base Mini App SDK - Optimized Pattern */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Base Mini App SDK - Optimized Implementation
              (function() {
                let sdkInitialized = false;
                
                function initializeSDK() {
                  if (sdkInitialized) return;
                  sdkInitialized = true;
                  
                  // Create the SDK structure Base expects
                  window.sdk = {
                    actions: {
                      ready() {
                        try {
                          const isInIframe = window.parent !== window || window.top !== window;
                          
                          if (isInIframe) {
                            // We're in an iframe, send ready messages
                            const targets = [window.parent, window.top].filter(w => w && w !== window);
                            
                            targets.forEach(target => {
                              try {
                                // Base's expected formats
                                target.postMessage({
                                  type: 'miniapp_ready',
                                  source: 'miniapp',
                                  ready: true,
                                  timestamp: Date.now()
                                }, '*');
                                
                                target.postMessage('ready', '*');
                                target.postMessage({ type: 'ready' }, '*');
                                target.postMessage({ ready: true }, '*');
                                
                                // Farcaster Mini App formats
                                target.postMessage({
                                  type: 'frame_ready',
                                  ready: true
                                }, '*');
                                
                                target.postMessage({
                                  type: 'fc_ready'
                                }, '*');
                                
                                target.postMessage({
                                  type: 'miniapp_ready',
                                  ready: true,
                                  source: 'farcaster_miniapp'
                                }, '*');
                              } catch (e) {
                                // Silent error handling
                              }
                            });
                          }
                          
                          return Promise.resolve();
                        } catch (e) {
                          return Promise.resolve();
                        }
                      },
                      
                      share(data) {
                        return navigator.share ? navigator.share(data) : Promise.resolve();
                      },
                      
                      close() {
                        try {
                          if (window.parent !== window) {
                            window.parent.postMessage({ type: 'close' }, '*');
                          }
                        } catch (e) {
                          // Silent
                        }
                      },
                      
                      openUrl(url) {
                        try {
                          window.open(url, '_blank');
                        } catch (e) {
                          // Silent
                        }
                      }
                    }
                  };
                  
                  // Set ready flags
                  window._ready = true;
                  window._baseReady = true;
                  window._miniappReady = true;
                  
                  // Call ready immediately
                  window.sdk.actions.ready();
                  
                  // Call ready with delays
                  setTimeout(() => window.sdk.actions.ready(), 100);
                  setTimeout(() => window.sdk.actions.ready(), 500);
                  setTimeout(() => window.sdk.actions.ready(), 1000);
                }
                
                // Initialize immediately if possible
                if (document.readyState !== 'loading') {
                  initializeSDK();
                } else {
                  document.addEventListener('DOMContentLoaded', initializeSDK);
                }
                
                // Also listen for load event as backup
                window.addEventListener('load', initializeSDK);
                
                // Listen for Base app requests
                window.addEventListener('message', function(event) {
                  try {
                    if (event.data && (
                      event.data.type === 'request_ready' ||
                      event.data.type === 'ping' ||
                      event.data.type === 'base_ping' ||
                      event.data === 'ping' ||
                      event.data === 'ready?'
                    )) {
                      if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                        setTimeout(() => window.sdk.actions.ready(), 10);
                      }
                    }
                  } catch (e) {
                    // Silent
                  }
                });
                
                // Periodic ready signaling for first 30 seconds
                let readyCount = 0;
                const readyInterval = setInterval(() => {
                  try {
                    if (window.sdk && window.sdk.actions && window.sdk.actions.ready && readyCount < 15) {
                      window.sdk.actions.ready();
                      readyCount++;
                    } else {
                      clearInterval(readyInterval);
                    }
                  } catch (e) {
                    clearInterval(readyInterval);
                  }
                }, 2000);
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