# SIAKAD STT Diakonos

> **Sistem Informasi Akademik** untuk Sekolah Tinggi Teologi Diakonos — platform manajemen kampus full-stack yang mengintegrasikan proses akademik, keuangan, dan administrasi dalam satu sistem terpadu.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)

---

## Tentang Proyek

SIAKAD STT Diakonos dibangun untuk menggantikan proses administrasi akademik manual di lingkungan Sekolah Tinggi Teologi Diakonos. Sistem mencakup empat portal role-based yang saling terintegrasi: Admin, Dosen, Mahasiswa, dan Staf Keuangan.

**Highlight teknis:**
- REST API dengan Express 5 + TypeScript, diproteksi JWT HttpOnly cookie
- Frontend Next.js 16 App Router dengan TanStack Query untuk server state management
- Dual deployment mode — bisa jalan sebagai dua service terpisah atau satu unified server
- 5-layer rate limiting, CSP via Helmet, dan audit log per transaksi data
- Generate dokumen PDF (KHS, KRS) dan export Excel langsung dari server

---

## Tech Stack

### Backend

| Layer | Teknologi | Keterangan |
|---|---|---|
| Runtime | Node.js ≥ 18 | |
| Framework | Express 5 | Latest major, async error handling built-in |
| Language | TypeScript 5 | Strict mode |
| ORM | Prisma 6 | Type-safe query builder + Migrate |
| Database | **MySQL 8** | Relational, 15 tabel utama + audit log |
| Auth | JWT + bcrypt | Token disimpan di HttpOnly cookie |
| File Upload | Multer | Bukti pembayaran & file materi kelas |
| PDF | PDFKit + Puppeteer | Generate KHS, KRS, laporan |
| Excel Export | ExcelJS | Export rekap nilai, presensi, pembayaran |
| Security | Helmet, CORS, express-rate-limit | 5-layer protection |
| Validation | express-validator, validator | Server-side validation |

### Frontend

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR + CSR hybrid |
| Language | TypeScript 5 | |
| UI Components | shadcn/ui (Radix UI) | Accessible, composable, 50+ komponen |
| Styling | Tailwind CSS 4 | |
| Server State | TanStack Query 5 | Caching, background refetch, optimistic update |
| Forms | React Hook Form + Zod | Schema-based validation |
| Charts | Recharts | Dashboard statistik |
| HTTP Client | Axios | Interceptors untuk auth token |
| Theme | next-themes | Dark/light mode |
| Auth Guard | Custom `useAuth` hook | Role-based redirect per portal |

---

## Fitur

### Modul Akademik

| Fitur | Deskripsi |
|---|---|
| **KRS** | Pengajuan KRS berbasis paket per angkatan/prodi, approval workflow (Dosen PA → Admin), modifikasi manual, periode KRS & perbaikan dikontrol per semester |
| **KHS** | Kartu Hasil Studi dengan kalkulasi IPS & IPK otomatis, total SKS semesteran dan kumulatif, export PDF |
| **Nilai** | Input nilai angka → konversi huruf otomatis (A/AB/B/BC/C/CD/D/DE/E), finalisasi oleh dosen, unlock oleh admin |
| **Presensi** | Rekap kehadiran per pertemuan, status HADIR / TIDAK_HADIR / IZIN / SAKIT / ALPHA |
| **Kelas MK** | Jadwal kelas (hari, jam, ruangan, kuota), upload file RPS/RPP/Materi per minggu |

### Modul Administrasi

| Fitur | Deskripsi |
|---|---|
| **Mahasiswa** | CRUD data mahasiswa, status AKTIF/CUTI/NON_AKTIF/LULUS/DO, assignment dosen wali |
| **Dosen** | CRUD data dosen, NIDN/NUPTK, jabatan fungsional, mahasiswa bimbingan |
| **Program Studi** | Multi-prodi support, flag lintas prodi untuk mata kuliah tertentu |
| **Semester** | Manajemen periode GANJIL/GENAP, periode KRS & perbaikan, flag semester aktif |
| **Ruangan & MK** | Manajemen ruang kelas dengan kapasitas dan katalog mata kuliah (SKS, semester ideal) |

