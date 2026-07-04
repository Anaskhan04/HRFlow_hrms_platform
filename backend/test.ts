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