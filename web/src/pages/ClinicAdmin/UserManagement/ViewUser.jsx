import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  User, 
  Briefcase, 
  Shield,
  Heart,
  Stethoscope,
  Baby,
  Users,
  AlertCircle,
  IdCard,
  GraduationCap,
  Clock,
  Edit2,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  Activity,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getClinicUserById } from '../../../services/userService';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentClinic } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await getClinicUserById(id);

        setUser({
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          nic: userData.nic,
          role: userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Unknown',
          status: userData.status,
          lastLogin: userData.lastLogin || 'N/A',
          registeredAt: userData.createdAt,
          licenseNumber: userData.licenseNumber,
          specialization: userData.specialization,
          qualifications: userData.qualifications,
          yearsOfExperience: userData.yearsOfExperience,
        });
      } catch (error) {
        toast.error(error.message || 'Unable to load user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'doctor': return <Stethoscope size={20} />;
      case 'nurse': return <Users size={20} />;
      case 'midwife': return <Baby size={20} />;
      case 'admin': return <Shield size={20} />;
      default: return <User size={20} />;
    }
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'doctor': return '#10B981';
      case 'midwife': return '#8B5CF6';
      case 'nurse': return '#3B82F6';
      case 'admin': return '#F59E0B';
      default: return COLORS.textPink600;
    }
  };

  const getInitials = (name) => {
    return name?.charAt(0) || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = () => {
    navigate(`/users/edit/${user?.id}`);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Preparing print...');
  };

  const handleExport = () => {
    toast.success('Exporting user data...');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: COLORS.bgPink50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `3px solid ${COLORS.bgPink200}`,
            borderTopColor: COLORS.textPink600,
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: COLORS.textPink800 }}>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: COLORS.bgPink50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 style={{ marginTop: '16px', color: COLORS.textPink900 }}>User Not Found</h2>
          <button
            onClick={() => navigate('/users')}
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              background: COLORS.textPink600,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'Admin';

  return (
    <div style={{
      padding: '24px',
      background: `linear-gradient(135deg, ${COLORS.bgPink50} 0%, ${COLORS.bgPink100} 100%)`,
      minHeight: '100vh'
    }}>
      {/* Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <button
          onClick={() => navigate('/users')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'white',
            border: `1px solid ${COLORS.bgPink200}`,
            borderRadius: '10px',
            cursor: 'pointer',
            color: COLORS.textPink800,
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.bgPink100;
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={18} />
          Back to Users
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'white',
              border: `1px solid ${COLORS.bgPink200}`,
              borderRadius: '10px',
              cursor: 'pointer',
              color: COLORS.textPink800,
              fontWeight: '500',
              fontSize: '14px',
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
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={handleExport}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'white',
              border: `1px solid ${COLORS.bgPink200}`,
              borderRadius: '10px',
              cursor: 'pointer',
              color: COLORS.textPink800,
              fontWeight: '500',
              fontSize: '14px',
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
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleEdit}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              background: COLORS.textPink600,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Edit2 size={16} />
            Edit User
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: `1px solid ${COLORS.bgPink200}`
      }}>
        {/* Profile Header */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink900})`,
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: '250px',
            height: '250px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '50%'
          }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: `linear-gradient(135deg, ${getRoleColor(user.role)}, ${getRoleColor(user.role)}cc)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                border: '4px solid rgba(255,255,255,0.2)'
              }}>
                <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>
                  {getInitials(user.fullName)}
                </span>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: user.status === 'active' ? '#10b981' : '#ef4444',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '3px solid white'
              }} />
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                  {user.fullName}
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  {getRoleIcon(user.role)}
                  {user.role}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)' }}>
                  <Mail size={14} />
                  <span style={{ fontSize: '13px' }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)' }}>
                  <Clock size={14} />
                  <span style={{ fontSize: '13px' }}>Joined {formatDate(user.registeredAt)}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div style={{
              padding: '10px 20px',
              background: user.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              {user.status === 'active' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Active</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                  <XCircle size={18} />
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Inactive</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '0 32px',
          borderBottom: `1px solid ${COLORS.bgPink200}`,
          background: 'white'
        }}>
          {['overview', 'professional', 'details'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${COLORS.textPink600}` : '2px solid transparent',
                color: activeTab === tab ? COLORS.textPink600 : COLORS.textPink800,
                fontWeight: activeTab === tab ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '32px' }}>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: COLORS.bgPink50,
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `${getRoleColor(user.role)}15`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <Activity size={24} color={getRoleColor(user.role)} />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>
                    {user.yearsOfExperience || 'N/A'}
                  </h3>
                  <p style={{ fontSize: '13px', color: COLORS.textPink800 }}>Years of Experience</p>
                </div>

                <div style={{
                  background: COLORS.bgPink50,
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `${COLORS.textPink600}15`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <Clock size={24} color={COLORS.textPink600} />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>
                    {user.lastLogin || 'N/A'}
                  </h3>
                  <p style={{ fontSize: '13px', color: COLORS.textPink800 }}>Last Login</p>
                </div>

                <div style={{
                  background: COLORS.bgPink50,
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#10b98115',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <FileText size={24} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>
                    {user.id}
                  </h3>
                  <p style={{ fontSize: '13px', color: COLORS.textPink800 }}>User ID</p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                <InfoCard
                  icon={IdCard}
                  label="NIC Number"
                  value={user.nic}
                  color={COLORS.textPink600}
                />
                {!isAdmin && user.licenseNumber && (
                  <InfoCard
                    icon={GraduationCap}
                    label="License Number"
                    value={user.licenseNumber}
                    color={COLORS.textPink600}
                  />
                )}
                {!isAdmin && user.specialization && (
                  <InfoCard
                    icon={Stethoscope}
                    label="Specialization"
                    value={user.specialization}
                    color={COLORS.textPink600}
                  />
                )}
                {!isAdmin && user.qualifications && (
                  <InfoCard
                    icon={GraduationCap}
                    label="Qualifications"
                    value={user.qualifications}
                    color={COLORS.textPink600}
                  />
                )}
              </div>
            </div>
          )}

          {/* Professional Tab */}
          {activeTab === 'professional' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPink900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} color={COLORS.textPink600} />
                Professional Information
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                <InfoCard icon={Briefcase} label="Role" value={user.role} color={COLORS.textPink600} />
                <InfoCard icon={Clock} label="Registered Since" value={formatDate(user.registeredAt)} color={COLORS.textPink600} />
                
                {!isAdmin && (
                  <>
                    {user.licenseNumber && (
                      <InfoCard icon={IdCard} label="License Number" value={user.licenseNumber} color={COLORS.textPink600} />
                    )}
                    {user.qualifications && (
                      <InfoCard icon={GraduationCap} label="Qualifications" value={user.qualifications} color={COLORS.textPink600} />
                    )}
                    {user.specialization && (
                      <InfoCard icon={Stethoscope} label="Specialization" value={user.specialization} color={COLORS.textPink600} />
                    )}
                    {user.yearsOfExperience && (
                      <InfoCard icon={Activity} label="Years of Experience" value={`${user.yearsOfExperience} years`} color={COLORS.textPink600} />
                    )}
                  </>
                )}

                {isAdmin && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{
                      background: COLORS.bgPink50,
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center',
                      border: `1px solid ${COLORS.bgPink200}`
                    }}>
                      <p style={{ color: COLORS.textPink800, fontSize: '14px' }}>
                        ℹ️ Administrator accounts do not have professional information.
                      </p>
                      <p style={{ color: COLORS.textPink200, fontSize: '12px', marginTop: '4px' }}>
                        Admin users have full system access across the clinic.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPink900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color={COLORS.textPink600} />
                Personal Details
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                <InfoCard icon={User} label="Full Name" value={user.fullName} color={COLORS.textPink800} />
                <InfoCard icon={Mail} label="Email" value={user.email} color={COLORS.textPink800} />
                <InfoCard icon={IdCard} label="NIC Number" value={user.nic} color={COLORS.textPink800} />
                <InfoCard icon={Clock} label="Last Login" value={user.lastLogin || 'N/A'} color={COLORS.textPink800} />
                <InfoCard icon={FileText} label="Status" value={
                  <span style={{ color: user.status === 'active' ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                } color={COLORS.textPink800} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon: Icon, label, value, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: COLORS.bgPink50,
    borderRadius: '14px',
    transition: 'all 0.3s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
  >
    <div style={{
      width: '36px',
      height: '36px',
      background: `${color}15`,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon size={18} color={color} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </p>
      <p style={{ fontSize: '14px', fontWeight: '500', color: COLORS.textPink900, wordBreak: 'break-word' }}>
        {value || 'Not provided'}
      </p>
    </div>
  </div>
);

export default ViewUser;