### Modul Keuangan

| Fitur | Deskripsi |
|---|---|
| **Pembayaran** | 6 jenis: KRS, Tengah Semester, PPL, Skripsi, Wisuda, Komitmen Bulanan |
| **Verifikasi** | Upload bukti transfer → approval/reject oleh staf keuangan atau admin |
| **Dashboard Keuangan** | Rekap status pembayaran, filter per semester dan jenis |

### Umum

- Multi-role authentication dengan format login berbeda per role (auto-detect)
- Role-based access control (RBAC) divalidasi di setiap route backend
- Audit log otomatis setiap aksi: user, action, table, old/new data, IP, user-agent
- Protected static file serving — `/uploads/*` hanya bisa diakses user terautentikasi
- Export PDF dan Excel dari server
- Responsive layout dengan mobile navigation

---

## Role & Akses

### Format Login

> Sistem **otomatis mendeteksi role** berdasarkan format identifier — tidak perlu memilih role saat login.

| Role | Format Identifier | Contoh |
|---|---|---|
| **Admin** | Username | `admin` |
| **Dosen** | NIDN (10 digit) atau NUPTK (16 digit) | `0101018901` |
| **Mahasiswa** | NIM (`xx.yy.zzz`) atau Username | `24.01.001` |
| **Keuangan** | Username | `keuangan` |

### Matriks Hak Akses

| Fitur | Admin | Dosen | Mahasiswa | Keuangan |
|---|:---:|:---:|:---:|:---:|
| Kelola data master (CRUD) | ✅ | — | — | — |
| Buat & submit KRS | ✅ | — | — | — |
| Approve/reject KRS | ✅ | ✅ bimbingan | — | — |
| Lihat status KRS | ✅ | ✅ | ✅ | — |
| Input nilai | — | ✅ kelas diampu | — | — |
| Finalisasi nilai | — | ✅ | — | — |
| Unlock nilai | ✅ | — | — | — |
| Upload materi kelas (RPS/RPP) | — | ✅ | — | — |
| Akses materi kelas | — | ✅ | ✅ | — |
| Kelola presensi | ✅ | ✅ | — | — |
| Lihat presensi | — | ✅ | ✅ | — |
| Upload bukti pembayaran | — | — | ✅ | — |
| Approve/reject pembayaran | ✅ | — | — | ✅ |
| Dashboard keuangan | — | — | — | ✅ |
| Ganti password | ✅ | ✅ | ✅ | ✅ |
| Ganti username | ✅ | — | — | ✅ |

---

## Database Schema

Database **MySQL 8** dikelola dengan Prisma Migrate. Skema DBML tersedia di `backend/dbml/schema.dbml`.

**Entitas utama (19 tabel):**

```
users              → autentikasi & role (ADMIN/DOSEN/MAHASISWA/KEUANGAN)
program_studi      → data prodi (kode, nama, jenjang)
mahasiswa          → data akademik + relasi ke dosen wali
dosen              → data dosen, NIDN, NUPTK, jabatan fungsional
mata_kuliah        → katalog MK (SKS, semester ideal, flag lintas prodi)
semester           → periode akademik + window periode KRS & perbaikan
kelas_mata_kuliah  → jadwal kelas (hari, jam, ruangan, kuota, dosen)
ruangan            → ruang kelas dengan kapasitas
paket_krs          → template KRS per angkatan/prodi/semester
paket_krs_detail   → relasi paket ↔ kelas MK
krs                → KRS mahasiswa (DRAFT→SUBMITTED→APPROVED/REJECTED)
krs_detail         → relasi KRS ↔ kelas MK yang diambil
nilai              → nilai angka + huruf + bobot, flag finalisasi
khs                → IPS & IPK per semester (auto-generated)
presensi           → sesi kehadiran per kelas per pertemuan
presensi_detail    → status hadir per mahasiswa per sesi
pembayaran         → transaksi pembayaran + bukti URL + status verifikasi
kelas_mk_file      → file RPS/RPP/Materi per kelas per minggu
audit_log          → log perubahan data (old/new JSON, IP, user-agent)
```

