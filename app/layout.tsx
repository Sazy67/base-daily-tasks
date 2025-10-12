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
        <meta property="og:image" content="https://baseaapp.vercel.app/og-image.png" />
        <meta property="og:url" content="https://baseaapp.vercel.app" />

        {/* Farcaster Mini App SDK - Enhanced Ready Signals */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Farcaster SDK - Enhanced Implementation
              (function() {
                console.log('🟣 Farcaster SDK initializing...');
                
                // Create SDK immediately
                window.sdk = {
                  actions: {
                    ready: function() {
                      console.log('📡 SDK ready() called');
                      try {
                        if (window.parent !== window) {
                          console.log('📤 Sending ready signals to parent...');
                          
                          // Send multiple ready formats
                          const messages = [
                            { type: 'sdk_ready', ready: true, timestamp: Date.now() },
                            { type: 'miniapp_ready', ready: true },
                            { type: 'frame_ready', ready: true },
                            { ready: true },
                            'ready'
                          ];
                          
                          messages.forEach(msg => {
                            try {
                              window.parent.postMessage(msg, '*');
                            } catch (e) {
                              console.log('Message send error:', e);
                            }
                          });
                        }
                        return Promise.resolve({ success: true });
                      } catch (e) {
                        console.error('Ready error:', e);
                        return Promise.resolve({ success: false, error: e });
                      }
                    },
                    share: function(data) { 
                      console.log('📤 Share called:', data);
                      return Promise.resolve(); 
                    },
                    close: function() { 
                      console.log('❌ Close called');
                      try { 
                        if (window.parent !== window) window.parent.postMessage({ type: 'close' }, '*'); 
                      } catch (e) {} 
                    },
                    openUrl: function(url) { 
                      console.log('🔗 OpenUrl called:', url);
                      try { 
                        window.open(url, '_blank'); 
                      } catch (e) {} 
                    }
                  }
                };
                
                // Set ready flags
                window._ready = true;
                window._miniappReady = true;
                window._farcasterReady = true;
                
                // Enhanced ready function
                function callReady() {
                  console.log('🚀 Calling ready...');
                  if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                    window.sdk.actions.ready();
                  }
                }
                
                // Aggressive ready calling
                callReady();
                setTimeout(callReady, 50);
                setTimeout(callReady, 100);
                setTimeout(callReady, 250);
                setTimeout(callReady, 500);
                setTimeout(callReady, 1000);
                setTimeout(callReady, 2000);
                
                // Listen for parent requests
                window.addEventListener('message', function(e) {
                  console.log('📨 Message received:', e.data);
                  if (e.data === 'ping' || 
                      (e.data && (e.data.type === 'request_ready' || e.data.type === 'ping'))) {
                    console.log('🔄 Ready request received, responding...');
                    callReady();
                  }
                });
                
                // Call ready on all load events
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', callReady);
                } else {
                  callReady();
                }
                window.addEventListener('load', callReady);
                
                // Periodic ready signals for 30 seconds
                let readyCount = 0;
                const readyInterval = setInterval(() => {
                  if (readyCount < 15) {
                    console.log('⏰ Periodic ready signal:', readyCount);
                    callReady();
                    readyCount++;
                  } else {
                    clearInterval(readyInterval);
                    console.log('✅ Periodic ready signals completed');
                  }
                }, 2000);
                
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