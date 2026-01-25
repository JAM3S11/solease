import React from 'react';
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import ProfileSettings from '../ui/ProfileSettings'
import toast from 'react-hot-toast';

const ReviewerProfilePage = () => {
  return (
    <DashboardLayout>
        <ProfileSettings />
    </DashboardLayout>
  )
}

export default ReviewerProfilePage