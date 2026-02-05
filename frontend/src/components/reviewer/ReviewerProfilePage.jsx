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

  // Check on the personal data form
  const handlePersonalChange = (e) => {
    setPersonalData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Check on the contact data form
  const handleContactChange = (e) => {
    setContactData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  //Save the changes
  const handleSave = async () => {
    const res = await putProfile({
      personal: personalData,
      contact: contactData,
    });
    if(res?.success){
      toast.success("Profile updated successfully!", { duration: 2000 });
      if(res?.user){
        setUser(res.user);
      }
    }
  }
  return (
    <DashboardLayout>
        <ProfileSettings />
    </DashboardLayout>
  )
}

export default ReviewerProfilePage