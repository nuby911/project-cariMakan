# CariMakan - Sistem Pemesanan Makanan Kantin Kampus

CariMakan adalah platform web modern untuk pemesanan makanan di kantin kampus secara efisien dan contactless. Sistem ini dilengkapi dengan sistem pembayaran digital **KantinPay** yang terintegrasi langsung dengan database data mahasiswa.

---

## 🚀 Fitur Utama

### 1. Sistem Autentikasi Mahasiswa (NPM & Nama)
- Login menggunakan **Nama Lengkap** dan **NPM (Nomor Pokok Mahasiswa)**.
- Validasi data mahasiswa secara aman di sisi server.
- Pencocokan nama bersifat *case-insensitive* (tidak sensitif huruf besar/kecil) untuk kenyamanan pengguna.
- Tombol masuk otomatis tersembunyi secara responsif di perangkat mobile dan terpusat pada bar navigasi bawah.

### 2. E-Commerce & Pemesanan Makanan
- **Pencarian Makanan Real-time**: Menggunakan mekanisme *debounce* (400ms delay) untuk efisiensi kueri pencarian ke server API.
- **Kantin & Filter Lokasi**: Menu dikategorikan berdasarkan lokasi stan kantin kampus (Kantin GSG, Kantin KHD, dll).
- **Keranjang Belanja Interaktif (Cart Drawer)**: Menampilkan detail item, jumlah pesanan, total harga, dan visual penanganan saldo.

### 3. Integrasi Pembayaran Digital (KantinPay)
- Setiap mahasiswa terdaftar memiliki saldo digital bawaan (**KantinPay**) sebesar **Rp 50.000**.
- Validasi otomatis saldo saat checkout: Jika saldo tidak mencukupi, tombol pembayaran akan terkunci dengan pesan peringatan yang ramah.
- Saldo dipotong secara otomatis setelah order berhasil diproses.

### 4. Transisi Animasi Logout Premium
- Animasi keluar interaktif:
  - Dialog konfirmasi konseptual sebelum keluar.
  - Efek pintu geser (*slide exit door animation*) yang modern.
  - Indikator pemuatan lingkaran denyut (*pulse loading*) dan bar persentase progress berjalan selama 2 detik sebelum sesi diakhiri.

---

## 🛠️ Tech Stack

**Frontend (Client Side):**
- React 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- React Router DOM (Navigation)

**Backend (Server Side):**
- Node.js & Express.js
- CORS & Environmental Configs

---

## 📂 Struktur Folder Proyek

```text
project-framework/
├── backend/
│   ├── server.js            # Node.js/Express server (Database & API)
│   ├── package.json         # Dependensi backend
│   └── .env                 # Konfigurasi lingkungan backend
├── frontend/
│   ├── public/              # Logo dan static assets
│   ├── src/
│   │   ├── components/      # Komponen reusable (Header, Cart, FoodCard, dll)
│   │   ├── context/         # React Context (AuthContext, CartContext)
│   │   ├── pages/           # Halaman utama (Home, Detail, Resto)
│   │   ├── App.jsx          # Alur routing aplikasi
│   │   ├── main.jsx         # Entry point aplikasi
│   │   └── index.css        # Custom CSS & keyframe animations
│   ├── package.json         # Dependensi frontend
│   └── vite.config.js       # Konfigurasi bundling Vite
└── README.md                # Dokumentasi utama proyek
```

---

## 🔑 Data Mahasiswa untuk Login (Database Uji Coba)

Sistem login divalidasi menggunakan daftar **31 mahasiswa** terdaftar. Berikut beberapa contoh akun mahasiswa yang dapat digunakan untuk login:

| Nama Mahasiswa | NPM | Saldo Awal (KantinPay) |
| --- | --- | --- |
| Abdur Rouf Hanafi | 24781001 | Rp 50.000 |
| Ahmad Rizky Maulana | 24781002 | Rp 50.000 |
| Alzahra Dwi Febriyan | 24781003 | Rp 50.000 |
| Bunga Putri Salsabilla | 24781005 | Rp 50.000 |
| Rubby | 24781025 | Rp 50.000 |

*(Daftar lengkap 31 mahasiswa terkonfigurasi di dalam file `backend/server.js`)*

---

## 🔧 Instalasi & Menjalankan Proyek

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

### Langkah 1: Jalankan Backend (API Server)
1. Buka terminal baru dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Instal semua dependensi server:
   ```bash
   npm install
   ```
3. Jalankan server backend dalam mode pengembangan:
   ```bash
   npm run dev
   ```
   *Server backend akan aktif di port **http://localhost:5000***

### Langkah 2: Jalankan Frontend (Vite App)
1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Instal semua dependensi aplikasi web:
   ```bash
   npm install
   ```
3. Jalankan frontend dalam mode pengembangan:
   ```bash
   npm run dev
   ```
   *Aplikasi frontend akan aktif di port **http://localhost:5173***

---

## 🌐 Dokumentasi API Backend

### 1. Login Mahasiswa
- **Endpoint**: `POST /api/login`
- **Payload**:
  ```json
  {
    "nama": "Rubby",
    "npm": "24781025"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "nama": "Rubby",
    "npm": "24781025",
    "saldo": 50000
  }
  ```

### 2. Membuat Pesanan (Checkout)
- **Endpoint**: `POST /api/orders`
- **Payload**:
  ```json
  {
    "npm": "24781025",
    "items": [
      {
        "idMeal": "52772",
        "strMeal": "Teriyaki Chicken Casserole",
        "price": 27000,
        "quantity": 1
      }
    ],
    "total": 27000
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Order placed successfully!",
    "remainingBalance": 23000
  }
  ```
