/**
 * Script para generar el hash PBKDF2 de la contraseña admin.
 * Uso: node scripts-hash-admin.js
 * Te pedirá la contraseña de forma oculta.
 */
import { webcrypto as crypto } from 'node:crypto';
import * as readline from 'node:readline';

const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const HASH_ALGO = 'SHA-256';

function bufferToBase64(buffer) {
  return Buffer.from(buffer).toString('base64');
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: HASH_ALGO },
    baseKey,
    KEY_LENGTH * 8
  );

  const saltB64 = bufferToBase64(salt);
  const hashB64 = bufferToBase64(derivedBits);
  return `pbkdf2$sha256$${ITERATIONS}$${saltB64}$${hashB64}`;
}

// Leer contraseña de forma oculta
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ocultar lo que se escribe
const stdin = process.stdin;
if (stdin.isTTY) {
  stdin.on('data', () => {}); // no muestra nada
}

process.stdout.write('🔐 Ingresa la contraseña maestra (no se verá en pantalla): ');

rl.question('', async (password) => {
  rl.close();
  process.stdout.write('\n\n');

  if (!password || password.length < 12) {
    console.error('❌ La contraseña debe tener al menos 12 caracteres');
    process.exit(1);
  }

  console.log('🔒 Generando hash PBKDF2...');
  const hash = await hashPassword(password);

  console.log('');
  console.log('✅ Hash generado con éxito:');
  console.log('');
  console.log('─────────────────────────────────────────────────────────');
  console.log(hash);
  console.log('─────────────────────────────────────────────────────────');
  console.log('');
  console.log('📋 Copia ese hash y guárdalo. Lo usarás en el siguiente paso.');
  console.log('');
});

// Ocultar input
if (process.stdin.isTTY) {
  process.stdin.setRawMode(false);
}
