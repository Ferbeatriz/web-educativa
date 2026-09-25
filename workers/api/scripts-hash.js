/**
 * Script para generar hash bcrypt de una contraseña.
 * Uso: node scripts-hash.js "contraseña-en-claro"
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('❌ Debes proporcionar una contraseña');
  console.error('Uso: node scripts-hash.js "mi-contraseña"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('');
console.log('🔐 Contraseña en claro:', password);
console.log('🔒 Hash bcrypt generado:');
console.log(hash);
console.log('');
console.log('📋 SQL para insertar en D1:');
console.log(`INSERT INTO metodos_auth (alumna_id, tipo, credencial_hash) VALUES (1, 'password', '${hash}');`);
console.log('');
