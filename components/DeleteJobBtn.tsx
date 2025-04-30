import React from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteJobAction } from "@/utils/action";

const DeleteJobBtn = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: (data) => {
      if (!data) {
        return toast.error("Something went wrong");
      }

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });
      toast.success("Job deleted successfully");
    },
  });
  return (
    <Button
      onClick={() => mutate(id)}
      size={"sm"}
      disabled={isPending}
      className="dark:text-white">
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default DeleteJobBtn;
