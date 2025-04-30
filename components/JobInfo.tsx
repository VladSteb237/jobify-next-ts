import React from "react";

const JobInfo = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="flex items-center gap-x-2">
      {icon}
      <span className="dark:text-white">{text}</span>
    </div>
  );
};

export default JobInfo;
