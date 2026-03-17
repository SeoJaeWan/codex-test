"use client";

import type { ReactNode } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

export interface DashboardLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerRight?: ReactNode;
  currentPath?: string;
}

const DashboardLayout = ({
  children,
  headerTitle,
  headerRight,
  currentPath = "/dashboard",
}: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar currentPath={currentPath} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={headerTitle} right={headerRight} />

        <main
          className="flex-1 overflow-y-auto px-4 py-6 pb-20 md:px-6 md:pb-6 lg:px-8"
          data-testid="dashboard-main"
        >
          {children}
        </main>

        <MobileNav currentPath={currentPath} />
      </div>
    </div>
  );
};

export default DashboardLayout;
