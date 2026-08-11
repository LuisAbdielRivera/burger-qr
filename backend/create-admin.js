require('dotenv').config();

const bcrypt = require('bcryptjs');
const readline = require('readline');
const prisma = require('./src/config/prisma');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(text) {
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
}

async function createAdmin() {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║       Burger QR - Admin Setup        ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  try {
    const email = (await question('Correo del administrador: '))
      .trim()
      .toLowerCase();

    if (!email) {
      console.error('❌ El correo es obligatorio.');
      process.exitCode = 1;
      return;
    }

    if (!email.includes('@')) {
      console.error('❌ Ingresa un correo válido.');
      process.exitCode = 1;
      return;
    }

    const password = await question('Contraseña: ');

    if (password.length < 8) {
      console.error('❌ La contraseña debe tener al menos 8 caracteres.');
      process.exitCode = 1;
      return;
    }

    const confirmPassword = await question('Confirmar contraseña: ');

    if (password !== confirmPassword) {
      console.error('❌ Las contraseñas no coinciden.');
      process.exitCode = 1;
      return;
    }

    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      console.error('❌ Ya existe un administrador con ese correo.');
      process.exitCode = 1;
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║    ✅ Administrador creado           ║');
    console.log('╚══════════════════════════════════════╝');
    console.log('');
    console.log(`Correo: ${admin.email}`);
    console.log('');
    console.log('La contraseña no se almacena en texto plano.');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error creando administrador.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();