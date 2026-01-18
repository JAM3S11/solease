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
    if (personal) setPersonalData((prev) => ({ ...prev, ...personal }));
    if (contact) setContactData((prev) => ({ ...prev, ...contact }));
  }, [personal, contact]);

  const handlePersonalChange = (e) =>
    setPersonalData({
      ...personalData,
      [e.target.name]: e.target.value,
    });

  const handleContactChange = (e) =>
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });

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
      />
    </DashboardLayout>
  )
}

export default ClientProfilePage;