// backend/src/server.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

// Import routes
import authRoutes from './routes/authRoutes';
import mahasiswaRoutes from './routes/mahasiswaRoutes';
import dosenRoutes from './routes/dosenRoutes';
import mataKuliahRoutes from './routes/mataKuliahRoutes';
import semesterRoutes from './routes/semesterRoutes';
import kelasMKRoutes from './routes/kelasMKRoutes';
import ruanganRoutes from './routes/ruanganRoutes';
import paketKRSRoutes from './routes/paketKRSRoutes';
import krsRoutes from './routes/krsRoutes';
import nilaiRoutes from './routes/nilaiRoutes';
import khsRoutes from './routes/khsRoutes';
import pembayaranRoutes from './routes/pembayaranRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import dashboardKeuanganRoutes from './routes/dashboardKeuanganRoutes';
import presensiRoutes from './routes/presensiRoutes';
import kelasMKFileRoutes from './routes/kelasMKFileRoutes';

const app: Application = express();

// ============================================
// DEPLOYMENT MODE DETECTION
// ============================================
const IS_PRODUCTION = env.NODE_ENV === 'production';
const SERVE_FRONTEND = env.SERVE_FRONTEND;
const PORT = env.PORT || 5000;

// ============================================
// HELMET CONFIGURATION
// ============================================
const allowedFrameAncestors = ["'self'"];

if (IS_PRODUCTION) {
  const frontendUrl = process.env.FRONTEND_URL?.trim();
  if (frontendUrl) {
    allowedFrameAncestors.push(frontendUrl);
  }
} else {
  allowedFrameAncestors.push('http://localhost:3000');
  allowedFrameAncestors.push('http://localhost:3001');
  allowedFrameAncestors.push(`http://localhost:${PORT}`);
}

// ============================================
// CSP directives dengan reCAPTCHA support
// ============================================
const cspWithFrontend = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      // ✅ reCAPTCHA scripts
      'https://www.google.com',
      'https://www.gstatic.com',
      'https://recaptcha.google.com',
    ],
    imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
    connectSrc: [
      "'self'",
      // ✅ reCAPTCHA verify calls
      'https://www.google.com',
      'https://recaptcha.google.com',
    ],
    fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
    objectSrc: ["'none'"],
    frameSrc: [
      "'self'",
      // ✅ reCAPTCHA iframe
      'https://www.google.com',
      'https://recaptcha.google.com',
      'https://www.recaptcha.net',
    ],
    mediaSrc: ["'self'", 'blob:'],
    formAction: ["'self'"],
    baseUri: ["'self'"],
    frameAncestors: allowedFrameAncestors,
    // ...(IS_PRODUCTION && { upgradeInsecureRequests: [] }),
    upgradeInsecureRequests: null,
  },
};

const cspApiOnly = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", 'data:'],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
    mediaSrc: ["'self'", 'blob:'],
    formAction: ["'self'"],
    baseUri: ["'self'"],
    frameAncestors: allowedFrameAncestors,
    // ...(IS_PRODUCTION && { upgradeInsecureRequests: [] }),
    upgradeInsecureRequests: null,
  },
};

app.use(
  helmet({
    contentSecurityPolicy: SERVE_FRONTEND ? cspWithFrontend : cspApiOnly,
    frameguard: false,
    noSniff: true,
    xssFilter: true,
    hsts: IS_PRODUCTION
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// ============================================
// RATE LIMITERS
// ============================================
const apiLimiter = rateLimit({
  windowMs: 4 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Terlalu banyak request. Coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.originalUrl === '/health' || req.originalUrl === '/api',
});

const loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi dalam 3 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Terlalu banyak percobaan registrasi. Coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Terlalu banyak percobaan ubah password. Coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Terlalu banyak upload file. Coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// CORS CONFIGURATION
// ============================================
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Saat SERVE_FRONTEND=true, request dari browser tidak punya origin (same-origin)
    if (SERVE_FRONTEND && !origin) {
      callback(null, true);
      return;
    }

    const allowedOrigins = IS_PRODUCTION
      ? [
          process.env.FRONTEND_URL,
          `http://localhost:${PORT}`,
          `https://localhost:${PORT}`,
        ].filter(Boolean)
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          `http://localhost:${PORT}`,
        ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie', 'Content-Disposition'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.set('trust proxy', 1);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    data: {
      environment: env.NODE_ENV,
      servingFrontend: SERVE_FRONTEND,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// ============================================
// API INFO
// ============================================
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SIAKAD STT Diakonos API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      mahasiswa: '/api/mahasiswa',
      dosen: '/api/dosen',
      mataKuliah: '/api/mata-kuliah',
      semester: '/api/semester',
      kelasMK: '/api/kelas-mk',
      ruangan: '/api/ruangan',
      paketKRS: '/api/paket-krs',
      krs: '/api/krs',
      nilai: '/api/nilai',
      khs: '/api/khs',
      pembayaran: '/api/pembayaran',
      dashboard: '/api/dashboard',
      presensi: '/api/presensi',
      kelasMKFiles: '/api/kelas-mk-files',
      dashboardKeuangan: '/api/dashboard-keuangan',
    },
  });
});

