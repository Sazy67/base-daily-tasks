import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  // Farcaster Frame HTML response
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Base Daily Tasks</title>
        
        <!-- Farcaster Frame Meta Tags -->
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app/frame-image.png" />
        <meta property="fc:frame:button:1" content="🎯 Start Tasks" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app" />
        <meta property="fc:frame:button:2" content="🎰 Spin Wheel" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app?action=spin" />
        
        <!-- Open Graph -->
        <meta property="og:title" content="Base Daily Tasks" />
        <meta property="og:description" content="Complete daily tasks and spin the wheel to earn rewards on Base network" />
        <meta property="og:image" content="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app/frame-image.png" />
        <meta property="og:url" content="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app" />
      </head>
      <body>
        <h1>Base Daily Tasks</h1>
        <p>Complete daily tasks and spin the wheel to earn rewards on Base network</p>
        <a href="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app">Open App</a>
      </body>
    </html>
  `
  
  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Farcaster Frame POST request handling
    const { untrustedData, trustedData } = body
    
    // Frame action response
    const responseHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Base Daily Tasks</title>
          
          <!-- Farcaster Frame Meta Tags -->
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app/frame-success.png" />
          <meta property="fc:frame:button:1" content="🚀 Open App" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://baseaapp-3apzpm2sx-suat-ayazs-projects-64e3ae06.vercel.app" />
        </head>
        <body>
          <h1>Welcome to Base Daily Tasks!</h1>
          <p>Click the button to start earning rewards</p>
        </body>
      </html>
    `
    
    return new NextResponse(responseHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Frame POST error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}