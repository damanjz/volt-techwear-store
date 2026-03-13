import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = process.argv[2]; // 'dev' or 'prod'
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

if (!['dev', 'prod'].includes(mode)) {
  console.error('Usage: node db-toggle.mjs [dev|prod]');
  process.exit(1);
}

let schema = fs.readFileSync(schemaPath, 'utf8');

if (mode === 'dev') {
  // Switch to SQLite
  schema = schema.replace(/provider = "postgresql"/g, 'provider = "sqlite"');
  // Comment out Postgres-specific env vars if they were explicitly used in schema (though we use prisma.config.ts)
  console.log('🔄 Switched Prisma to SQLite (Local Dev Mode)');
} else {
  // Switch to PostgreSQL
  schema = schema.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
  console.log('🚀 Switched Prisma to PostgreSQL (Production Mode)');
}

fs.writeFileSync(schemaPath, schema);
