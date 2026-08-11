-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'DOSEN', 'MAHASISWA', 'KEUANGAN') NOT NULL DEFAULT 'MAHASISWA',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_studi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(20) NOT NULL,
    `nama` VARCHAR(200) NOT NULL,
    `jenjang` VARCHAR(10) NOT NULL DEFAULT 'S1',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `program_studi_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nim` VARCHAR(20) NOT NULL,
    `namaLengkap` VARCHAR(200) NOT NULL,
    `tempatTanggalLahir` VARCHAR(200) NULL,
    `jenisKelamin` ENUM('L', 'P') NULL,
    `alamat` TEXT NULL,
    `prodiId` INTEGER NOT NULL,
    `angkatan` INTEGER NOT NULL,
    `status` ENUM('AKTIF', 'CUTI', 'NON_AKTIF', 'LULUS', 'DO') NOT NULL DEFAULT 'AKTIF',
    `dosenWaliId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mahasiswa_userId_key`(`userId`),
    UNIQUE INDEX `mahasiswa_nim_key`(`nim`),
    INDEX `mahasiswa_nim_idx`(`nim`),
    INDEX `mahasiswa_prodiId_idx`(`prodiId`),
    INDEX `mahasiswa_angkatan_idx`(`angkatan`),
    INDEX `mahasiswa_dosenWaliId_idx`(`dosenWaliId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nidn` VARCHAR(20) NOT NULL,
    `nuptk` VARCHAR(20) NOT NULL,
    `namaLengkap` VARCHAR(200) NOT NULL,
    `prodiId` INTEGER NULL,
    `tempatLahir` VARCHAR(100) NULL,
    `tanggalLahir` DATETIME(3) NULL,
    `posisi` VARCHAR(100) NOT NULL,
    `jafung` VARCHAR(100) NOT NULL,
    `alumni` VARCHAR(200) NOT NULL,
    `lamaMengajar` VARCHAR(50) NOT NULL,
    `status` ENUM('AKTIF', 'NON_AKTIF') NOT NULL DEFAULT 'AKTIF',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dosen_userId_key`(`userId`),
    UNIQUE INDEX `dosen_nidn_key`(`nidn`),
    UNIQUE INDEX `dosen_nuptk_key`(`nuptk`),
    INDEX `dosen_nidn_idx`(`nidn`),
    INDEX `dosen_prodiId_idx`(`prodiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mata_kuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kodeMK` VARCHAR(20) NOT NULL,
    `namaMK` VARCHAR(200) NOT NULL,
    `sks` INTEGER NOT NULL,
    `semesterIdeal` INTEGER NOT NULL,
    `isLintasProdi` BOOLEAN NOT NULL DEFAULT false,
    `deskripsi` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mata_kuliah_kodeMK_key`(`kodeMK`),
    INDEX `mata_kuliah_kodeMK_idx`(`kodeMK`),
    INDEX `mata_kuliah_semesterIdeal_idx`(`semesterIdeal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ruangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `kapasitas` INTEGER NULL DEFAULT 30,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ruangan_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `semester` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahunAkademik` VARCHAR(20) NOT NULL,
    `periode` ENUM('GANJIL', 'GENAP') NOT NULL,
    `tanggalMulai` DATETIME(3) NOT NULL,
    `tanggalSelesai` DATETIME(3) NOT NULL,
    `periodeKRSMulai` DATETIME(3) NOT NULL,
    `periodeKRSSelesai` DATETIME(3) NOT NULL,
    `periodePerbaikanKRSMulai` DATETIME(3) NOT NULL,
    `periodePerbaikanKRSSelesai` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `semester_isActive_idx`(`isActive`),
    UNIQUE INDEX `semester_tahunAkademik_periode_key`(`tahunAkademik`, `periode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas_mata_kuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mkId` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,
    `dosenId` INTEGER NOT NULL,
    `hari` VARCHAR(20) NOT NULL,
    `jamMulai` VARCHAR(10) NOT NULL,
    `jamSelesai` VARCHAR(10) NOT NULL,
    `ruanganId` INTEGER NOT NULL,
    `kuotaMax` INTEGER NOT NULL DEFAULT 30,
    `keterangan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kelas_mata_kuliah_semesterId_idx`(`semesterId`),
    INDEX `kelas_mata_kuliah_dosenId_idx`(`dosenId`),
    INDEX `kelas_mata_kuliah_hari_jamMulai_idx`(`hari`, `jamMulai`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paket_krs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaPaket` VARCHAR(200) NOT NULL,
    `angkatan` INTEGER NOT NULL,
    `prodiId` INTEGER NOT NULL,
    `semesterPaket` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,
    `totalSKS` INTEGER NOT NULL DEFAULT 0,
    `createdById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `paket_krs_angkatan_prodiId_semesterPaket_idx`(`angkatan`, `prodiId`, `semesterPaket`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paket_krs_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paketKRSId` INTEGER NOT NULL,
    `kelasMKId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `paket_krs_detail_paketKRSId_kelasMKId_key`(`paketKRSId`, `kelasMKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `krs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswaId` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,
    `paketKRSId` INTEGER NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    `totalSKS` INTEGER NOT NULL DEFAULT 0,
    `isModified` BOOLEAN NOT NULL DEFAULT false,
    `catatanAdmin` TEXT NULL,
    `tanggalSubmit` DATETIME(3) NULL,
    `tanggalApproval` DATETIME(3) NULL,
    `approvedById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `krs_status_idx`(`status`),
    INDEX `krs_semesterId_idx`(`semesterId`),
    UNIQUE INDEX `krs_mahasiswaId_semesterId_key`(`mahasiswaId`, `semesterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `krs_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `krsId` INTEGER NOT NULL,
    `kelasMKId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `krs_detail_krsId_kelasMKId_key`(`krsId`, `kelasMKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswaId` INTEGER NOT NULL,
    `kelasMKId` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,
    `nilaiAngka` DECIMAL(5, 2) NULL,
    `nilaiHuruf` ENUM('A', 'AB', 'B', 'BC', 'C', 'CD', 'D', 'DE', 'E') NULL,
    `bobot` DECIMAL(3, 2) NULL,
    `isFinalized` BOOLEAN NOT NULL DEFAULT false,
    `inputById` INTEGER NOT NULL,
    `tanggalInput` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `nilai_semesterId_idx`(`semesterId`),
    INDEX `nilai_kelasMKId_idx`(`kelasMKId`),
    UNIQUE INDEX `nilai_mahasiswaId_kelasMKId_semesterId_key`(`mahasiswaId`, `kelasMKId`, `semesterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswaId` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,
    `ips` DECIMAL(4, 2) NOT NULL,
    `ipk` DECIMAL(4, 2) NOT NULL,
    `totalSKSSemester` INTEGER NOT NULL,
    `totalSKSKumulatif` INTEGER NOT NULL,
    `tanggalGenerate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `khs_semesterId_idx`(`semesterId`),
    UNIQUE INDEX `khs_mahasiswaId_semesterId_key`(`mahasiswaId`, `semesterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswaId` INTEGER NOT NULL,
    `semesterId` INTEGER NULL,
    `jenisPembayaran` ENUM('KRS', 'TENGAH_SEMESTER', 'PPL', 'SKRIPSI', 'WISUDA', 'KOMITMEN_BULANAN') NOT NULL DEFAULT 'KRS',
    `nominal` INTEGER NOT NULL,
    `buktiUrl` VARCHAR(500) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `catatan` TEXT NULL,
    `bulanPembayaran` DATETIME(3) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verifiedAt` DATETIME(3) NULL,
    `verifiedById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `pembayaran_mahasiswaId_idx`(`mahasiswaId`),
    INDEX `pembayaran_semesterId_idx`(`semesterId`),
    INDEX `pembayaran_status_idx`(`status`),
    INDEX `pembayaran_jenisPembayaran_idx`(`jenisPembayaran`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presensi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kelasMKId` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pertemuan` INTEGER NOT NULL,
    `materi` VARCHAR(500) NULL,
    `catatan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `presensi_kelasMKId_idx`(`kelasMKId`),
    INDEX `presensi_tanggal_idx`(`tanggal`),
    UNIQUE INDEX `presensi_kelasMKId_pertemuan_key`(`kelasMKId`, `pertemuan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presensi_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `presensiId` INTEGER NOT NULL,
    `mahasiswaId` INTEGER NOT NULL,
    `status` ENUM('HADIR', 'TIDAK_HADIR', 'IZIN', 'SAKIT', 'ALPHA') NOT NULL DEFAULT 'ALPHA',
    `keterangan` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `presensi_detail_mahasiswaId_idx`(`mahasiswaId`),
    UNIQUE INDEX `presensi_detail_presensiId_mahasiswaId_key`(`presensiId`, `mahasiswaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas_mk_file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kelasMKId` INTEGER NOT NULL,
    `tipeFile` ENUM('RPS', 'RPP', 'MATERI') NOT NULL,
    `namaFile` VARCHAR(255) NOT NULL,
    `fileUrl` VARCHAR(500) NOT NULL,
    `mingguKe` INTEGER NULL,
    `keterangan` TEXT NULL,
    `uploadedById` INTEGER NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kelas_mk_file_kelasMKId_idx`(`kelasMKId`),
    INDEX `kelas_mk_file_tipeFile_idx`(`tipeFile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `action` VARCHAR(100) NOT NULL,
    `tableName` VARCHAR(100) NOT NULL,
    `recordId` INTEGER NULL,
    `oldData` JSON NULL,
    `newData` JSON NULL,
    `ipAddress` VARCHAR(50) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_log_userId_idx`(`userId`),
    INDEX `audit_log_tableName_recordId_idx`(`tableName`, `recordId`),
    INDEX `audit_log_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `program_studi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_dosenWaliId_fkey` FOREIGN KEY (`dosenWaliId`) REFERENCES `dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `program_studi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mata_kuliah` ADD CONSTRAINT `kelas_mata_kuliah_mkId_fkey` FOREIGN KEY (`mkId`) REFERENCES `mata_kuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mata_kuliah` ADD CONSTRAINT `kelas_mata_kuliah_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semester`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mata_kuliah` ADD CONSTRAINT `kelas_mata_kuliah_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mata_kuliah` ADD CONSTRAINT `kelas_mata_kuliah_ruanganId_fkey` FOREIGN KEY (`ruanganId`) REFERENCES `ruangan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paket_krs` ADD CONSTRAINT `paket_krs_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semester`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paket_krs` ADD CONSTRAINT `paket_krs_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `program_studi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paket_krs` ADD CONSTRAINT `paket_krs_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paket_krs_detail` ADD CONSTRAINT `paket_krs_detail_paketKRSId_fkey` FOREIGN KEY (`paketKRSId`) REFERENCES `paket_krs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paket_krs_detail` ADD CONSTRAINT `paket_krs_detail_kelasMKId_fkey` FOREIGN KEY (`kelasMKId`) REFERENCES `kelas_mata_kuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs` ADD CONSTRAINT `krs_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs` ADD CONSTRAINT `krs_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semester`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs` ADD CONSTRAINT `krs_paketKRSId_fkey` FOREIGN KEY (`paketKRSId`) REFERENCES `paket_krs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs` ADD CONSTRAINT `krs_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs_detail` ADD CONSTRAINT `krs_detail_krsId_fkey` FOREIGN KEY (`krsId`) REFERENCES `krs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs_detail` ADD CONSTRAINT `krs_detail_kelasMKId_fkey` FOREIGN KEY (`kelasMKId`) REFERENCES `kelas_mata_kuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_kelasMKId_fkey` FOREIGN KEY (`kelasMKId`) REFERENCES `kelas_mata_kuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semester`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_inputById_fkey` FOREIGN KEY (`inputById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khs` ADD CONSTRAINT `khs_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khs` ADD CONSTRAINT `khs_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semester`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semester`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_verifiedById_fkey` FOREIGN KEY (`verifiedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presensi` ADD CONSTRAINT `presensi_kelasMKId_fkey` FOREIGN KEY (`kelasMKId`) REFERENCES `kelas_mata_kuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presensi_detail` ADD CONSTRAINT `presensi_detail_presensiId_fkey` FOREIGN KEY (`presensiId`) REFERENCES `presensi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presensi_detail` ADD CONSTRAINT `presensi_detail_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mk_file` ADD CONSTRAINT `kelas_mk_file_kelasMKId_fkey` FOREIGN KEY (`kelasMKId`) REFERENCES `kelas_mata_kuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mk_file` ADD CONSTRAINT `kelas_mk_file_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
