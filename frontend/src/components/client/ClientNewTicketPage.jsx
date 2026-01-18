import React from 'react';
import NewTicketForm from '../ui/NewTicketForm';
import useTicketStore from '../../store/ticketStore';

const ClientNewTicketPage = () => {
  const { tickets } = useTicketStore();

  return <NewTicketForm role="client" navigatePath="/client-dashboard" tickets={tickets} />;
};

export default ClientNewTicketPage;