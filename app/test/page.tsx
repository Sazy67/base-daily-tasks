'use client'

export default function TestPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        🎯 Base Daily Tasks
      </h1>
      
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center' }}>
        Farcaster Mini App Test Page
      </p>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p>✅ SDK Ready</p>
        <p>✅ Frame Loaded</p>
        <p>✅ Account Associated</p>
      </div>
      
      <button 
        onClick={() => {
          if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
            window.sdk.actions.ready();
            alert('Ready signal sent!');
          } else {
            alert('SDK not found');
          }
        }}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        🚀 Test Ready Signal
      </button>
    </div>
  )
}