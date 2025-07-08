# 🏨 AI-Powered Hotel Stock Management System

> Modern hotel inventory management with AI-powered Turkish chatbot interface

![Dashboard Overview](screenshots/Screenshot1.png)

## 🌍 English

### 🚀 Overview
An intelligent hotel stock management system that enables hotel staff to query inventory using natural Turkish language. Built with Next.js, MongoDB, and OpenAI GPT-4o.

### ✨ Key Features
- **🗣️ Natural Language Queries**: Ask "Is there salmon fish?" in Turkish
- **🤖 AI-Powered Responses**: Smart product recommendations and alternatives  
- **⚠️ Low Stock Alerts**: Automatic critical inventory warnings
- **📊 Real-time Dashboard**: Live inventory statistics and quick actions
- **📱 Mobile Responsive**: Modern UI with floating action buttons
- **🔄 Category Management**: Fish, meat, vegetables, cleaning supplies, etc.

### 🛠️ Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **AI**: OpenAI GPT-4o with Vercel AI SDK
- **Database**: MongoDB Atlas
- **UI**: Modern glassmorphism design with dark/light modes

### ⚡ Quick Start
```bash
git clone <repo-url>
cd hotel-stock-management
npm install

cp .env.example .env.local
# Add your OPENAI_API_KEY and MONGODB_URI

npm run dev

curl -X POST http://localhost:3000/api/init-db
```

### 📷 Screenshots


#### 🔹 Fish Category View
![Fish Category](screenshots/Screenshot2.png)

#### 🔹 Critical Stock Alerts
![Critical Stock](screenshots/Screenshot3.png)

#### 🔹 Architecture Flow
![Architecture](screenshots/Screenshot4.png)

### 🎯 Usage Examples
- "Somon balığı var mı?" → Find salmon fish
- "Stoku azalan ürünler" → Show low stock items  
- "FISH001 detayları" → Product details
- "Balık kategorisi" → Fish category view

### 🌐 Demo
Visit: `https://hotel-stock-chatbot-ai.vercel.app/`

---

## 🇹🇷 Türkçe

### 🚀 Genel Bakış
Otel personelinin doğal Türkçe ile stok sorgulama yapabildiği yapay zeka destekli akıllı otel stok yönetim sistemi. Next.js, MongoDB ve OpenAI GPT-4o ile geliştirilmiştir.

### ✨ Temel Özellikler
- **🗣️ Doğal Dil Sorguları**: "Somon balığı var mı?" şeklinde Türkçe sorular
- **🤖 AI Destekli Yanıtlar**: Akıllı ürün önerileri ve alternatifler
- **⚠️ Stok Uyarıları**: Otomatik kritik stok seviyesi bildirimleri
- **📊 Canlı Dashboard**: Anlık stok istatistikleri ve hızlı işlemler
- **📱 Mobil Uyumlu**: Modern UI ve floating action butonları
- **🔄 Kategori Yönetimi**: Balık, et, sebze, temizlik malzemeleri vb.

### ⚡ Hızlı Başlangıç
```bash
git clone <repo-url>
cd hotel-stock-management
npm install

cp .env.example .env.local
# OPENAI_API_KEY ve MONGODB_URI ekle

npm run dev

curl -X POST http://localhost:3000/api/init-db
```


### 🎯 Kullanım Örnekleri
- "Somon balığı var mı?" → Somon balığı ara
- "Stoku azalan ürünler" → Kritik stok göster
- "FISH001 detayları" → Ürün detaylarını göster
- "Balık kategorisi" → Balık kategorisini görüntüle

---

## 📋 Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hotel-stock-db
```

## 🤝 Katkıda Bulun
Katkılar memnuniyetle karşılanır!

## 📄 Lisans
MIT License - [LICENSE](LICENSE) dosyasına bakın.

---

**Built with ❤️ for the hospitality industry**
