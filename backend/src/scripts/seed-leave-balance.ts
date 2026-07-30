/**
 * seed-leave-balance.ts
 * Seeds LeaveBalance rows for every active employee × every leave type.
 * Safe to re-run: uses upsert so it won't duplicate records.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_BALANCE = 12; // days per leave type per employee

async function main() {
  console.log("🌱  Seeding leave balances...\n");

  const employees = await prisma.employee.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, firstName: true, lastName: true, employeeCode: true },
  });

  const leaveTypes = await prisma.leaveType.findMany({
    select: { id: true, name: true },
  });

  if (employees.length === 0) {
    console.warn("⚠️  No active employees found. Nothing to seed.");
    return;
  }

  if (leaveTypes.length === 0) {
    console.warn("⚠️  No leave types found. Nothing to seed.");
    return;
  }

  console.log(`Found ${employees.length} active employee(s) and ${leaveTypes.length} leave type(s).\n`);

  let created = 0;
  let skipped = 0;

  for (const emp of employees) {
    for (const lt of leaveTypes) {
      const result = await prisma.leaveBalance.upsert({
        where: {
          employeeId_leaveTypeId: {
            employeeId: emp.id,
            leaveTypeId: lt.id,
          },
        },
        update: {}, // Don't overwrite if already exists
        create: {
          employeeId: emp.id,
          leaveTypeId: lt.id,
          balance: DEFAULT_BALANCE,
          used: 0,
        },
      });

      // If createdAt === updatedAt it means it was just created
      const wasCreated =
        result.createdAt.getTime() === result.updatedAt.getTime();

      if (wasCreated) {
        console.log(
          `  ✅ Created: ${emp.firstName} ${emp.lastName} (${emp.employeeCode}) → ${lt.name} | ${DEFAULT_BALANCE} days`
        );
        created++;
      } else {
        console.log(
          `  ⏭️  Skipped (exists): ${emp.firstName} ${emp.lastName} (${emp.employeeCode}) → ${lt.name} | balance: ${result.balance}`
        );
        skipped++;
      }
    }
  }

  console.log(`\n✅  Done! Created: ${created}, Skipped (already existed): ${skipped}`);
}

main()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
