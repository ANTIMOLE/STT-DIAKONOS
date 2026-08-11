/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Banknote,
  Trophy,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

import { semesterAPI, pembayaranAPI } from '@/lib/api';
import { Semester, JenisPembayaran } from '@/types/model';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ============================================
// TYPES
// ============================================
interface KeuanganStats {
  totalPembayaran: number;
  pending: number;
  approved: number;
  rejected: number;
  totalNominal: number;
}

interface PaymentTypeStats {
  type: JenisPembayaran;
  label: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalNominal: number;
}

// ============================================
// CONSTANTS
// ============================================
const PAYMENT_TYPES: JenisPembayaran[] = [
  'KRS',
  'TENGAH_SEMESTER',
  'PPL',
  'SKRIPSI',
  'WISUDA',
  'KOMITMEN_BULANAN',
];

const PAYMENT_TYPE_LABELS: Record<JenisPembayaran, string> = {
  KRS: 'Pembayaran KRS',
  TENGAH_SEMESTER: 'Tengah Semester',
  PPL: 'PPL',
  SKRIPSI: 'Skripsi',
  WISUDA: 'Wisuda',
  KOMITMEN_BULANAN: 'Komitmen Bulanan',
};

const STAT_CARDS_CONFIG = [
  { key: 'total', label: 'Total Pembayaran', icon: FileText, color: 'slate' },
  { key: 'pending', label: 'Menunggu Verifikasi', icon: Clock, color: 'yellow' },
  { key: 'approved', label: 'Disetujui', icon: CheckCircle, color: 'green' },
  { key: 'rejected', label: 'Ditolak', icon: XCircle, color: 'red' },
  { key: 'nominal', label: 'Total Nominal', icon: TrendingUp, color: 'blue' },
];

// Peta warna eksplisit — Tailwind JIT butuh class lengkap yang bisa di-scan
// secara statis, bukan string hasil template literal seperti `border-${color}-200`.
const COLOR_STYLES: Record<
  string,
  {
    card: string;
    iconBg: string;
    iconText: string;
    valueText: string;
  }
> = {
  slate: {
    card: 'border-slate-200 bg-linear-to-br from-slate-50/80 to-white',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-600',
    valueText: '',
  },
  yellow: {
    card: 'border-amber-100 bg-linear-to-br from-amber-50/80 to-white',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    valueText: 'text-amber-700',
  },
  green: {
    card: 'border-emerald-100 bg-linear-to-br from-emerald-50/80 to-white',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    valueText: 'text-emerald-700',
  },
  red: {
    card: 'border-rose-100 bg-linear-to-br from-rose-50/80 to-white',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
    valueText: 'text-rose-700',
  },
  blue: {
    card: 'border-blue-100 bg-linear-to-br from-blue-50/80 to-white',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    valueText: 'text-blue-700',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string): string => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: id });
};

const calculatePercentage = (value: number, total: number): string => {
  return total > 0 ? ((value / total) * 100).toFixed(1) : '0';
};

