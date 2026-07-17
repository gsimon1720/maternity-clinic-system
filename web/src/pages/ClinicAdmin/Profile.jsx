import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Edit2,
  Save,
  X,
  Lock,
  Bell,
  Globe,
  Smartphone,
  Briefcase,
  Clock,
  CheckCircle,
  LogOut,
  Activity,
  Heart,
  Settings,
  Building2,
  Users,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, changePassword } from '../../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, currentClinic, logout, refreshSession } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Get user data from auth context
  const buildProfileState = () => ({
    name: user?.fullName || 'Clinic Admin',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    mobile: user?.phoneNumber || '',
    address: user?.address || user?.profileData?.address || '',
    nic: user?.nic || '',
    dateOfBirth: user?.dateOfBirth || user?.profileData?.dateOfBirth || '',
    role: user?.role || 'clinic_admin',

    clinicName: currentClinic?.clinic_name || 'MaterniCare Clinic',
    clinicCity: currentClinic?.city || '',
    clinicDistrict: currentClinic?.district || '',
    clinicPhone: currentClinic?.phone || '',
    clinicEmail: currentClinic?.email || '',
    clinicAddress: currentClinic?.address || '',

    employeeId: user?.id?.slice(0, 8)?.toUpperCase() || '',
    department: user?.department || user?.profileData?.department || 'Administration',
    position: user?.position || user?.profileData?.position || 'Clinic Administrator',
    joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    specialization: user?.specialization || user?.profileData?.specialization || 'Healthcare Administration',
    qualifications: user?.qualifications || user?.profileData?.qualifications || 'Healthcare Management',
    languages: user?.languages || user?.profileData?.languages || 'English, Sinhala',
    bio: user?.bio || user?.profileData?.bio || 'Experienced clinic administrator dedicated to providing quality healthcare services.',

    language: 'English',
    timezone: 'Asia/Colombo',
    dateFormat: 'DD/MM/YYYY',
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,

    emergencyName: user?.emergencyName || user?.profileData?.emergencyName || '',
    emergencyPhone: user?.emergencyPhone || user?.profileData?.emergencyPhone || '',
    emergencyRelation: user?.emergencyRelation || user?.profileData?.emergencyRelation || '',
  });

  const [profileData, setProfileData] = useState(buildProfileState);

  const [originalData, setOriginalData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Stats based on clinic data
  const stats = [
    { label: 'Total Patients', value: currentClinic?.total_patients || '0', icon: Users, color: '#F48FB1' },
    { label: 'Active Staff', value: (currentClinic?.total_doctors || 0) + (currentClinic?.total_nurses || 0) + (currentClinic?.total_midwives || 0) || '0', icon: Stethoscope, color: '#4A3B53' },
    { label: 'Doctors', value: currentClinic?.total_doctors || '0', icon: Users, color: '#10B981' },
    { label: 'Clinic Efficiency', value: '94%', icon: Activity, color: '#F59E0B' },
  ];

  const recentActivities = [
    { action: 'Clinic information updated', time: '2 hours ago', status: 'completed' },
    { action: 'New staff member added', time: '1 day ago', status: 'completed' },
    { action: 'Monthly report generated', time: '3 days ago', status: 'completed' },
    { action: 'Patient registration completed', time: '5 days ago', status: 'completed' },
  ];

  useEffect(() => {
    const nextState = buildProfileState();
    setProfileData(nextState);
    setOriginalData(nextState);
  }, [user, currentClinic]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        fullName: profileData.name,
        phoneNumber: profileData.phone,
        nic: profileData.nic,
        address: profileData.address,
        dateOfBirth: profileData.dateOfBirth,
        department: profileData.department,
        position: profileData.position,
        specialization: profileData.specialization,
        qualifications: profileData.qualifications,
        languages: profileData.languages,
        bio: profileData.bio,
        emergencyName: profileData.emergencyName,
        emergencyPhone: profileData.emergencyPhone,
        emergencyRelation: profileData.emergencyRelation,
      });
      await refreshSession();
      setOriginalData(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    toast.info('Changes discarded');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'clinic', label: 'Clinic Details', icon: Building2 },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div style={{ 
      padding: '24px', 
      background: `linear-gradient(135deg, ${COLORS.bgPink50} 0%, ${COLORS.bgPink100} 100%)`,
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '8px' }}>
              My Profile
            </h1>
            <p style={{ color: COLORS.textPink800, fontSize: '14px' }}>
              Manage your personal information and preferences
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isEditing ? (
              <button
                onClick={() => {
                  setOriginalData(profileData);
                  setIsEditing(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink800})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  boxShadow: `0 4px 12px rgba(219,39,119,0.25)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px rgba(219,39,119,0.35)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(219,39,119,0.25)`;
                }}
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'white',
                    color: COLORS.textPink800,
                    border: `2px solid ${COLORS.bgPink200}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.bgPink50;
                    e.currentTarget.style.borderColor = COLORS.textPink600;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = COLORS.bgPink200;
                  }}
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #10B981, #059669)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  {isLoading ? (
                    <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  ) : (
                    <Save size={18} />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${COLORS.bgPink200}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink900})`,
          borderRadius: '0 0 0 100%',
          opacity: 0.05
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink900})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
            }}>
              {profileData.name.charAt(0)}
            </div>
            <button style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: COLORS.textPink600,
              border: 'none',
              borderRadius: '50%',
              padding: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              <Camera size={16} color="white" />
            </button>
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>
                {profileData.name}
              </h2>
              <span style={{
                padding: '4px 12px',
                background: COLORS.textPink600,
                color: 'white',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {profileData.role}
              </span>
            </div>
            <p style={{ color: COLORS.textPink800, marginBottom: '8px' }}>{profileData.department}</p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#9CA3AF" />
                <span style={{ fontSize: '14px', color: COLORS.textPink800 }}>{profileData.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#9CA3AF" />
                <span style={{ fontSize: '14px', color: COLORS.textPink800 }}>{profileData.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#9CA3AF" />
                <span style={{ fontSize: '14px', color: COLORS.textPink800 }}>Joined {profileData.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            minWidth: '200px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${stat.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900 }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: COLORS.textPink800 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '8px',
        flexWrap: 'wrap'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: activeTab === tab.id ? `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink900})` : 'white',
              color: activeTab === tab.id ? 'white' : COLORS.textPink800,
              border: activeTab === tab.id ? 'none' : `1px solid ${COLORS.bgPink200}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = COLORS.bgPink50;
                e.currentTarget.style.borderColor = COLORS.textPink600;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = COLORS.bgPink200;
              }
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              Personal Information
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.name}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.email}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.phone}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Smartphone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="mobile"
                    value={profileData.mobile}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.mobile}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.address}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Join Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="joinDate"
                    value={profileData.joinDate}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.joinDate}</p>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textPink900, marginTop: '32px', marginBottom: '16px' }}>
              Emergency Contact
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Contact Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyName"
                    value={profileData.emergencyName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.emergencyName || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={profileData.emergencyPhone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.emergencyPhone || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Clinic Details Tab */}
        {activeTab === 'clinic' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              Clinic Details
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Building2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Clinic Name
                </label>
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.clinicName}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> City
                </label>
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.clinicCity || 'Not set'}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> District
                </label>
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.clinicDistrict || 'Not set'}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Clinic Phone
                </label>
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.clinicPhone || 'Not set'}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Clinic Email
                </label>
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.clinicEmail || 'Not set'}</p>
              </div>
              
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Clinic Address
                </label>
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.clinicAddress || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Professional Tab */}
        {activeTab === 'professional' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              Professional Information
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Employee ID
                </label>
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.employeeId}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={profileData.department}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.department}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="position"
                    value={profileData.position}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.position}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Specialization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialization"
                    value={profileData.specialization}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${COLORS.bgPink200}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                    onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                  />
                ) : (
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.specialization}</p>
                )}
              </div>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${COLORS.bgPink200}`,
                    borderRadius: '10px',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                  onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                />
              ) : (
                <p style={{ fontSize: '15px', color: COLORS.textPink800, lineHeight: '1.6' }}>{profileData.bio}</p>
              )}
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                Qualifications
              </label>
              {isEditing ? (
                <textarea
                  name="qualifications"
                  value={profileData.qualifications}
                  onChange={handleChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${COLORS.bgPink200}`,
                    borderRadius: '10px',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                  onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                />
              ) : (
                <p style={{ fontSize: '15px', color: COLORS.textPink800, lineHeight: '1.6' }}>{profileData.qualifications}</p>
              )}
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                Languages
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="languages"
                  value={profileData.languages}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${COLORS.bgPink200}`,
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORS.textPink600}
                  onBlur={(e) => e.target.style.borderColor = COLORS.bgPink200}
                />
              ) : (
                <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{profileData.languages}</p>
              )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              Security Settings
            </h2>
            
            {!showChangePassword ? (
              <button
                onClick={() => setShowChangePassword(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: 'white',
                  border: `2px solid ${COLORS.textPink600}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: COLORS.textPink600,
                  fontWeight: '600',
                  width: '100%',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = COLORS.textPink600;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = COLORS.textPink600;
                }}
              >
                <Lock size={18} />
                Change Password
              </button>
            ) : (
              <div style={{
                background: COLORS.bgPink50,
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.textPink900 }}>Update Password</h3>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${passwordErrors.currentPassword ? '#EF4444' : COLORS.bgPink200}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {passwordErrors.currentPassword && (
                      <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${passwordErrors.newPassword ? '#EF4444' : COLORS.bgPink200}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {passwordErrors.newPassword && (
                      <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${passwordErrors.confirmPassword ? '#EF4444' : COLORS.bgPink200}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {passwordErrors.confirmPassword && (
                      <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowChangePassword(false)}
                      style={{
                        padding: '10px 20px',
                        background: 'white',
                        border: `2px solid ${COLORS.bgPink200}`,
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePassword}
                      style={{
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink800})`,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Session Management */}
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.textPink900, marginBottom: '16px' }}>
                Active Sessions
              </h3>
              <div style={{
                padding: '16px',
                background: COLORS.bgPink50,
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${COLORS.bgPink200}`
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: COLORS.textPink900 }}>Current Session</p>
                  <p style={{ fontSize: '12px', color: COLORS.textPink800 }}>Chrome on Windows • IP: 192.168.1.1</p>
                </div>
                <span style={{ padding: '4px 8px', background: '#10B981', color: 'white', borderRadius: '4px', fontSize: '11px' }}>
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div style={{
        marginTop: '24px',
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${COLORS.bgPink200}`
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '16px' }}>
          Recent Activity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentActivities.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: COLORS.bgPink50,
              borderRadius: '10px',
              border: `1px solid ${COLORS.bgPink100}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={16} color="#10B981" />
                <span style={{ fontSize: '14px', color: COLORS.textPink900 }}>{activity.action}</span>
              </div>
              <span style={{ fontSize: '12px', color: COLORS.textPink800 }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FECACA';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FEE2E2';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <LogOut size={18} />
          Logout Account
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Profile;