import { prisma } from "@/utils/db";
import { demoJobs } from "@/prisma/demo-jobs";

export async function createDemoJobs(clerkId: string) {
  const jobsCount = await prisma.job.count({
    where: { clerkId },
  });

  if (jobsCount > 0) return;

  await prisma.job.createMany({
    data: demoJobs.map((job, index) => ({
      ...job,
      clerkId,
      isDemo: true,
      createdAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 7), // разные даты
    })),
  });
}
