export default function FramePage() {
  return (
    <html>
      <head>
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://baseaapp.vercel.app/baseikon.png" />
        <meta name="fc:frame:button:1" content="🎯 Open App" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://baseaapp.vercel.app" />
        <meta property="og:title" content="Base Daily Tasks" />
        <meta property="og:description" content="Complete daily tasks and earn rewards on Base network" />
        <meta property="og:image" content="https://baseaapp.vercel.app/baseikon.png" />
        <title>Base Daily Tasks - Frame</title>
      </head>
      <body style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        margin: 0
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0' }}>🎯</h1>
          <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>Base Daily Tasks</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Farcaster Frame Ready</p>
        </div>
      </body>
    </html>
  )
}