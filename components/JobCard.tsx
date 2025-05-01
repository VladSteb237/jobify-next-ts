import { JobType } from "@/utils/types";
import React from "react";
import { MapPin, Briefcase, CalendarDays, RadioTower } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import JobInfo from "./JobInfo";
import { Badge } from "./ui/badge";
import DeleteJobBtn from "./DeleteJobBtn";

const JobCard = ({ job }: { job: JobType }) => {
  const date = new Date(job.createdAt).toLocaleDateString();

  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle className="capitalize">{job.position}</CardTitle>
        <CardDescription className="capitalize">{job.company}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4 grid grid-cols-2 gap-4">
        <JobInfo icon={<Briefcase />} text={job.mode} />
        <JobInfo icon={<MapPin />} text={job.location} />
        <JobInfo icon={<CalendarDays />} text={date} />
        <Badge className="w-32 justify-center rounded-xl">
          <JobInfo
            icon={<RadioTower className="w-4 h-4 dark:text-white" />}
            text={job.status}
          />
        </Badge>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button asChild size={"sm"}>
          <Link href={`/jobs/${job.id}`} className="dark:text-white">
            Edit
          </Link>
        </Button>
        <DeleteJobBtn id={job.id} />
      </CardFooter>
    </Card>
  );
};

export default JobCard;
