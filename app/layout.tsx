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
        {/* Farcaster Mini App Meta Tags - NEW FORMAT */}
        <meta name="fc:miniapp" content='{"version":"1","imageUrl":"https://baseaapp.vercel.app/baseikon.png","url":"https://baseaapp.vercel.app/iframe.html"}' />
        
        {/* Backward Compatibility */}
        <meta name="fc:frame" content='{"version":"1","imageUrl":"https://baseaapp.vercel.app/baseikon.png","url":"https://baseaapp.vercel.app/iframe.html"}' />
        
        {/* Traditional Frame Tags for Compatibility */}
        <meta name="fc:frame:image" content="https://baseaapp.vercel.app/baseikon.png" />
        <meta name="fc:frame:button:1" content="🚀 Open App" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://baseaapp.vercel.app/iframe.html" />

        {/* Farcaster Mini App Specific */}
        <meta name="farcaster:miniapp" content="true" />
        <meta name="farcaster:miniapp:name" content="Base Daily Tasks" />
        <meta name="farcaster:miniapp:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta name="farcaster:miniapp:icon" content="https://baseaapp.vercel.app/baseikon.png" />
        <meta property="og:title" content="Base Daily Tasks" />
        <meta property="og:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta property="og:image" content="https://baseaapp.vercel.app/og-image.png" />
        <meta property="og:url" content="https://baseaapp.vercel.app" />

        {/* ULTRA-EARLY FARCASTER SDK - Before Everything */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🚀 ULTRA-EARLY Farcaster SDK Init');
              
              // IMMEDIATE ENVIRONMENT CHECK
              const isInIframe = window.self !== window.top;
              console.log('🔍 Iframe check:', isInIframe);
              
              // ULTRA-SIMPLE SDK - Exact Farcaster Format
              window.sdk = {
                actions: {
                  ready: function() {
                    console.log('🟣 ULTRA-EARLY ready() called');
                    
                    if (isInIframe && window.parent) {
                      // EXACT Farcaster format - ONLY this
                      window.parent.postMessage({
                        type: 'sdk.ready'
                      }, '*');
                      console.log('✅ EXACT ready sent immediately');
                    }
                    
                    return Promise.resolve();
                  }
                }
              };
              
              // ULTRA-IMMEDIATE READY CALLS
              console.log('🔄 Calling ready ULTRA-EARLY...');
              window.sdk.actions.ready();
              
              // BACKUP CALLS
              setTimeout(function() { window.sdk.actions.ready(); }, 0);
              setTimeout(function() { window.sdk.actions.ready(); }, 1);
              setTimeout(function() { window.sdk.actions.ready(); }, 5);
              setTimeout(function() { window.sdk.actions.ready(); }, 10);
              
              console.log('🎯 ULTRA-EARLY SDK Complete');
            `,
          }}
        />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🔥 BODY-START Farcaster ready');
              
              // BODY START - Another ready attempt
              if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                window.sdk.actions.ready();
                console.log('✅ BODY-START ready called');
              }
            `,
          }}
        />
        
        <ThemeProvider>
          {children}
        </ThemeProvider>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🔥 BODY-END Farcaster ready');
              
              // BODY END - Final ready attempt
              if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                window.sdk.actions.ready();
                console.log('✅ BODY-END ready called');
              }
            `,
          }}
        />
      </body>
    </html>
  )
}