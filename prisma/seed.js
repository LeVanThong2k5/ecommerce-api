import prisma from "../src/config/prisma.js";

async function main() {
  console.log("Start seeding...");

  // =========================
  // ROLE
  // =========================

  await prisma.role.upsert({
    where: {
      roleid: 1
    },
    update: {
      rolename: "ADMIN"
    },
    create: {
      roleid: 1,
      rolename: "ADMIN"
    }
  });

  await prisma.role.upsert({
    where: {
      roleid: 2
    },
    update: {
      rolename: "normal"
    },
    create: {
      roleid: 2,
      rolename: "normal"
    }
  });

  // =========================
  // MEMBERSHIP
  // =========================

  await prisma.membership.upsert({
    where: {
      mid: 1
    },
    update: {
      mname: "BASIC",
      score: 10
    },
    create: {
      mid: 1,
      mname: "BASIC",
      score: 10
    }
  });

  await prisma.membership.upsert({
    where: {
      mid: 2
    },
    update: {
      mname: "SILVER",
      score: 100
    },
    create: {
      mid: 2,
      mname: "SILVER",
      score: 100
    }
  });

  await prisma.membership.upsert({
    where: {
      mid: 3
    },
    update: {
      mname: "GOLD",
      score: 500
    },
    create: {
      mid: 3,
      mname: "GOLD",
      score: 500
    }
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });