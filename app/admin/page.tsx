'use client'

import { useState, useEffect } from 'react'
import { RevenueTracker } from '@/lib/revenue'

export default function AdminPanel() {
  const [revenueTracker] = useState(RevenueTracker.getInstance())
  const [stats, setStats] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    revenueTracker.loadFromStorage()
    updateStats()
  }, [])

  const updateStats = () => {
    const newStats = revenueTracker.getStats()
    const newRecords = revenueTracker.getAllRecords()
    
    setStats(newStats)
    setRecords(newRecords)
  }

  if (!stats) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>💰 Admin Panel - Gelir Takibi</h1>
      
      {/* Genel İstatistikler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3 style={{ color: '#667eea', marginBottom: '10px' }}>Toplam Gelir</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {stats.total.toFixed(6)} ETH
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            ≈ ${(stats.total * 2500).toFixed(2)} USD
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ color: '#22c55e', marginBottom: '10px' }}>Günlük Gelir</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {stats.daily.toFixed(6)} ETH
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            ≈ ${(stats.daily * 2500).toFixed(2)} USD
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ color: '#ff6b6b', marginBottom: '10px' }}>Aylık Gelir</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {stats.monthly.toFixed(6)} ETH
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            ≈ ${(stats.monthly * 2500).toFixed(2)} USD
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ color: '#9333ea', marginBottom: '10px' }}>Toplam İşlem</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {stats.totalTransactions}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            Ort: {stats.averageTransaction.toFixed(6)} ETH
          </div>
        </div>
      </div>

      {/* Gelir Türleri */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>📊 Gelir Türleri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          {Object.entries(stats.byType).map(([type, amount]: [string, any]) => (
            <div key={type} style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                {amount.toFixed(6)} ETH
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>
                {type === 'task_fee' ? '🎯 Görev Ücretleri' : 
                 type === 'spin_fee' ? '🎰 Çarkıfelek' : 
                 '👥 Referans Bonusu'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* En Aktif Kullanıcılar */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>🏆 En Aktif Kullanıcılar</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Kullanıcı</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e0e0e0' }}>Toplam Harcama</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e0e0e0' }}>USD Değeri</th>
              </tr>
            </thead>
            <tbody>
              {stats.topUsers.map((user: any, index: number) => (
                <tr key={user.address}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <span style={{ marginRight: '10px' }}>#{index + 1}</span>
                    {user.address.slice(0, 8)}...{user.address.slice(-6)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                    {user.totalSpent.toFixed(6)} ETH
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', color: '#22c55e' }}>
                    ${(user.totalSpent * 2500).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Son İşlemler */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>📝 Son İşlemler</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Tarih</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Tür</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Kullanıcı</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e0e0e0' }}>Miktar</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>İşlem Hash</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 20).map((record) => (
                <tr key={record.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0', fontSize: '0.9rem' }}>
                    {new Date(record.timestamp).toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      backgroundColor: record.type === 'task_fee' ? '#e0f2fe' : '#f3e8ff',
                      color: record.type === 'task_fee' ? '#0369a1' : '#7c3aed'
                    }}>
                      {record.type === 'task_fee' ? '🎯 Görev' : '🎰 Çark'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0', fontSize: '0.9rem' }}>
                    {record.userAddress.slice(0, 6)}...{record.userAddress.slice(-4)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                    {parseFloat(record.amount).toFixed(6)} ETH
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0', fontSize: '0.8rem' }}>
                    <a 
                      href={`https://basescan.org/tx/${record.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#667eea', textDecoration: 'none' }}
                    >
                      {record.txHash.slice(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <button 
          onClick={updateStats}
          className="button"
          style={{ marginRight: '10px' }}
        >
          🔄 Verileri Yenile
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="button"
        >
          🏠 Ana Sayfaya Dön
        </button>
      </div>
    </div>
  )
}