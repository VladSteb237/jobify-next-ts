const { PrismaClient } = require("@prisma/client");
const data = require("./mock-data.json");
const prisma = new PrismaClient();

async function main() {
  const clerkId = "user_2w8utvKcLWQMIJBAGe6Z9Oa3cZg";
  // const jobs = data.map((job) => {
  //   return {
  //     ...job,
  //     clerkId,
  //     createdAt: new Date(),
  //   };
  // });
  const dayjs = require("dayjs");

  const jobs = data.map((job) => {
    return {
      ...job,
      clerkId,
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 6), "month")
        .toDate(),
    };
  });
  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
