import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'SIAKAD - Sistem Informasi Akademik STT Diakonos',
    short_name: 'SIAKAD',
    description:
      'Sistem Informasi Akademik STT Diakonos — KRS, Nilai, Presensi, dan Pembayaran dalam satu platform.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#1e3a8a', // ganti kalau brand color STT Diakonos sudah fix
    lang: 'id',
    dir: 'ltr',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}