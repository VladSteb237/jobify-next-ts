"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleJobAction, updateJobAction } from "@/utils/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createAndEditJobSchema,
  CreateAndEditJobType,
  JobMode,
  JobStatus,
} from "@/utils/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { CustomFormField, CustomFormSelect } from "./FormComponents";
import { Button } from "./ui/button";

const EditJobForm = ({ jobId }: { jobId: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getSingleJobAction(jobId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditJobType) =>
      updateJobAction(jobId, values),
    onSuccess: (data) => {
      if (!data) {
        return toast.error("Something went wrong");
      }
      toast.success("Job updated successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      router.push("/jobs");
    },
  });

  // 1. Define your form.
  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: data?.position || "",
      company: data?.company || "",
      location: data?.location || "",
      status: (data?.status as JobStatus) || JobStatus.Pending,
      mode: (data?.mode as JobMode) || JobMode.FullTime,
    },
  });
  // 2. Define a submit handler.
  const onSubmit = (values: CreateAndEditJobType) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded">
        <h2 className="capitalize font-semibold text-4xl mb-6">edit job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          <CustomFormField name="position" control={form.control} />
          <CustomFormField name="company" control={form.control} />
          <CustomFormField name="location" control={form.control} />
          {/* job status */}
          <CustomFormSelect
            name="status"
            control={form.control}
            labelText="job status"
            items={Object.values(JobStatus)}
          />
          {/* job mode */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            labelText="job mode"
            items={Object.values(JobMode)}
          />
          <Button
            type="submit"
            className="dark:text-white capitalize self-end"
            disabled={isPending}>
            {isPending ? "loading..." : "job update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditJobForm;
