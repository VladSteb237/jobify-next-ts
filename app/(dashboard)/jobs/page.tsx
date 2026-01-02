import JobsList from "@/components/JobsList";
import SearchForm from "@/components/SearchForm";
import { getAllJobsAction, hasDemoJobsAction } from "@/utils/action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import DemoBanner from "@/components/DemoBanner";

const Jobs = async () => {
  const queryClient = new QueryClient();
  const hasDemoJobs = await hasDemoJobsAction();

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "", "all", 1],
    queryFn: () => getAllJobsAction({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {hasDemoJobs && <DemoBanner />}
      <SearchForm />
      <JobsList />
    </HydrationBoundary>
  );
};

export default Jobs;
