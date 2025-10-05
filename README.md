# Base Daily Tasks

🎯 Complete daily tasks and spin the wheel to earn rewards on Base network!

## 🌟 Features

- **Daily Tasks**: Complete various tasks to earn points and ETH rewards
- **Spin Wheel**: Try your luck with the reward wheel
- **Multi-Wallet Support**: 
  - 🦊 MetaMask (Browser)
  - 🟣 Farcaster Wallet (Farcaster Mini App)
  - 🎭 Demo Mode (Testing)
- **Base Network**: All transactions on Base Mainnet
- **Referral System**: Invite friends and earn bonuses
- **Revenue Tracking**: Track earnings and statistics

## 🚀 Live Demo

**Production URL**: [https://baseaapp-2dwe6g6i8-suat-ayazs-projects-64e3ae06.vercel.app](https://baseaapp-2dwe6g6i8-suat-ayazs-projects-64e3ae06.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Blockchain**: Ethers.js, Base Network
- **Styling**: CSS Modules, Custom CSS
- **Deployment**: Vercel
- **Farcaster**: Mini Apps SDK, Frame API

## 📱 Platform Support

### Browser Mode
- Automatic MetaMask detection
- Real blockchain transactions
- Base network switching

### Farcaster Mini App
- Automatic user detection
- Built-in wallet integration
- Frame context API
- Ready signal handling

### Demo Mode
- No wallet required
- Test all features
- Simulated transactions

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/base-daily-tasks.git
cd base-daily-tasks
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your environment variables:
```env
NEXT_PUBLIC_FEE_WALLET=your_fee_wallet_address
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout with SDK
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── DailyTasks.tsx    # Tasks component
│   └── SpinWheel.tsx     # Wheel component
├── lib/                   # Utility libraries
│   ├── web3.ts           # Web3 service
│   ├── farcaster-sdk.ts  # Farcaster Mini App SDK
│   ├── base-sdk.ts       # Base Mini App SDK
│   ├── tasks.ts          # Task definitions
│   ├── revenue.ts        # Revenue tracking
│   └── referral.ts       # Referral system
└── public/               # Static assets
```

## 🎮 How to Play

### Daily Tasks
1. Connect your wallet (automatic detection)
2. Complete daily tasks:
   - Make a transaction
   - Share on social media
   - Hold ETH
   - Invite friends
3. Pay small fees to complete tasks
4. Earn points and ETH rewards

### Spin Wheel
1. Pay spin cost + fee
2. Spin the wheel
3. Win points based on probability:
   - 10 Points (25%)
   - 25 Points (20%)
   - 50 Points (18%)
   - 100 Points (15%)
   - 200 Points (12%)
   - 500 Points (8%)
   - 1000 Points (2%)

## 🔗 Farcaster Integration

### Mini App Features
- Automatic user detection from Farcaster context
- Built-in wallet integration
- Frame API compatibility
- Ready signal handling
- Parent window communication

### Frame Support
- Open Graph meta tags
- Frame buttons and actions
- Image preview support
- Link actions

## 🌐 Network Support

- **Base Mainnet** (Primary)
- **Ethereum Mainnet** (Fallback)
- **Polygon** (Supported)
- **Arbitrum One** (Supported)
- **Optimism** (Supported)

## 💰 Revenue Model

- Task completion fees
- Spin wheel fees
- Referral bonuses
- All fees collected on Base network

## 🔒 Security

- No private key storage
- Client-side wallet connections
- Secure transaction signing
- Environment variable protection

## 📊 Analytics

- User engagement tracking
- Revenue analytics
- Task completion rates
- Referral performance

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Base Network team
- Farcaster team
- Ethers.js contributors
- Next.js team

## 📞 Support

- Create an issue on GitHub
- Contact: [your-email@example.com]
- Twitter: [@yourusername]

---

Built with ❤️ for the Base ecosystem