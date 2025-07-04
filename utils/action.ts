"use server";
import prisma from "./db";
import { auth } from "@clerk/nextjs/server";
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

async function authenticateAndRedirect(): Promise<string> {
  const { userId } = await auth();
  //console.log("userId", userId);
  if (!userId) {
    redirect("/");
  }
  return userId;
}

export const createJobAction = async (
  values: CreateAndEditJobType
): Promise<JobType | null> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = await authenticateAndRedirect();
  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.log(error);
    return null;
  }
};

type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

export const getAllJobsAction = async (
  props: GetAllJobsActionTypes
): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> => {
  const { search, jobStatus, page = 1, limit = 10 } = props;
  const userId = await authenticateAndRedirect();
  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            company: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    const skip = (page - 1) * limit;

    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    const count = await prisma.job.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(count / limit);
    return { jobs, count, page, totalPages };
  } catch (error) {
    console.log(error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
};

export const deleteJobAction = async (id: string): Promise<JobType | null> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = await authenticateAndRedirect();
  try {
    const job: JobType = await prisma.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSingleJobAction = async (
  id: string
): Promise<JobType | null> => {
  //await new Promise((resolve) => setTimeout(resolve, 2000));
  let job: JobType | null = null;
  const userId = await authenticateAndRedirect();
  try {
    job = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
  if (!job) {
    redirect("/jobs");
  }
  return job;
};

export const updateJobAction = async (
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> => {
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = await authenticateAndRedirect();
  try {
    const job: JobType = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return job;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getStatsAction = async (): Promise<{
  pending: number;
  interview: number;
  declined: number;
}> => {
  // just to show Skeleton file
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const userId = await authenticateAndRedirect();
  try {
    const stats = await prisma.job.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: userId,
      },
    });

    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const defaultStats = {
      pending: 0,
      interview: 0,
      declined: 0,
      ...statsObject,
    };
    //console.log(defaultStats);
    return defaultStats;
  } catch (error) {
    redirect("/jobs");
  }
};

export const getChartsDataAction = async (): Promise<
  Array<{ date: string; count: number }>
> => {
  const userId = await authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, "month").toDate();

  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let applicationsPerMonth = jobs.reduce((acc, curr) => {
      const date = dayjs(curr.createdAt).format("YYYY-MM");
      const existingEntry = acc.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as Array<{ date: string; count: number }>);
    return applicationsPerMonth;
  } catch (error) {
    redirect("/jobs");
  }
};
