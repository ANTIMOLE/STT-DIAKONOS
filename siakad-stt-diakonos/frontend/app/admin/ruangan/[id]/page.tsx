/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Calendar } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ruanganAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function RuanganDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ruanganId = parseInt(params.id as string);

  const [ruangan, setRuangan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRuangan = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await ruanganAPI.getById(ruanganId);

        if (response.success && response.data) {
          setRuangan(response.data);
        } else {
          setError(response.message || 'Gagal memuat data ruangan');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(
          err.response?.data?.message ||
          err.message ||
          'Terjadi kesalahan saat memuat data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (ruanganId) {
      fetchRuangan();
    }
  }, [ruanganId]);

  const handleBack = () => {
    router.push('/admin/ruangan');
  };

  const handleEdit = () => {
    router.push(`/admin/ruangan/${ruanganId}/edit`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat data ruangan..." />
      </div>
    );
  }

  if (error || !ruangan) {
    return (
      <ErrorState
        title="Gagal Memuat Data"
        message={error || 'Ruangan tidak ditemukan'}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={ruangan.nama}
        description="Detail ruangan kelas"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Ruangan', href: '/admin/ruangan' },
          { label: 'Detail' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack} className='cursor-pointer
                              transition-all duration-200
                              active:scale-90'>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button onClick={handleEdit} className='cursor-pointer
                              transition-all duration-200
                              active:scale-90'>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Ruangan */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Ruangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-5 md:grid-cols-2">
                {/* Nama Ruangan */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nama Ruangan</p>
                  <p className="text-lg font-semibold tracking-tight">{ruangan.nama}</p>
                </div>

                {/* Kapasitas */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Kapasitas</p>
                  <p className="text-lg font-semibold tracking-tight">
                    {ruangan.kapasitas || 30} Orang
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      ruangan.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    <span
                      className={cn(
                        "mr-1.5 h-1.5 w-1.5 rounded-full",
                        ruangan.isActive ? "bg-emerald-500" : "bg-slate-400"
                      )}
                    />
                    {ruangan.isActive ? "Aktif" : "Non-Aktif"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daftar Kelas */}
          <Card>
            <CardHeader>
              <CardTitle>
                Kelas yang Menggunakan Ruangan ({ruangan.kelasMataKuliah?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!ruangan.kelasMataKuliah || ruangan.kelasMataKuliah.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="mb-3 rounded-full bg-muted p-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Belum ada kelas</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tidak ada kelas yang menggunakan ruangan ini
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12 text-center">No</TableHead>
                        <TableHead>Mata Kuliah</TableHead>
                        <TableHead>Dosen</TableHead>
                        <TableHead>Jadwal</TableHead>
                        <TableHead className="text-right">Semester</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ruangan.kelasMataKuliah.map((kelas: any, index: number) => (
                        <TableRow
                          key={kelas.id}
                          className="group transition-colors hover:bg-muted/50"
                        >
                          <TableCell className="text-center text-muted-foreground font-medium">
                            {index + 1}
                          </TableCell>

                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="font-medium leading-none truncate max-w-[220px]">
                                {kelas.mataKuliah?.namaMK || '-'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {kelas.mataKuliah?.kodeMK || '-'}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="text-sm">
                            {kelas.dosen?.namaLengkap || '-'}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span>
                                {kelas.hari || '-'}, {kelas.jamMulai || '-'} - {kelas.jamSelesai || '-'}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="inline-flex flex-col items-end">
                              <span className="text-sm font-medium">
                                {kelas.semester?.tahunAkademik || '-'}
                              </span>
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                {kelas.semester?.periode || ''}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistik */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Kelas</p>
                <p className="text-2xl font-bold">
                  {ruangan._count?.kelasMataKuliah || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kapasitas</p>
                <p className="text-2xl font-bold">{ruangan.kapasitas || 30}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    ruangan.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  )}
                >
                  <span
                    className={cn(
                      "mr-1.5 h-1.5 w-1.5 rounded-full",
                      ruangan.isActive ? "bg-emerald-500" : "bg-slate-400"
                    )}
                  />
                  {ruangan.isActive ? "Aktif" : "Non-Aktif"}
                </Badge>
              </div>
              {ruangan.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dibuat:</span>
                  <span className="text-sm">
                    {new Date(ruangan.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {ruangan.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Diupdate:</span>
                  <span className="text-sm">
                    {new Date(ruangan.updatedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}