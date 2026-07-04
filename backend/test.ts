import prisma from "./src/lib/prisma";

async function main() {
  const orgs = await prisma.organization.findMany();
  console.log(orgs);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
  import { hashPassword, comparePassword } from "./src/utils/password";

async function test() {
  const hashed = await hashPassword("password123");

  console.log(hashed);

  const ok = await comparePassword("password123", hashed);

  console.log(ok);
}

test();