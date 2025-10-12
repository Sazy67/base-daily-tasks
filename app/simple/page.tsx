'use client'

export default function SimplePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎯 Base Daily Tasks
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '30px',
          opacity: 0.9
        }}>
          Complete daily tasks and spin the wheel to earn ETH rewards on Base network
        </p>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
            🎰 Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Daily Tasks</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Complete tasks for rewards</p>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎰</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Spin Wheel</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Win ETH prizes</p>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌐</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Base Network</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Built on Base</p>
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => {
              window.location.href = '/';
            }}
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
          >
            🚀 Launch App
          </button>
          
          <button 
            onClick={async () => {
              try {
                console.log('🔄 Manual ready signal test...')
                
                // Multiple ready attempts
                if ((window as any).sdk?.actions?.ready) {
                  await (window as any).sdk.actions.ready()
                  console.log('✅ SDK ready called')
                }
                
                // Direct parent message
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({ type: 'sdk_ready', ready: true }, '*')
                  window.parent.postMessage('ready', '*')
                  console.log('✅ Parent messages sent')
                }
                
                // Global flags
                ;(window as any)._ready = true
                ;(window as any)._miniappReady = true
                
                alert('✅ Multiple ready signals sent to Farcaster!')
              } catch (error) {
                console.error('Ready test error:', error)
                alert('❌ Error: ' + (error as Error).message)
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            🔧 Test SDK
          </button>
        </div>
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            🟣 Farcaster Mini App • 🌐 Base Network • 💰 Earn ETH Daily
          </p>
        </div>
      </div>
    </div>
  )
}