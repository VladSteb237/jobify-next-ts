import EditJobForm from "@/components/EditJobForm";
import { getSingleJobAction } from "@/utils/action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const SingleJob = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["job", id],
    queryFn: () => getSingleJobAction(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditJobForm jobId={id} />
    </HydrationBoundary>
  );
};

export default SingleJob;
