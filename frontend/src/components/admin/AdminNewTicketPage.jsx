import React from 'react';
import NewTicketForm from '../ui/NewTicketForm';

const AdminNewTicketPage = () => {
  return <NewTicketForm role="admin" navigatePath="/admin-dashboard/admin-tickets" />;
};

export default AdminNewTicketPage;