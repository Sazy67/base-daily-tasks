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
        <meta name="fc:frame:image" content="https://baseaapp-o33ewwtl0-suat-ayazs-projects-64e3ae06.vercel.app/frame-image.png" />
        <meta name="fc:frame:button:1" content="🎯 Open App" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://baseaapp-o33ewwtl0-suat-ayazs-projects-64e3ae06.vercel.app" />

        {/* Farcaster Mini App Specific */}
        <meta name="farcaster:miniapp" content="true" />
        <meta name="farcaster:miniapp:name" content="Base Daily Tasks" />
        <meta name="farcaster:miniapp:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta name="farcaster:miniapp:icon" content="https://baseaapp-o33ewwtl0-suat-ayazs-projects-64e3ae06.vercel.app/icon.svg" />
        <meta property="og:title" content="Base Daily Tasks" />
        <meta property="og:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta property="og:image" content="https://baseaapp-o33ewwtl0-suat-ayazs-projects-64e3ae06.vercel.app/icon.svg" />
        <meta property="og:url" content="https://baseaapp-o33ewwtl0-suat-ayazs-projects-64e3ae06.vercel.app" />

        {/* Farcaster Mini App SDK - Simplified & Working */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Farcaster SDK - Minimal Working Implementation
              (function() {
                // Create SDK immediately
                window.sdk = {
                  actions: {
                    ready: function() {
                      try {
                        if (window.parent !== window) {
                          window.parent.postMessage({ type: 'sdk_ready', ready: true }, '*');
                          window.parent.postMessage('ready', '*');
                        }
                        return Promise.resolve();
                      } catch (e) {
                        return Promise.resolve();
                      }
                    },
                    share: function(data) { return Promise.resolve(); },
                    close: function() { 
                      try { 
                        if (window.parent !== window) window.parent.postMessage({ type: 'close' }, '*'); 
                      } catch (e) {} 
                    },
                    openUrl: function(url) { 
                      try { 
                        window.open(url, '_blank'); 
                      } catch (e) {} 
                    }
                  }
                };
                
                // Set ready flags
                window._ready = true;
                window._miniappReady = true;
                
                // Auto-call ready
                function callReady() {
                  if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                    window.sdk.actions.ready();
                  }
                }
                
                // Call ready immediately and with delays
                callReady();
                setTimeout(callReady, 100);
                setTimeout(callReady, 500);
                setTimeout(callReady, 1000);
                
                // Listen for ready requests
                window.addEventListener('message', function(e) {
                  if (e.data === 'ping' || (e.data && e.data.type === 'request_ready')) {
                    callReady();
                  }
                });
                
                // Call ready on load events
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', callReady);
                } else {
                  callReady();
                }
                window.addEventListener('load', callReady);
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