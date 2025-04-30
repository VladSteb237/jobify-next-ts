"use client";
import { getAllJobsAction } from "@/utils/action";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";
import JobCard from "./JobCard";
import ButtonContainer from "./ButtonContainer";

const JobsList = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const jobStatus = searchParams.get("jobStatus") || "all";
  const pageNumber = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["jobs", search, jobStatus, pageNumber],
    queryFn: () => getAllJobsAction({ search, jobStatus, page: pageNumber }),
  });

  const jobs = data?.jobs || [];
  const count = data?.count || 0;
  const page = data?.page || 1;
  const totalPages = data?.totalPages || 0;

  if (isPending) {
    return <h2 className="text-xl">Please Wait...</h2>;
  }
  if (jobs.length < 1) {
    return <h2 className="text-xl">No Jobs Found...</h2>;
  }

  return (
    <React.Fragment>
      {/*button container  */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold capitalize">{count} Jobs Found</h2>
        {totalPages < 2 ? null : (
          <ButtonContainer currentPage={page} totalPages={totalPages} />
        )}
      </div>
      {/* card container */}
      <div className="grid md:grid-cols-2 gap-8">
        {jobs.map((job) => {
          return <JobCard key={job.id} job={job} />;
        })}
      </div>
    </React.Fragment>
  );
};

export default JobsList;
