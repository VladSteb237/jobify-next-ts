import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs/server";
import { createDemoJobs } from "@/utils/createDemoJobs";

async function layout({ children }: PropsWithChildren) {
  const { userId } = await auth();

  if (userId) {
    await createDemoJobs(userId);
  }

  return (
    <main className="grid lg:grid-cols-5">
      <div className="hidden lg:block lg:col-span-1 lg:min-h-screen">
        <Sidebar />
      </div>
      <div className="lg:col-span-4">
        <Navbar />
        <div className="py-16 px-4 sm:px-8 lg:px-16">{children}</div>
      </div>
    </main>
  );
}
export default layout;
