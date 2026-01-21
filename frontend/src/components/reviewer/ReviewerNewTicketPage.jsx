import React from 'react';
import NewTicketForm from '../ui/NewTicketForm';
import useTicketStore from '../../store/ticketStore';

const ReviewerNewTicketPage = () => {
  const { tickets } = useTicketStore();

  return <NewTicketForm role="reviewer" navigatePath="/reviewer-dashboard" tickets={tickets} />;
};

export default ReviewerNewTicketPage;