**Enum:**

```
StatusKRS        : DRAFT | SUBMITTED | APPROVED | REJECTED
NilaiHuruf       : A | AB | B | BC | C | CD | D | DE | E
StatusPembayaran : PENDING | APPROVED | REJECTED
StatusPresensi   : HADIR | TIDAK_HADIR | IZIN | SAKIT | ALPHA
JenisPembayaran  : KRS | TENGAH_SEMESTER | PPL | SKRIPSI | WISUDA | KOMITMEN_BULANAN
TipeFileKelas    : RPS | RPP | MATERI
StatusMahasiswa  : AKTIF | CUTI | NON_AKTIF | LULUS | DO
```

---

## Struktur Proyek

```
siakad-stt-diakonos/
├── backend/
│   ├── dbml/
│   │   └── schema.dbml              # Visualisasi relasi tabel
│   ├── prisma/
│   │   ├── schema.prisma            # Definisi skema database
│   │   ├── migrations/              # Riwayat migrasi (10 migrasi)
│   │   └── seed*.ts                 # Data seed awal
│   ├── src/
│   │   ├── config/                  # Konfigurasi env & koneksi DB
│   │   ├── controllers/             # Request handler (16 controller)
│   │   ├── middlewares/             # Auth, RBAC, validasi, error handler
│   │   ├── routes/                  # Definisi endpoint (16 router)
│   │   ├── services/                # Business logic (KRS, nilai, presensi, pembayaran)
│   │   ├── utils/                   # PDF generator, Excel export, hitung IPK, konversi nilai
│   │   └── server.ts                # Entry point + dual-mode boot
│   ├── uploads/
│   │   ├── kelasmkfiles/            # File materi kelas (RPS/RPP/Materi)
│   │   └── pembayaran/              # Bukti transfer mahasiswa
│   └── render-build.sh              # Build script untuk Render deployment
│
└── frontend/
    ├── app/
    │   ├── (auth)/login/            # Halaman login (auto role detection)
    │   ├── admin/                   # Portal Admin (12 halaman)
    │   ├── dosen/                   # Portal Dosen (8 halaman)
    │   ├── mahasiswa/               # Portal Mahasiswa (10 halaman)
    │   └── keuangan/                # Portal Keuangan (3 halaman)
    ├── components/
    │   ├── features/                # Komponen domain (forms, tables, modals, cards)
    │   ├── layouts/                 # Sidebar, TopBar, MobileNav
    │   ├── shared/                  # EmptyState, ErrorState, LoadingSpinner, SearchBar
    │   └── ui/                      # shadcn/ui base components (50+ komponen)
    ├── hooks/                       # useAuth, use-mobile
    ├── lib/                         # Axios instance, QueryClient, constants, utils
    └── types/                       # TypeScript types & model definitions
```

---

## Deployment Mode

| Mode | `SERVE_FRONTEND` | Deskripsi |
|---|---|---|
| **Separated** | `false` | Backend (port 5000) & frontend (port 3000) deploy terpisah. Cocok untuk Render + Vercel. |
| **Unified** | `true` | Express meng-host Next.js sekaligus. Satu server, satu port, satu domain. |

---

## Instalasi & Setup

### Prerequisites

- Node.js ≥ 18
- MySQL 8
- npm atau yarn

### 1. Clone Repository

```bash
git clone https://github.com/ANTIMOLE/siakad-stt-diakonos.git
cd siakad-stt-diakonos
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env`:

```env
# Database (MySQL)
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/siakad_diakonos"

# Auth
JWT_SECRET="your-strong-jwt-secret"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Deployment mode — set true untuk unified mode (Express serve Next.js)
SERVE_FRONTEND=false

# URL frontend — wajib diset di production untuk CORS & CSP
FRONTEND_URL="http://localhost:3000"
```

