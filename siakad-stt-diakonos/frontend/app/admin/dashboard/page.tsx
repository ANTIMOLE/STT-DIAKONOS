'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, FileText, Wallet, UserPlus } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';
import { dashboardAPI } from '@/lib/api';
import { AdminDashboardStats } from '@/types/model';

export default function AdminDashboardPage() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH DASHBOARD STATS
  // ============================================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await dashboardAPI.getAdminStats();


       if (response.success && response.data) {  
          setStats(response.data);
        } else {
          setError(response.message || 'Gagal memuat data dashboard');
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Fetch dashboard stats error:', err);
        setError(
          err.response?.data?.message ||
          err.message ||
          'Terjadi kesalahan saat memuat data dashboard'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Dashboard"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selamat datang di Sistem Informasi Akademik STT Diakonos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Mahasiswa */}
      <Card className="border-blue-100 bg-linear-to-br from-blue-50/80 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900/70">Total Mahasiswa</CardTitle>
          <div className="rounded-lg bg-blue-100 p-2">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{stats?.totalMahasiswa || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats?.mahasiswaAktif || 0} mahasiswa aktif</p>
          <StatProgress active={stats?.mahasiswaAktif || 0} total={stats?.totalMahasiswa || 0} /> {/* 👈 INI */}
        </CardContent>
      </Card>

      {/* Total Dosen */}
      <Card className="border-violet-100 bg-linear-to-br from-violet-50/80 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-violet-900/70">Total Dosen</CardTitle>
          <div className="rounded-lg bg-violet-100 p-2">
            <GraduationCap className="h-4 w-4 text-violet-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{stats?.totalDosen || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats?.dosenAktif || 0} dosen aktif</p>
          <StatProgress active={stats?.dosenAktif || 0} total={stats?.totalDosen || 0} /> {/* 👈 INI */}
        </CardContent>
      </Card>

      {/* Mata Kuliah */}
      <Card className="border-emerald-100 bg-linear-to-br from-emerald-50/80 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-900/70">Mata Kuliah</CardTitle>
          <div className="rounded-lg bg-emerald-100 p-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{stats?.totalMataKuliah || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats?.mataKuliahAktif || 0} mata kuliah aktif</p>
          <StatProgress active={stats?.mataKuliahAktif || 0} total={stats?.totalMataKuliah || 0} /> {/* 👈 INI */}
        </CardContent>
      </Card>

        {/* KRS Pending */}
        <Card className="border-amber-100 bg-linear-to-br from-amber-50/80 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900/70">
              KRS Pending
            </CardTitle>
            <div className="rounded-lg bg-amber-100 p-2">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats?.krsPending || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Semester Aktif */}
      {stats?.semesterAktif && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Semester Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tahun Akademik</p>
                <p className="text-lg font-semibold tracking-tight">
                  {stats.semesterAktif.tahunAkademik}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Periode</p>
                <p className="text-lg font-semibold tracking-tight">
                  {stats.semesterAktif.periode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* // Quick Actions - gantiin Recent Activity card */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Approve KRS', href: '/admin/krs?status=pending', icon: FileText, count: stats?.krsPending },
              { label: 'Approve Pembayaran', href: '/admin/pembayaran?status=pending', icon: Wallet },
              { label: 'Tambah Mahasiswa', href: '/admin/mahasiswa/tambah', icon: UserPlus },
              { label: 'Tambah Dosen', href: '/admin/dosen/tambah', icon: GraduationCap },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="relative flex flex-col items-center gap-2 rounded-lg border p-4 text-center hover:bg-muted/50 transition-colors"
              >
                {action.count ? (
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                    {action.count}
                  </span>
                ) : null}
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
            
        </CardContent>
      </Card>
    </div>
  );
}

function StatProgress({ active, total }: { active: number; total: number }) {
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
      <div className="h-1.5 rounded-full bg-current opacity-70" style={{ width: `${pct}%` }} />
    </div>
  );
}