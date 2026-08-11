'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card,  CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, ArrowRight, DollarSign } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/primary-button';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
   
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user){
        try{
          const userData = JSON.parse(user);
          const role = userData.role;
          
          const roleRoutes = {
            ADMIN: '/admin/dashboard',
            DOSEN: '/dosen/dashboard',
            MAHASISWA: '/mahasiswa/dashboard',
            KEUANGAN: '/keuangan/dashboard',
          }
          
          const route = roleRoutes[role as keyof typeof roleRoutes] || '/login';
          router.push(route);
          return; // ✅ Exit early, ga perlu setIsChecking
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  if(isChecking){
    return(
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent' />
          <p className='text-sm text-muted-foreground'>
            Memuat...
          </p>
        </div>
      </div>
    )
  }

  return(
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header Section */}
      <div style={{backgroundImage:'url(/Background_1.jpg)',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
          <header className='sticky top-0 z-50 w-full bg-white/40 backdrop-blur-md border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'>
          <div className='container mx-auto flex h-16 items-center justify-between px-4'>
            <div className='flex items-center gap-3'>
              <div className='relative h-10 w-10 shrink-0'>
                <Image
                  src="/LOGO.png"
                  alt="STT Diakonos Logo"
                  fill
                  className='object-contain'
                  priority
                />
              </div>
              <div>
                <h1 className='text-lg font-bold text-blue-600'>SIAKAD</h1>
                <p className='text-xs text-muted-foreground'>STT DIAKONOS</p>
              </div>
            </div>
            <div className="group inline-flex items-center transition-all duration-200 hover:scale-105 active:scale-95">
              <PrimaryButton onClick={() => router.push('/login')}>
                <span className="flex items-center">
                  Masuk Ke Sistem
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </PrimaryButton>
            </div>
          </div>
        </header>
      </div>
      

      {/* Hero Section */}
      <section>
        <div style={{backgroundImage:'url(/Background_1.jpg)',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
          
          <div className='flex min-h-screen w-full items-center justify-center'>
            <Card className='bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-3xl border border-white/20 transition-all duration-300 hover:shadow-cyan-500/10'>
            <section className='container mx-auto px-4 py-16 text-center'>
              <div className='mx-auto max-w-3xl'>
                <div className='relative mx-auto mb-8 h-32 w-32'>
                  <Image
                    src="/LOGO.png"
                    alt="STT Diakonos Logo"
                    fill
                    className='object-contain drop-shadow-lg'
                    priority
                  />
                </div>
                
                <h2 className='mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                  Sistem Informasi Akademik
                </h2>
                <p className='mb-8 text-xl text-gray-600'>
                  Sekolah Tinggi Teologi Diakonos Banyumas
                </p>
                 <div className="group inline-flex items-center transition-all duration-200 hover:scale-105 active:scale-95">
                  <PrimaryButton onClick={() => router.push('/login')}>
                    <span className="flex items-center">
                      Masuk Ke Sistem
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </PrimaryButton>
                </div>
              </div>
              
            </section>
          </Card>
          </div>
          

          <section className="container mx-auto px-4 py-16">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className='bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl'>
                <CardHeader>
                  <Users className="mb-2 h-10 w-10 text-primary" />
                  <CardTitle>Untuk Mahasiswa</CardTitle>
                  <CardDescription>
                    Akses KRS, jadwal kuliah, dan KHS secara online
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className='bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl'>
                <CardHeader>
                  <BookOpen className="mb-2 h-10 w-10 text-primary" />
                  <CardTitle>Untuk Dosen</CardTitle>
                  <CardDescription>
                    Input nilai dan monitoring mahasiswa bimbingan
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className='bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl'>
                <CardHeader>
                  <GraduationCap className="mb-2 h-10 w-10 text-primary" />
                  <CardTitle>Untuk Admin</CardTitle>
                  <CardDescription>
                    Kelola data akademik dan approval KRS
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className='bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl'>
                <CardHeader>
                  <DollarSign className="mb-2 h-10 w-10 text-primary" />
                  <CardTitle>Untuk Keuangan</CardTitle>
                  <CardDescription>
                    Verifikasi bukti pembayaran dan approval transaksi
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </div>
      </section>

      {/* Footer */}
       <div style={{backgroundImage:'url(/Background_1.jpg)',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
        <footer className="w-full py-3 text-center text-sm text-gray-700 bg-white/40 backdrop-blur-md border-t border-white/20 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.03)]">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>© 2025 STT Diakonos Banyumas. All rights reserved.</p>
          </div>
        </footer>
       </div>
      
    </div>
  );
}
