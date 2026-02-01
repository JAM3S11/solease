// components/DashboardLayout.jsx
import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./shadcn-sidebar";
import { AppSidebar } from "./Sidebar";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";
import { useAuthenticationStore } from "../../store/authStore";

const DashboardLayout = ({ children }) => {
  const { user } = useAuthenticationStore();

  return (
    <ThemeProvider defaultTheme="system" storageKey="solease-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <AppSidebar userRole={user?.role} />

          <SidebarInset className="flex flex-col flex-1 min-w-0 h-full m-0 rounded-none shadow-none border-none overflow-hidden">
            <header className="flex h-14 shrink-0 items-center gap-2 px-4 border-b border-border/50 bg-background/95 backdrop-blur">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-[1px] bg-border mx-2" />
              <div className="flex-1">
                <DynamicBreadcrumb />
              </div>
              <ThemeToggle />
            </header>
            
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;