import React, { useState } from 'react';
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import ProfileSettings from '../ui/ProfileSettings'
import toast from 'react-hot-toast';

const ReviewerProfilePage = () => {
  const { user } = useAuthenticationStore();
  const { personal, contact, getProfile, putProfile, loading, setUser } = useProfileStore();

  const [personalData, setPersonalData] = useState({
    name: "",
    role: ""
  });
  return (
    <DashboardLayout>
        <ProfileSettings />
    </DashboardLayout>
  )
}

export default ReviewerProfilePage