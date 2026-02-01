import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { useAuthenticationStore } from "../../store/authStore";
import toast from "react-hot-toast";

export function DynamicBreadcrumb() {
  const location = useLocation();
  const { user, logout } = useAuthenticationStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      await logout();
      toast.success("See you later!", { duration: 2000 });
      navigate("/auth/login");
    } catch (err) {
      toast.error("Logout failed!", { duration: 1000 })
    }
  }

  // Generate breadcrumb items from URL path
  const generateBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [];

    // Always start with Home
    items.push({
      label: "Home",
      isLogout: true,
    });

    // If on dashboard, add appropriate dashboard entry
    if (pathSegments.length > 0 && pathSegments[0].includes('dashboard')) {
      const dashboardType = pathSegments[0];
      let dashboardLabel = "Dashboard";

      // Customize based on role
      if (dashboardType.includes('admin')) {
        dashboardLabel = "Admin Dashboard";
      } else if (dashboardType.includes('reviewer')) {
        dashboardLabel = "Reviewer Dashboard";
      } else if (dashboardType.includes('client')) {
        dashboardLabel = "Client Dashboard";
      }

      items.push({
        label: dashboardLabel,
        href: `/${dashboardType}`
      });

      // Process remaining path segments
      let currentPath = `/${dashboardType}`;
      for (let i = 1; i < pathSegments.length; i++) {
        currentPath += `/${pathSegments[i]}`;
        const segment = pathSegments[i];
        
        // Convert kebab-case to readable format
        const label = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

        items.push({
          label: label,
          href: currentPath,
          isLast: i === pathSegments.length - 1
        });
      }
    } else {
      // Handle non-dashboard routes
      let currentPath = '';
      for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `/${pathSegments[i]}`;
        const segment = pathSegments[i];
        
        const label = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

        items.push({
          label: label,
          href: currentPath,
          isLast: i === pathSegments.length - 1
        });
      }
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {item.isLogout ? (
                <BreadcrumbLink onClick={handleLogout} className="hover:text-pretty transition-colors cursor-pointer" >
                  {item.label}
                </BreadcrumbLink>
              ) : item.isLast ? (
                <BreadcrumbPage className="font-medium">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}