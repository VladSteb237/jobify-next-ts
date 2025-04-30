"use client";
import { getStatsAction } from "@/utils/action";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import React from "react";
import StatsCard from "./StatsCard";

// type StatsData = {
//   pending: number;
//   interview: number;
//   declined: number;
// };

const StatsContainer = () => {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStatsAction(),
  });
  return (
    <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="pending jobs" value={data?.pending || 0} />
      <StatsCard title="interviewing jobs" value={data?.interview || 0} />
      <StatsCard title="declined jobs" value={data?.declined || 0} />
    </div>
  );
};

export default StatsContainer;
