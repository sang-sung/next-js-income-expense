const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.users_admin.count()

  if (count === 0) {
    await prisma.users_admin.create({
      data: {
        user: 'admin',
        password_hash: '',
      },
    })
    console.log('✅ Admin user created')
  } else {
    console.log('ℹ️ Admin user already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
