import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProfile(profile);

      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userEmail", response.data.email);

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password changed successfully");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Failed to change password");
    }
  };

  return (
    <Layout>
      <div className="page-container">

        <h2>My Profile</h2>

        <div className="card">

          <form onSubmit={handleUpdateProfile}>

            <div className="form-group">
              <label>Name</label>
              <input
                className="input"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
            >
              Update Profile
            </button>

          </form>

        </div>

        <br />

        <div className="card">

          <h3>Change Password</h3>

          <form onSubmit={handleChangePassword}>

            <div className="form-group">
              <label>Current Password</label>
              <input
                className="input"
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                className="input"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                className="input"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
            >
              Change Password
            </button>

          </form>

        </div>

      </div>
    </Layout>
  );
};

export default Profile;