// ============================================
// RATE LIMITING
// ============================================
if (IS_PRODUCTION) {
  app.use('/api', apiLimiter);
}

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth/change-password', passwordChangeLimiter);
app.use('/api/auth/change-username', passwordChangeLimiter);
app.use('/api/pembayaran/upload', uploadLimiter);

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/dosen', dosenRoutes);
app.use('/api/mata-kuliah', mataKuliahRoutes);
app.use('/api/semester', semesterRoutes);
app.use('/api/kelas-mk', kelasMKRoutes);
app.use('/api/ruangan', ruanganRoutes);
app.use('/api/paket-krs', paketKRSRoutes);
app.use('/api/krs', krsRoutes);
app.use('/api/nilai', nilaiRoutes);
app.use('/api/khs', khsRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/presensi', presensiRoutes);
app.use('/api/kelas-mk-files', kelasMKFileRoutes);
app.use('/api/dashboard-keuangan', dashboardKeuanganRoutes);

// ============================================
// PROTECTED UPLOADS
// ============================================
app.use(
  '/uploads',
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Login required',
      });
    }

    try {
      const jwt = require('jsonwebtoken');
      jwt.verify(token, env.JWT_SECRET);

      const ext = req.path.split('.').pop()?.toLowerCase();

      if (ext === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
        res.setHeader('Content-Type', `image/${ext === 'jpg' ? 'jpeg' : ext}`);
        res.setHeader('Cache-Control', 'private, max-age=3600');
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  },
  express.static('uploads')
);

// ============================================
// START SERVER
// ============================================
const startServer = () => {
  // ERROR HANDLERS didaftarkan di sini — SETELAH semua route
  // (termasuk Next.js handler yang sudah di-use sebelum startServer dipanggil)
  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('SIAKAD STT DIAKONOS API SERVER');
    console.log('='.repeat(60));
    console.log(`Environment   : ${env.NODE_ENV}`);
    console.log(`Serve Frontend: ${SERVE_FRONTEND ? 'YES' : 'NO'}`);
    console.log(`Server        : http://localhost:${PORT}`);
    console.log(`API           : http://localhost:${PORT}/api`);
    console.log(`Health        : http://localhost:${PORT}/health`);
    if (SERVE_FRONTEND) {
      console.log(`Frontend      : http://localhost:${PORT}/`);
    }
    console.log('='.repeat(60));
    console.log('Security Features:');
    console.log('✅ Helmet (CSP + Security Headers)');
    console.log('✅ Rate Limiting (5-layer protection)');
    console.log('✅ CORS Configuration');
    console.log('✅ HttpOnly Cookies (JWT)');
    console.log('✅ File Upload Protection');
    console.log('✅ Static Files Auth');
    console.log('='.repeat(60));
    if (SERVE_FRONTEND) {
      console.log('Frontend Integration:');
      console.log('✅ Next.js Ready');
      console.log('✅ Server-Side Rendering');
      console.log('✅ reCAPTCHA CSP Configured');
      console.log('='.repeat(60));
    }
    console.log('🚀 Server ready to accept connections');
    console.log('='.repeat(60));
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\n${signal} received: closing HTTP server gracefully`);
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('unhandledRejection', (reason: any) => {
    console.error('Unhandled Rejection:', reason);
    gracefulShutdown('Unhandled Rejection');
  });
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('Uncaught Exception');
  });
};

// ============================================
// BOOT: with or without Next.js frontend
// ============================================
if (SERVE_FRONTEND) {
  console.log('📦 Preparing Next.js frontend...');

  const next = require('next');
  const dev = !IS_PRODUCTION;
  const nextDir = path.join(__dirname, '../../frontend');

  const nextApp = next({ dev, dir: nextDir });
  const handle = nextApp.getRequestHandler();

  nextApp
    .prepare()
    .then(() => {
      // Next.js menangani semua route non-API
      // Didaftarkan SEBELUM error handlers (yang ada di dalam startServer)
      app.use((req: Request, res: Response, nextFn: NextFunction) => {
        if (
          req.path.startsWith('/api') ||
          req.path.startsWith('/uploads') ||
          req.path === '/health' ||
          req.path === '/favicon.ico'
        ) {
          return nextFn();
        }
        return handle(req, res);
      });

      console.log('✅ Next.js frontend loaded successfully');
      startServer();
    })
    .catch((err: Error) => {
      console.error('❌ Failed to prepare Next.js:', err);
      startServer(); // tetap jalankan API server tanpa frontend
    });
} else {
  startServer();
}

export default app;