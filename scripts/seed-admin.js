const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@bellaselecta.it'
  const password = 'Admin1234!'
  const name = 'Administrador'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('⚠️  El usuario ya existe:', email)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuario administrador creado:')
  console.log('   Email:    ', user.email)
  console.log('   Contraseña: Admin1234!')
  console.log('   Rol:      ', user.role)
  console.log('')
  console.log('👉 Entra en: http://localhost:3000/admin/login')
  console.log('⚠️  Cambia la contraseña después de entrar.')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
