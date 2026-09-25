/**
 * Script para generar hash PBKDF2 compatible con Cloudflare Workers.
 * Uso: node scripts-hash-pbkdf2.js "contraseña-en-claro"
 */
import { webcrypto as crypto } from 'node:crypto';

const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const HASH_ALGO = 'SHA-256';

function bufferToBase64(buffer) {
  return Buffer.from(buffer).toString('base64');
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // 1. Generar sal aleatoria de 16 bytes
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // 2. Importar la contraseña como clave
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // 3. Derivar el hash
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    baseKey,
    KEY_LENGTH * 8
  );

  // 4. Formatear como string
  const saltB64 = bufferToBase64(salt);
  const hashB64 = bufferToBase64(derivedBits);

  return `pbkdf2$sha256$${ITERATIONS}$${saltB64}$${hashB64}`;
}

const password = process.argv[2];

if (!password) {
  console.error('❌ Debes proporcionar una contraseña');
  console.error('Uso: node scripts-hash-pbkdf2.js "mi-contraseña"');
  process.exit(1);
}

const hash = await hashPassword(password);

console.log('');
console.log('🔐 Contraseña en claro:', password);
console.log('🔒 Hash PBKDF2 generado:');
console.log(hash);
console.log('');
console.log('📋 SQL para insertar en D1:');
console.log(`UPDATE metodos_auth SET credencial_hash = '${hash}' WHERE alumna_id = 1 AND tipo = 'password';`);
console.log('');