Jalankan migrasi & seed:

```bash
npm run prisma:migrate    # Jalankan semua migrasi
npm run prisma:generate   # Generate Prisma Client
npm run seed              # Isi data awal
```

Jalankan server:

```bash
npm run dev               # Development (hot reload)
```

Backend aktif di `http://localhost:5000`

### 3. Setup Frontend *(Separated Mode)*

```bash
cd frontend
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

```bash
npm run dev
```

Frontend aktif di `http://localhost:3000`

### 4. Unified Mode *(Opsional)*

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Jalankan unified server
cd ../backend
SERVE_FRONTEND=true NODE_ENV=production npm start
```

Semua layanan tersedia di `http://localhost:5000`.

---

## Scripts

### Backend

| Script | Keterangan |
|---|---|
| `npm run dev` | Development server dengan hot reload (nodemon) |
| `npm run build` | Compile TypeScript → JavaScript |
| `npm run start` | Jalankan production build |
| `npm run prisma:migrate` | Jalankan migrasi database |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:studio` | Buka Prisma Studio (GUI database) |
| `npm run seed` | Isi database dengan data awal |

### Frontend

| Script | Keterangan |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run start` | Jalankan production build |
| `npm run lint` | Lint codebase |

---

## API Endpoints

Base URL: `/api`

| Endpoint | Keterangan |
|---|---|
| `GET /health` | Health check — status server, uptime, environment |
| `GET /api` | Info API & daftar seluruh endpoint |
| `/api/auth` | Login, register, ganti password, ganti username |
| `/api/mahasiswa` | CRUD data mahasiswa |
| `/api/dosen` | CRUD data dosen |
| `/api/mata-kuliah` | CRUD katalog mata kuliah |
| `/api/semester` | Manajemen semester & periode KRS |
| `/api/kelas-mk` | Jadwal kelas mata kuliah |
| `/api/kelas-mk-files` | Upload & akses file RPS/RPP/Materi |
| `/api/ruangan` | Manajemen ruang kelas |
| `/api/paket-krs` | Paket KRS per angkatan & prodi |
| `/api/krs` | Pengajuan, modifikasi, approval KRS |
| `/api/nilai` | Input, finalisasi, unlock nilai |
| `/api/khs` | Generate & ambil Kartu Hasil Studi |
| `/api/presensi` | Kelola sesi & rekap presensi |
| `/api/pembayaran` | Upload bukti & verifikasi pembayaran |
| `/api/dashboard` | Statistik ringkas per role |
| `/api/dashboard-keuangan` | Rekap & statistik keuangan |

> File upload diakses via `/uploads/*` — **dilindungi JWT**, hanya tersedia untuk user yang sudah login.

---

## Security

| Layer | Implementasi | Detail |
|---|---|---|
| **Helmet** | CSP, HSTS, XSS filter | HSTS aktif di production; CSP dikonfigurasi untuk Google reCAPTCHA |
| **Rate Limiting** | 5 layer independen | Global API (1000/4 min), Login (15/3 min), Register (3/jam), Ganti password (3/jam), Upload (10/jam) |
| **CORS** | Strict origin whitelist | `credentials: true`, origin divalidasi per environment |
| **JWT** | HttpOnly cookie | Token tidak pernah exposed ke JavaScript client |
| **RBAC** | `roleMiddleware` per route | Setiap endpoint diproteksi sesuai role yang diizinkan |
| **Protected Uploads** | Auth middleware `/uploads` | JWT diverifikasi sebelum serve file statis |
| **Audit Log** | Tabel `audit_log` | Setiap perubahan data dicatat beserta old/new JSON value dan IP address |
| **Input Validation** | express-validator + Zod | Validasi berlapis di backend dan frontend |

---

## Lisensi

Dikembangkan sebagai proyek Kerja Praktik untuk keperluan akademik **STT Diakonos**.
