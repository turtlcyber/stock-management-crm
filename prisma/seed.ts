import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function usersData() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "john_doe" },
    update: {},
    create: { username: "john_doe", password: hashedPassword },
  });

  console.log("✅ User seeder created successfully");
}

async function customerData() {
  await prisma.customer.upsert({
    where: { phone: "9100000000" },
    update: {},
    create: { name: "Counter Customer", phone: "9100000000" },
  });
  console.log("✅ Customer seeder created successfully");
}

async function main() {
  await usersData();
  await customerData();
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
