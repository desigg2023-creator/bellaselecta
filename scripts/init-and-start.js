const { execSync } = require('child_process')

console.log('>>> [BELLASELECTA] Checking database and applying migrations...')
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
  console.log('>>> [BELLASELECTA] Database schema synchronized.')
} catch (err) {
  console.error('>>> [BELLASELECTA] Warning: prisma db push error:', err.message)
}

try {
  console.log('>>> [BELLASELECTA] Running initial seed...')
  require('./seed-db.js')
} catch (err) {
  console.error('>>> [BELLASELECTA] Warning: seed error:', err.message)
}

console.log('>>> [BELLASELECTA] Launching Next.js server...')
require('../server.js')
