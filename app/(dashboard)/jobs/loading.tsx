import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="p-8 grid sm:grid-cols-2 gap-4 lg:grid-cols-3 rounded-b-lg border">
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
    </div>
  );
};

export default loading;
