import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Briefcase, 
  X,
  Stethoscope,
  Baby,
  Users,
  GraduationCap,
  IdCard
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getClinicUserById, updateClinicUser } from '../../../services/userService';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentClinic } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Common fields - Phone, Address, DOB removed
  const [commonData, setCommonData] = useState({
    fullName: '',
    email: '',
    nic: '',
    status: 'active'
  });

  // Role Specific Fields - All optional
  const [doctorData, setDoctorData] = useState({ 
    licenseNumber: '', 
    specialization: '', 
    qualifications: '', 
    yearsOfExperience: '' 
  });
  
  const [nurseData, setNurseData] = useState({ 
    licenseNumber: '', 
    qualifications: '', 
    yearsOfExperience: '' 
  });
  
  const [midwifeData, setMidwifeData] = useState({ 
    licenseNumber: '', 
    qualifications: '', 
    yearsOfExperience: '' 
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getClinicUserById(id);
        const normalizedRole = String(userData.role || 'doctor').toLowerCase();

        setSelectedRole(normalizedRole);
        setCommonData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          nic: userData.nic || '',
          status: userData.status || 'active'
        });

        if (normalizedRole === 'doctor') {
          setDoctorData({
            licenseNumber: userData.licenseNumber || '',
            specialization: userData.specialization || '',
            qualifications: userData.qualifications || '',
            yearsOfExperience: userData.yearsOfExperience || ''
          });
        } else if (normalizedRole === 'nurse') {
          setNurseData({
            licenseNumber: userData.licenseNumber || '',
            qualifications: userData.qualifications || '',
            yearsOfExperience: userData.yearsOfExperience || ''
          });
        } else if (normalizedRole === 'midwife') {
          setMidwifeData({
            licenseNumber: userData.licenseNumber || '',
            qualifications: userData.qualifications || '',
            yearsOfExperience: userData.yearsOfExperience || ''
          });
        }
      } catch (error) {
        toast.error(error.message || 'Unable to load user');
        navigate('/users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateCommonFields = () => {
    const newErrors = {};
    if (!commonData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!commonData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(commonData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!commonData.nic.trim()) newErrors.nic = 'NIC is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUserData = async () => {
    setIsLoading(true);
    
    const updatedData = {
      fullName: commonData.fullName,
      email: commonData.email,
      nic: commonData.nic,
      role: selectedRole,
      clinicKey: currentClinic?.id,
      status: commonData.status,
      profileData: {}
    };

    if (selectedRole === 'doctor') {
      updatedData.profileData = {
        licenseNumber: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        qualifications: doctorData.qualifications,
        yearsOfExperience: doctorData.yearsOfExperience,
      };
    } else if (selectedRole === 'nurse') {
      updatedData.profileData = {
        licenseNumber: nurseData.licenseNumber,
        qualifications: nurseData.qualifications,
        yearsOfExperience: nurseData.yearsOfExperience,
      };
    } else if (selectedRole === 'midwife') {
      updatedData.profileData = {
        licenseNumber: midwifeData.licenseNumber,
        qualifications: midwifeData.qualifications,
        yearsOfExperience: midwifeData.yearsOfExperience,
      };
    }

    try {
      await updateClinicUser(id, updatedData);
      toast.success('Profile updated successfully!');
      navigate('/users');
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCommonFields()) {
      toast.error('Please fix the errors in Basic Information');
      return;
    }

    if (!currentClinic?.id) {
      toast.error('No clinic is selected for this account');
      return;
    }
    
    saveUserData();
  };

  const handleNext = () => {
    if (validateCommonFields()) {
      setCurrentStep(2);
    } else {
      toast.error('Please fix the errors in Basic Information');
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${errors[fieldName] ? '#EF4444' : COLORS.bgPink200}`,
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    color: COLORS.textPink900,
    fontFamily: 'inherit'
  });

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: COLORS.textPink800
  };

  return (
    <div style={{ 
      padding: '24px', 
      background: `linear-gradient(135deg, ${COLORS.bgPink50} 0%, ${COLORS.bgPink100} 100%)`, 
      minHeight: '100vh' 
    }}>
      {/* Back Button */}
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
          marginBottom: '20px',
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
        <ArrowLeft size={18} /> Back to Users
      </button>

      {/* Main Card */}
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        background: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 20px 25px -5px rgba(131,24,67,0.08)', 
        overflow: 'hidden', 
        border: `1px solid ${COLORS.bgPink200}` 
      }}>
        {/* Header */}
        <div style={{ 
          background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink900})`, 
          padding: '32px', 
          color: 'white', 
          textAlign: 'center' 
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Edit Staff Profile
          </h1>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>
            Modify profile details for {currentClinic?.clinic_name || 'your clinic'}
          </p>
        </div>

        {/* Step Tabs - Admin සඳහා Professional Info Tab එක නොපෙන්වයි */}
        {!isAdmin && (
          <div style={{ 
            display: 'flex', 
            background: COLORS.bgPink50, 
            borderBottom: `1px solid ${COLORS.bgPink200}` 
          }}>
            <button 
              type="button" 
              onClick={() => setCurrentStep(1)} 
              style={{ 
                flex: 1, 
                padding: '16px', 
                border: 'none', 
                background: currentStep === 1 ? 'white' : 'transparent', 
                color: COLORS.textPink900, 
                fontWeight: '600', 
                cursor: 'pointer', 
                borderBottom: currentStep === 1 ? `3px solid ${COLORS.textPink600}` : '3px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              1. Basic Information
            </button>
            <button 
              type="button" 
              onClick={() => {
                if (validateCommonFields()) {
                  setCurrentStep(2);
                } else {
                  toast.error('Please fill Basic Information first');
                }
              }} 
              style={{ 
                flex: 1, 
                padding: '16px', 
                border: 'none', 
                background: currentStep === 2 ? 'white' : 'transparent', 
                color: currentStep === 2 ? COLORS.textPink900 : COLORS.textPink200, 
                fontWeight: '600', 
                cursor: currentStep === 2 ? 'pointer' : 'default',
                borderBottom: currentStep === 2 ? `3px solid ${COLORS.textPink600}` : '3px solid transparent',
                opacity: currentStep === 2 ? 1 : 0.5,
                transition: 'all 0.3s'
              }}
            >
              2. Professional Information <span style={{ fontSize: '10px', fontWeight: '400' }}>(Optional)</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px', background: 'white' }}>
            
            {/* STEP 1: Basic Information - All Users */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: COLORS.textPink900, 
                  marginBottom: '24px', 
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <User size={20} color={COLORS.textPink600} /> 
                  Basic Information
                  <span style={{ 
                    fontSize: '12px', 
                    background: COLORS.bgPink100, 
                    color: COLORS.textPink800, 
                    padding: '2px 10px', 
                    borderRadius: '20px',
                    marginLeft: '8px'
                  }}>
                    {selectedRole.toUpperCase()}
                  </span>
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={commonData.fullName} 
                      onChange={handleCommonChange} 
                      style={inputStyle('fullName')} 
                      placeholder="Enter full name"
                    />
                    {errors.fullName && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', textAlign: 'left' }}>{errors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={commonData.email} 
                      onChange={handleCommonChange} 
                      style={inputStyle('email')} 
                      placeholder="Enter email address"
                    />
                    {errors.email && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', textAlign: 'left' }}>{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label style={labelStyle}>NIC Number *</label>
                    <input 
                      type="text" 
                      name="nic" 
                      value={commonData.nic} 
                      onChange={handleCommonChange} 
                      style={inputStyle('nic')} 
                      placeholder="Enter NIC number"
                    />
                    {errors.nic && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', textAlign: 'left' }}>{errors.nic}</p>}
                  </div>
                  
                  <div>
                    <label style={labelStyle}>Account Status</label>
                    <select 
                      name="status" 
                      value={commonData.status} 
                      onChange={handleCommonChange} 
                      style={inputStyle('status')}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                  {isAdmin ? (
                    // ADMIN - Direct Save Button (Professional Info නැත)
                    <button 
                      type="submit" 
                      disabled={isLoading} 
                      style={{ 
                        padding: '12px 32px', 
                        background: COLORS.textPink600, 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: isLoading ? 'not-allowed' : 'pointer', 
                        fontWeight: '600',
                        opacity: isLoading ? 0.7 : 1,
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', marginRight: '8px', verticalAlign: 'middle' }} />
                          Saving Admin...
                        </>
                      ) : (
                        '💾 Save Admin Profile'
                      )}
                    </button>
                  ) : (
                    // OTHER ROLES - Next Button
                    <button 
                      type="button" 
                      onClick={handleNext} 
                      style={{ 
                        padding: '12px 32px', 
                        background: COLORS.textPink600, 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontWeight: '600',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Next Step →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Professional Information - Only for Non-Admin Users (Optional) */}
            {currentStep === 2 && !isAdmin && (
              <div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: COLORS.textPink900, 
                  marginBottom: '8px', 
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Briefcase size={20} color={COLORS.textPink600} /> 
                  Professional Information
                  <span style={{ 
                    fontSize: '12px', 
                    color: COLORS.textPink200,
                    fontWeight: '400',
                    marginLeft: '8px'
                  }}>
                    (Optional)
                  </span>
                </h2>
                <p style={{ 
                  fontSize: '13px', 
                  color: COLORS.textPink800, 
                  marginBottom: '24px',
                  opacity: 0.7
                }}>
                  You can skip this section if professional details are not available yet
                </p>
                
                {/* DOCTOR Fields - All Optional */}
                {selectedRole === 'doctor' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>License Number <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <input 
                        type="text" 
                        value={doctorData.licenseNumber} 
                        onChange={(e) => setDoctorData({...doctorData, licenseNumber: e.target.value})} 
                        style={inputStyle('licenseNumber')} 
                        placeholder="e.g., SLMC-12345"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Specialization <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <input 
                        type="text" 
                        value={doctorData.specialization} 
                        onChange={(e) => setDoctorData({...doctorData, specialization: e.target.value})} 
                        style={inputStyle('specialization')} 
                        placeholder="e.g., Obstetrics & Gynecology"
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Qualifications <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <textarea 
                        value={doctorData.qualifications} 
                        onChange={(e) => setDoctorData({...doctorData, qualifications: e.target.value})} 
                        rows="3" 
                        style={{ ...inputStyle('qualifications'), resize: 'vertical' }} 
                        placeholder="e.g., MBBS, MD, FRCOG"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Years of Experience <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <input 
                        type="number" 
                        value={doctorData.yearsOfExperience} 
                        onChange={(e) => setDoctorData({...doctorData, yearsOfExperience: e.target.value})} 
                        style={inputStyle('yearsOfExperience')} 
                        placeholder="Years of practice"
                      />
                    </div>
                  </div>
                )}

                {/* NURSE Fields - All Optional */}
                {selectedRole === 'nurse' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>License Number <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <input 
                        type="text" 
                        value={nurseData.licenseNumber} 
                        onChange={(e) => setNurseData({...nurseData, licenseNumber: e.target.value})} 
                        style={inputStyle('licenseNumber')} 
                        placeholder="e.g., SLNMC-N-4455"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Years of Experience <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <input 
                        type="number" 
                        value={nurseData.yearsOfExperience} 
                        onChange={(e) => setNurseData({...nurseData, yearsOfExperience: e.target.value})} 
                        style={inputStyle('yearsOfExperience')} 
                        placeholder="Years of experience"
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Qualifications <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <textarea 
                        value={nurseData.qualifications} 
                        onChange={(e) => setNurseData({...nurseData, qualifications: e.target.value})} 
                        rows="3" 
                        style={{ ...inputStyle('qualifications'), resize: 'vertical' }} 
                        placeholder="e.g., BSc in Nursing"
                      />
                    </div>
                  </div>
                )}

                {/* MIDWIFE Fields - All Optional */}
                {selectedRole === 'midwife' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>License Number <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <input 
                        type="text" 
                        value={midwifeData.licenseNumber} 
                        onChange={(e) => setMidwifeData({...midwifeData, licenseNumber: e.target.value})} 
                        style={inputStyle('licenseNumber')} 
                        placeholder="e.g., SLNMC-MW-9988"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Years of Experience <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <input 
                        type="number" 
                        value={midwifeData.yearsOfExperience} 
                        onChange={(e) => setMidwifeData({...midwifeData, yearsOfExperience: e.target.value})} 
                        style={inputStyle('yearsOfExperience')} 
                        placeholder="Years of midwifery experience"
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Qualifications <span style={{ color: '#9ca3af', fontSize: '11px' }}>(Optional)</span></label>
                      <textarea 
                        value={midwifeData.qualifications} 
                        onChange={(e) => setMidwifeData({...midwifeData, qualifications: e.target.value})} 
                        rows="3" 
                        style={{ ...inputStyle('qualifications'), resize: 'vertical' }} 
                        placeholder="e.g., Diploma in Nursing & Midwifery"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(1)} 
                    style={{ 
                      padding: '12px 24px', 
                      background: 'white', 
                      border: `2px solid ${COLORS.bgPink200}`, 
                      color: COLORS.textPink800, 
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
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    style={{ 
                      flex: 1, 
                      padding: '12px', 
                      background: COLORS.textPink600, 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      cursor: isLoading ? 'not-allowed' : 'pointer', 
                      fontWeight: '600',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', marginRight: '8px', verticalAlign: 'middle' }} />
                        Saving Changes...
                      </>
                    ) : (
                      '💾 Save Profile Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
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

export default EditUser;