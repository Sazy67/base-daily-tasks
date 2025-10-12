'use client'

import { useState, useEffect } from 'react'
import { FarcasterSDK } from '@/lib/farcaster-sdk'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [farcasterSDK] = useState(FarcasterSDK.getInstance())
  const [isInIframe, setIsInIframe] = useState(false)
  const [readyCount, setReadyCount] = useState(0)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    setIsInIframe(window.parent !== window)
    addLog('🔧 Debug page initialized')
    addLog(`📱 Environment: ${window.parent !== window ? 'Iframe' : 'Direct browser'}`)
    addLog(`🌐 User Agent: ${navigator.userAgent}`)
    addLog(`📍 Referrer: ${document.referrer || 'None'}`)
    
    // Auto ready test
    setTimeout(() => {
      testReady()
    }, 1000)
  }, [])

  const testReady = async () => {
    try {
      addLog('🚀 Testing ready signal...')
      await farcasterSDK.ready()
      setReadyCount(prev => prev + 1)
      addLog('✅ Ready signal sent successfully')
      
      // Also test global SDK
      if ((window as any).sdk?.actions?.ready) {
        await (window as any).sdk.actions.ready()
        addLog('✅ Global SDK ready also called')
      }
    } catch (error) {
      addLog(`❌ Ready signal failed: ${(error as Error).message}`)
    }
  }

  const testMultipleReady = async () => {
    addLog('🔄 Testing multiple ready signals...')
    for (let i = 0; i < 5; i++) {
      setTimeout(async () => {
        try {
          await farcasterSDK.ready()
          addLog(`✅ Multiple ready ${i + 1}/5 sent`)
        } catch (error) {
          addLog(`❌ Multiple ready ${i + 1}/5 failed`)
        }
      }, i * 200)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setReadyCount(0)
  }

  const checkSDKStatus = () => {
    const hasGlobalSDK = !!(window as any).sdk?.actions?.ready
    const hasFarcasterSDK = !!farcasterSDK
    const isReady = farcasterSDK.isSDKReady()
    
    addLog(`🔍 SDK Status Check:`)
    addLog(`  - Global SDK: ${hasGlobalSDK ? '✅' : '❌'}`)
    addLog(`  - Farcaster SDK: ${hasFarcasterSDK ? '✅' : '❌'}`)
    addLog(`  - SDK Ready: ${isReady ? '✅' : '❌'}`)
    addLog(`  - Ready Count: ${readyCount}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🔧 Farcaster SDK Debug
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <button 
            onClick={testReady}
            style={{
              background: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🚀 Test Ready
          </button>
          
          <button 
            onClick={testMultipleReady}
            style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Multiple Ready
          </button>
          
          <button 
            onClick={checkSDKStatus}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔍 Check Status
          </button>
          
          <button 
            onClick={clearLogs}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🗑️ Clear Logs
          </button>
        </div>
        
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>📊 Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>Environment: <strong>{isInIframe ? '🖼️ Iframe' : '🌐 Direct'}</strong></div>
            <div>Ready Calls: <strong>{readyCount}</strong></div>
            <div>SDK Ready: <strong>{farcasterSDK.isSDKReady() ? '✅' : '❌'}</strong></div>
            <div>In Farcaster: <strong>{farcasterSDK.isInFarcaster() ? '✅' : '❌'}</strong></div>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '20px',
          borderRadius: '12px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <h3 style={{ marginBottom: '15px' }}>📝 Debug Logs</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
            {logs.length === 0 ? (
              <div style={{ opacity: 0.6 }}>No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a 
            href="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.2)',
              padding: '10px 20px',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  )
}