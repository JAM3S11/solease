import React, { useEffect, useState } from 'react';
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
    email: "",
    role: "",
    status: "",
  })

  const [contactData, setContactData] = useState({
    address: "",
    country: "",
    county: "",
    telephoneNumber: "",
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if(personal){
      setPersonalData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(personal).filter(([key, value]) => !prev[key] || prev[key] === "")
        )
      }))
    }

    if(contact){
      setContactData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(contact).filter(([key, value]) => !prev[key] || prev[key] === "")
        )
      }))
    }
  }, [personal, contact]);

  
  return (
    <DashboardLayout>
        <ProfileSettings />
    </DashboardLayout>
  )
}

export default ReviewerProfilePage