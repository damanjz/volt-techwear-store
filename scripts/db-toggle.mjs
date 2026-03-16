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

// Robust replacement for the entire datasource block
const sqliteBlock = `datasource db {
  provider = "sqlite"
}`;

const postgresBlock = `datasource db {
  provider = "postgresql"
}`;

// Find the datasource block and replace it
const datasourceRegex = /datasource\s+db\s+\{[\s\S]*?\}/;

if (mode === 'dev') {
  schema = schema.replace(datasourceRegex, sqliteBlock);
  console.log('🔄 Switched Prisma to SQLite (Local Dev Mode)');
} else {
  schema = schema.replace(datasourceRegex, postgresBlock);
  console.log('🚀 Switched Prisma to PostgreSQL (Production Mode)');
}

fs.writeFileSync(schemaPath, schema);