const aggregateTypeStats = (typeStats: PaymentTypeStats[]): KeuanganStats => ({
  totalPembayaran: typeStats.reduce((sum, s) => sum + s.total, 0),
  pending: typeStats.reduce((sum, s) => sum + s.pending, 0),
  approved: typeStats.reduce((sum, s) => sum + s.approved, 0),
  rejected: typeStats.reduce((sum, s) => sum + s.rejected, 0),
  totalNominal: typeStats.reduce((sum, s) => sum + s.totalNominal, 0),
});

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  description 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color?: string;
  description: string;
}) => {
  const style = COLOR_STYLES[color || 'slate'] || COLOR_STYLES.slate;

  return (
    <Card className={style.card}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-lg ${style.iconBg} p-2`}>
          <Icon className={`h-4 w-4 ${style.iconText}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold tracking-tight ${style.valueText}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

// ============================================
// PAYMENT TYPE ROW COMPONENT
// ============================================
const PaymentTypeRow = ({ stat }: { stat: PaymentTypeStats }) => (
  <div className="flex items-center justify-between border-b pb-3 last:border-0">
    <div className="flex-1">
      <p className="text-sm font-medium">{stat.label}</p>
      <div className="flex gap-4 mt-1">
        <span className="text-xs text-yellow-600">Pending: {stat.pending}</span>
        <span className="text-xs text-green-600">Approved: {stat.approved}</span>
        <span className="text-xs text-red-600">Rejected: {stat.rejected}</span>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold">{stat.total} transaksi</p>
      <p className="text-xs text-muted-foreground">{formatCurrency(stat.totalNominal)}</p>
    </div>
  </div>
);

// ============================================
// INSIGHT CARD COMPONENT
// ============================================
const InsightCard = ({
  icon: Icon,
  iconBg,
  iconText,
  title,
  emptyMessage,
  stat,
  metricLabel,
  metricValue,
}: {
  icon: any;
  iconBg: string;
  iconText: string;
  title: string;
  emptyMessage: string;
  stat: PaymentTypeStats | null;
  metricLabel: string;
  metricValue: (stat: PaymentTypeStats) => string | number;
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className={`rounded-lg ${iconBg} p-2`}>
          <Icon className={`h-4 w-4 ${iconText}`} />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      {stat ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{stat.label}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {stat.total} transaksi • {formatCurrency(stat.totalNominal)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{metricValue(stat)}</p>
            <p className="text-xs text-muted-foreground">{metricLabel}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4">{emptyMessage}</p>
      )}
    </CardContent>
  </Card>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function KeuanganDashboardPage() {
  const [stats, setStats] = useState<KeuanganStats | null>(null);
  const [activeSemester, setActiveSemester] = useState<Semester | null>(null);
  const [paymentTypeStats, setPaymentTypeStats] = useState<PaymentTypeStats[]>([]);
  const [selectedType, setSelectedType] = useState<JenisPembayaran | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH DATA
  // ============================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch active semester
        const semesterResponse = await semesterAPI.getAll();
        if (semesterResponse.success && semesterResponse.data) {
          const active = semesterResponse.data.find(s => s.isActive);
          setActiveSemester(active || null);
        }

        // Fetch stats per payment type
        const typeStatsPromises = PAYMENT_TYPES.map(async (type) => {
          try {
            const response = await pembayaranAPI.getStats({ jenisPembayaran: type });

            if (response.success && response.data) {
              return {
                type,
                label: PAYMENT_TYPE_LABELS[type],
                total: response.data.total,
                pending: response.data.pending,
                approved: response.data.approved,
                rejected: response.data.rejected,
                totalNominal: response.data.totalNominal,
              };
            }
          } catch {
            return null;
          }
          return null;
        });

        const typeStatsResults = await Promise.all(typeStatsPromises);
        const validTypeStats = typeStatsResults.filter(
          (stat): stat is PaymentTypeStats => stat !== null
        );
        
        setPaymentTypeStats(validTypeStats);
        setStats(aggregateTypeStats(validTypeStats));
      } catch (err: any) {
        console.error('Fetch dashboard error:', err);
        setError(err.response?.data?.message || err.message || 'Terjadi kesalahan');
        toast.error('Gagal memuat data dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================
  // MEMOIZED VALUES
  // ============================================
  const displayStats = useMemo(() => {
    if (selectedType === 'ALL') return stats;
    return paymentTypeStats.find((s) => s.type === selectedType) || stats;
  }, [selectedType, stats, paymentTypeStats]);

  const totalPayments = useMemo(() => {
    if (!displayStats) return 0;
    return 'totalPembayaran' in displayStats ? displayStats.totalPembayaran : displayStats.total;
  }, [displayStats]);

  const statsCardData = useMemo(() => {
    if (!displayStats) return [];

    const pendingPercentage = calculatePercentage(displayStats.pending, totalPayments);
    const approvalRate = calculatePercentage(displayStats.approved, totalPayments);

    return [
      { 
        value: totalPayments, 
        description: selectedType !== 'ALL' 
          ? PAYMENT_TYPE_LABELS[selectedType as JenisPembayaran] 
          : 'Seluruh pembayaran' 
      },
      { value: displayStats.pending, description: `${pendingPercentage}% dari total` },
      { value: displayStats.approved, description: `${approvalRate}% approval rate` },
      { value: displayStats.rejected, description: 'Pembayaran invalid' },
      { 
        value: formatCurrency(displayStats.totalNominal), 
        description: selectedType !== 'ALL' 
          ? PAYMENT_TYPE_LABELS[selectedType as JenisPembayaran] 
          : 'Semua jenis' 
      },
    ];
  }, [displayStats, totalPayments, selectedType]);

  // Jenis pembayaran dengan volume transaksi terbanyak
  const topPaymentType = useMemo(() => {
    if (paymentTypeStats.length === 0) return null;
    return [...paymentTypeStats].sort((a, b) => b.total - a.total)[0];
  }, [paymentTypeStats]);

  // Jenis pembayaran dengan antrean verifikasi terbanyak — paling butuh perhatian
  const mostPendingType = useMemo(() => {
    const withPending = paymentTypeStats.filter((s) => s.pending > 0);
    if (withPending.length === 0) return null;
    return [...withPending].sort((a, b) => b.pending - a.pending)[0];
  }, [paymentTypeStats]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value as JenisPembayaran | 'ALL');
  }, []);

  // ============================================
  // LOADING & ERROR
  // ============================================
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <ErrorState
        title="Gagal Memuat Dashboard"
        message={error || 'Data tidak tersedia'}
        onRetry={handleRetry}
      />
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Keuangan</h1>
        <p className="text-sm text-muted-foreground">
          Sistem Pengelolaan Pembayaran - STT Diakonos
        </p>
      </div>

      {/* Active Semester */}
      {activeSemester && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-primary">
                  Semester Aktif: {activeSemester.tahunAkademik} {activeSemester.periode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(activeSemester.tanggalMulai)} - {formatDate(activeSemester.tanggalSelesai)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Banknote className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-75">
                <SelectValue placeholder="Filter Jenis Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis Pembayaran</SelectItem>
                {Object.entries(PAYMENT_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Alert */}
      {displayStats && displayStats.pending > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            Ada <span className="font-bold">{displayStats.pending}</span> pembayaran{' '}
            {selectedType !== 'ALL' && PAYMENT_TYPE_LABELS[selectedType as JenisPembayaran]}{' '}
            menunggu verifikasi
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STAT_CARDS_CONFIG.map((config, index) => (
          <StatCard
            key={config.key}
            title={config.label}
            value={statsCardData[index]?.value || 0}
            icon={config.icon}
            color={config.color}
            description={statsCardData[index]?.description || ''}
          />
        ))}
      </div>

      {/* Insight Cepat — menggantikan placeholder cards & recent activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <InsightCard
          icon={Trophy}
          iconBg="bg-blue-100"
          iconText="text-blue-600"
          title="Jenis Pembayaran Terbanyak"
          emptyMessage="Belum ada data transaksi."
          stat={topPaymentType}
          metricLabel="transaksi"
          metricValue={(stat) => stat.total}
        />
        <InsightCard
          icon={AlertCircle}
          iconBg="bg-amber-100"
          iconText="text-amber-600"
          title="Perlu Perhatian"
          emptyMessage="Tidak ada pembayaran yang menunggu verifikasi. 🎉"
          stat={mostPendingType}
          metricLabel="menunggu"
          metricValue={(stat) => stat.pending}
        />
      </div>

      {/* Payment Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan per Jenis Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentTypeStats.map((stat) => (
              <PaymentTypeRow key={stat.type} stat={stat} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}