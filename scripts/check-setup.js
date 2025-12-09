#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function printHeader() {
  console.log('\n' + colors.bright + colors.cyan + '┌─────────────────────────────────────────┐');
  console.log('│     Next.js Starter Setup Check         │');
  console.log('└─────────────────────────────────────────┘' + colors.reset + '\n');
}

function printStep(number, title, status, message) {
  const icon = status === 'done' ? '✓' : status === 'warning' ? '⚠' : '○';
  const color = status === 'done' ? colors.green : status === 'warning' ? colors.yellow : colors.blue;

  console.log(color + colors.bright + `${icon} Step ${number}: ${title}` + colors.reset);
  if (message) {
    console.log('  ' + message + '\n');
  }
}

function main() {
  printHeader();

  const hasEnv = checkFileExists('.env');
  const hasPrismaGenerated = checkFileExists('app/generated/prisma');
  const hasNodeModules = checkFileExists('node_modules');

  // If everything is set up, show a success message
  if (hasEnv && hasPrismaGenerated) {
    console.log(colors.green + colors.bright + '✓ Your project is set up and ready to go!' + colors.reset);
    console.log('\n  Run ' + colors.cyan + 'npm run dev' + colors.reset + ' to start developing\n');
    return;
  }

  // Otherwise, show setup instructions
  console.log(colors.yellow + 'Setup required! Follow these steps to get started:\n' + colors.reset);

  // Step 1: Environment variables
  if (!hasEnv) {
    printStep(1, 'Create environment file', 'warning',
      colors.yellow + 'Copy .env.example to .env and configure your database:\n' + colors.reset +
      '  ' + colors.cyan + 'cp .env.example .env' + colors.reset
    );
  } else {
    printStep(1, 'Environment file', 'done', colors.green + '.env file exists' + colors.reset);
  }

  // Step 2: Database setup
  if (hasEnv && !hasPrismaGenerated) {
    printStep(2, 'Generate Prisma Client', 'warning',
      colors.yellow + 'Generate the Prisma client:\n' + colors.reset +
      '  ' + colors.cyan + 'npm run db:generate' + colors.reset
    );
  } else if (!hasEnv) {
    printStep(2, 'Generate Prisma Client', 'pending',
      colors.blue + 'Complete Step 1 first' + colors.reset
    );
  } else {
    printStep(2, 'Prisma Client', 'done', colors.green + 'Prisma client generated' + colors.reset);
  }

  // Step 3: Database migrations
  if (hasEnv && hasPrismaGenerated) {
    printStep(3, 'Setup Database', 'warning',
      colors.yellow + 'Run database migrations:\n' + colors.reset +
      '  ' + colors.cyan + 'npm run db:push' + colors.reset + ' (for development) or\n' +
      '  ' + colors.cyan + 'npm run db:migrate' + colors.reset + ' (for production-like workflow)'
    );
  } else {
    printStep(3, 'Setup Database', 'pending',
      colors.blue + 'Complete previous steps first' + colors.reset
    );
  }

  // Step 4: Start development
  printStep(4, 'Start Development', 'pending',
    colors.blue + 'After setup is complete:\n' + colors.reset +
    '  ' + colors.cyan + 'npm run dev' + colors.reset
  );

  console.log(colors.bright + '\n📚 Documentation:' + colors.reset);
  console.log('   README: ' + colors.cyan + 'https://github.com/squirrelsoft-dev/next-starter#readme' + colors.reset);
  console.log('   Database scripts: ' + colors.cyan + 'npm run db:--help' + colors.reset + '\n');
}

// Only run if this is a fresh install (no Prisma client generated yet)
// This prevents the message from showing on every npm install
if (!checkFileExists('app/generated/prisma') || !checkFileExists('.env')) {
  main();
}
