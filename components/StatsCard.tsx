import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type StatsCardsProps = {
  title: string;
  value: number;
};

const StatsCard = (props: StatsCardsProps) => {
  const { title, value } = props;

  return (
    <Card className="bg-muted">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize">{title}</CardTitle>
        <CardDescription className="text-4xl font-extrabold text-primary mt-[0px!important]">
          {value}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export function StatsLoadingCard() {
  return (
    <Card className="w-[330px] h-[88px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default StatsCard;
