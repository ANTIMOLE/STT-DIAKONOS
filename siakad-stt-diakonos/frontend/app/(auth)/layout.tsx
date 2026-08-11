/**
 * Auth Layout
 * Layout untuk halaman authentication (login, register, forgot password)
 * Simple center layout tanpa sidebar/navbar
 */

import { Card } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{backgroundImage:'url(/Background_1.jpg)',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
      {/* Background Pattern (Optional) */}
      <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            {/* Logo */}
            

            {/* Title */}
            {/* <Card className='bg-white/75 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl border border-white/40 ring-1 ring-black/5'>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <GraduationCap className="h-10 w-10" />
            </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              SIAKAD STT Diakonos
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sistem Informasi Akademik
            </p>
            </Card> */}
            
          </div>

          {/* Children (Login Form, etc) */}
          {children}

          {/* Footer */}
          <div className="text-center text-xs text-black-500 bg-white/75 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl border border-white/40 ring-1 ring-black/5">
            <p>© 2025 STT Diakonos Banyumas</p>
            <p className="mt-1">Sekolah Tinggi Teologi Diakonos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
