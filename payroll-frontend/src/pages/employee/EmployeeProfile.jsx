import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", department: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/employee/profile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setProfile(res.data);
        setFormData({
          name: res.data.name,
          department: res.data.department
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/employee/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  const initials = profile.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Header Card */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white shadow-lg">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-semibold backdrop-blur-sm">
              {initials}
            </div>

            <div>
              <h1 className="text-3xl font-semibold">
                {profile.name}
              </h1>
              <p className="text-white/80 mt-1">
                {profile.department}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-blue-600 px-5 py-2 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12">

        <h2 className="text-xl font-semibold text-gray-900 mb-8">
          Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Name */}
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
              />
            ) : (
              <p className="mt-2 text-lg text-gray-900">{profile.name}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <p className="text-sm text-gray-500">Department</p>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
              />
            ) : (
              <p className="mt-2 text-lg text-gray-900">{profile.department}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="mt-2 text-lg text-gray-900">{profile.email}</p>
          </div>

          {/* DOJ */}
          <div>
            <p className="text-sm text-gray-500">Date of Joining</p>
            <p className="mt-2 text-lg text-gray-900">
              {new Date(profile.doj).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Buttons */}
        {isEditing && (
          <div className="flex gap-4 mt-10">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="border border-gray-300 px-6 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

    </div>
  );
}