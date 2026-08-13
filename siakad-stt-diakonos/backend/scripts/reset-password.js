const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true },
  });

  console.log(`Ditemukan ${users.length} user.`);

  let updated = 0;
  const skippedAdmin = [];

  for (const user of users) {
    if (user.role === 'ADMIN' || user.role === 'KEUANGAN') {
      skippedAdmin.push(user);
      continue;
    }

    if (!user.username) {
      console.log(`SKIP: user id ${user.id} tidak punya username`);
      continue;
    }

    const hashed = await bcrypt.hash(user.username, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    updated++;
  }

  console.log(`\n${updated} password (mahasiswa/dosen) direset ke NIM/NIDN masing-masing.`);

  if (skippedAdmin.length) {
    console.log(`\n${skippedAdmin.length} akun ADMIN/KEUANGAN dilewati: ${skippedAdmin.map(u => u.username).join(', ')}`);
    console.log('Set password akun ini manual, jangan pake username sebagai password.');
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});