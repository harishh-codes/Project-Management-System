import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { userAPI, authAPI } from "../api";
import { handleAxiosError, handleAxiosSuccess } from "../utils/helpers";
import { setUser } from "../store/authSlice";

// Icons
import {
  User,
  Mail,
  ShieldCheck,
  Edit,
  Lock,
  Save,
  X,
  CheckCircle,
  CircleAlert,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userAPI.updateProfile(formData);
      const updatedUser = res.data?.data || { ...user, ...formData };
      dispatch(setUser(updatedUser));
      handleAxiosSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwordData.oldPassword)
      newErrors.oldPassword = "Current password is required";
    if (!passwordData.newPassword)
      newErrors.newPassword = "New password is required";
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      handleAxiosSuccess("Password changed successfully!");
      setChangePasswordMode(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <Card className="shadow-lg rounded-3xl p-8 bg-white/80 backdrop-blur-sm border border-gray-200">
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 shadow-inner">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500">Manage your information</p>
            </div>
          </div>

          {/* CONTENT */}
          {!changePasswordMode ? (
            <>
              {!editing ? (
                // VIEW MODE
                <div className="space-y-6">
                  {/* FULL NAME & USERNAME */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                      <p className="text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <User className="w-4 h-4" /> Full Name
                      </p>
                      <p className="text-lg text-gray-900">
                        {user?.fullName || "Not set"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                      <p className="text-gray-600 font-semibold mb-1 flex items-center gap-1">
                        <User className="w-4 h-4" /> Username
                      </p>
                      <p className="text-lg text-gray-900">{user?.username}</p>
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                    <p className="text-gray-600 font-semibold mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Email
                    </p>
                    <p className="text-lg text-gray-900">{user?.email}</p>
                  </div>

                  {/* ROLE + VERIFIED */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                      <p className="text-gray-600 font-semibold mb-1">
                        Role
                      </p>
                      <p className="text-lg capitalize text-gray-900">
                        {user?.role}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                      <p className="text-gray-600 font-semibold mb-1">
                        Email Verified
                      </p>
                      <p className="text-lg flex items-center gap-2">
                        {user?.isEmailVerified ? (
                          <>
                            <CheckCircle className="text-green-600 w-5 h-5" />{" "}
                            Verified
                          </>
                        ) : (
                          <>
                            <CircleAlert className="text-amber-500 w-5 h-5" />{" "}
                            Pending
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="primary"
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit size={18} /> Edit Profile
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setChangePasswordMode(true)}
                      className="flex items-center gap-2"
                    >
                      <Lock size={18} /> Change Password
                    </Button>
                  </div>
                </div>
              ) : (
                // EDIT MODE
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <Input
                    label="Full Name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />

                  <Input
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={loading}
                      className="flex items-center gap-2"
                    >
                      <Save size={18} /> Save Changes
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2"
                    >
                      <X size={18} /> Cancel
                    </Button>
                  </div>
                </form>
              )}
            </>
          ) : (
            // CHANGE PASSWORD MODE
            <form onSubmit={handleChangePassword} className="space-y-6">
              <Input
                label="Current Password"
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                error={errors.oldPassword}
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
              />

              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className="flex items-center gap-2"
                >
                  <Save size={18} /> Change Password
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChangePasswordMode(false)}
                  className="flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}
