import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useProfileStore } from "../../store/profileStore";
import ProfileSettings from '../ui/ProfileSettings'
import toast from 'react-hot-toast';

const ClientProfilePage = () => {
  const { user } = useAuthenticationStore();
  const { personal, contact, getProfile, putProfile, loading, setUser } = useProfileStore();

  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    verified: false,
    createdAt: null,
    avatar: null,
    lastLogin: null,
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
    // Only update if fields are empty to avoid overwriting user input
    if (personal) {
      setPersonalData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(personal).filter(([key, value]) => !prev[key] || prev[key] === "")
        )
      }));
    }
    if (contact) {
      setContactData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(contact).filter(([key, value]) => !prev[key] || prev[key] === "")
        )
      }));
    }
  }, [personal, contact]);

  const handlePersonalChange = (e) =>
    setPersonalData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleContactChange = (e) =>
    setContactData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSave = async () => {
    const res = await putProfile({
      personal: personalData,
      contact: contactData
    });
    if (res?.success) {
      toast.success("Profile updated successfully!", { duration: 2000 });
      if (res?.user) {
        setUser(res.user);
      }
    }
  }

  return (
    <DashboardLayout>
      <ProfileSettings
        role="client"
        user={user}
        personalData={personalData}
        contactData={contactData}
        onPersonalChange={handlePersonalChange}
        onContactChange={handleContactChange}
        onSave={handleSave}
        loading={loading}
        verified={user?.verified || false}
        createdAt={user?.createdAt || null}
        avatar={user?.avatar || null}
        lastLogin={user?.lastLogin || null}
      />
    </DashboardLayout>
  )
}

export default ClientProfilePage;