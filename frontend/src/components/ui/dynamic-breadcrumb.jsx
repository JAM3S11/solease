import React, { useEffect, useState } from "react";
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
import useTicketStore from "@/store/ticketStore";

export function DynamicBreadcrumb() {
  const location = useLocation();
  const { user, logout } = useAuthenticationStore();
  const { fetchSingleTicket, tickets } = useTicketStore();
  const navigate = useNavigate();

  const [ items, setItems ] = useState([]);

  const handleLogout = async () => {
    try{
      await logout();
      toast.success("See you later!", { duration: 2000 });
      navigate("/auth/login");
    } catch (err) {
      toast.error("Logout failed!", { duration: 1000 })
    }
  }

  // Shall be of beneficial in the breadcrumb section instead of it reading the Ticket ID
  // It shall fetch using the Ticket Issue type
  // (Software Issue, Hardware Issue, etc...)
  const getInitials = (text) => {
    if(!text) return "";
    return text
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('.')
      .toUpperCase()
  }
  // Generate breadcrumb items from URL path
  useEffect(() => {
    const updateBreadcrumbs = async () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const breadcrumbList = [];
  
      // Always start with Home
      breadcrumbList.push({
        label: "Home",
        isLogout: true,
        href: "home-key"
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
  
        breadcrumbList.push({
          label: dashboardLabel,
          href: `/${dashboardType}`
        });
  
        // Process remaining path segments
        let currentPath = `/${dashboardType}`;
        for (let i = 1; i < pathSegments.length; i++) {
          currentPath += `/${pathSegments[i]}`;
          const segment = pathSegments[i];
          
          let displayLabel;
  
          // Counter check to see if this is a Ticket ID segment
          if(pathSegments[i-1] === 'ticket' && segment.length > 10){
            // Find the ticket store to get the issueType
            let ticket = tickets.find(t => t._id === segment);
            if(!ticket) {
             ticket = await fetchSingleTicket(segment);
            }
            displayLabel = ticket?.issueType ? getInitials(ticket.issueType) : segment.substring(0, 6);
          } else {
            // Convert kebab-case to readanle format
            displayLabel = segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          }
          breadcrumbList.push({
            label: displayLabel,
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
  
          breadcrumbList.push({
            label: label,
            href: currentPath,
            isLast: i === pathSegments.length - 1
          });
        }
      }
  
      setItems(breadcrumbList);
    };

    updateBreadcrumbs();
  }, [location.pathname, tickets]);

  // const b = generateBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
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
            {index < items.length - 1 && (
              <BreadcrumbSeparator />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}