import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Shield,
  Eye,
  EyeOff,
  Stethoscope,
  Baby,
  Users,
  Heart,
  GraduationCap,
  IdCard
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { createClinicUser } from '../../../services/userService';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const AddUser = () => {
  const navigate = useNavigate();
  const { currentClinic } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [currentStep, setCurrentStep] = useState(1);

  // Common fields for all users (Phone, Address, DOB removed)
  const [commonData, setCommonData] = useState({
    fullName: '',
    email: '',
    nic: '',
    password: '',
    confirmPassword: ''
  });

  // Patient fields (Removed - Patient registration removed from admin module)
  // const [patientData, setPatientData] = useState({...});

  // Doctor specific fields (All optional)
  const [doctorData, setDoctorData] = useState({
    licenseNumber: '',
    specialization: '',
    qualifications: '',
    yearsOfExperience: ''
  });

  // Nurse specific fields (All optional)
  const [nurseData, setNurseData] = useState({
    licenseNumber: '',
    qualifications: '',
    yearsOfExperience: ''
  });

  // Midwife specific fields (All optional)
  const [midwifeData, setMidwifeData] = useState({
    licenseNumber: '',
    qualifications: '',
    yearsOfExperience: ''
  });

  const [errors, setErrors] = useState({});

  // Roles - Patient removed
  const roles = [
    { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: '#10B981' },
    { id: 'nurse', label: 'Nurse', icon: Users, color: '#3B82F6' },
    { id: 'midwife', label: 'Midwife', icon: Baby, color: '#8B5CF6' },
  ];

  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNurseChange = (e) => {
    const { name, value } = e.target;
    setNurseData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMidwifeChange = (e) => {
    const { name, value } = e.target;
    setMidwifeData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateCommonFields = () => {
    const newErrors = {};
    
    // Mandatory: Full Name
    if (!commonData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    // Mandatory: Email
    if (!commonData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(commonData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Mandatory: NIC
    if (!commonData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (commonData.nic.length < 10) {
      newErrors.nic = 'Enter valid NIC';
    }
    
    // Mandatory: Password
    if (!commonData.password) {
      newErrors.password = 'Password is required';
    } else if (commonData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Mandatory: Confirm Password
    if (commonData.password !== commonData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Role-specific fields validation - NOT REQUIRED (optional)
  const validateRoleFields = () => {
    // Professional info is OPTIONAL - No validation needed
    return true;
  };

  const handleNext = () => {
    if (validateCommonFields()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCommonFields()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!currentClinic?.id) {
      toast.error('No clinic is linked to your account. Please sign in again.');
      return;
    }
    
    setIsLoading(true);

    const userData = {
      fullName: commonData.fullName,
      email: commonData.email,
      nic: commonData.nic,
      password: commonData.password,
      role: selectedRole,
      clinicKey: currentClinic.id,
      status: 'active',
      profileData: {},
    };

    if (selectedRole === 'doctor') {
      userData.profileData = {
        licenseNumber: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        qualifications: doctorData.qualifications,
        yearsOfExperience: doctorData.yearsOfExperience,
      };
    } else if (selectedRole === 'nurse') {
      userData.profileData = {
        licenseNumber: nurseData.licenseNumber,
        qualifications: nurseData.qualifications,
        yearsOfExperience: nurseData.yearsOfExperience,
      };
    } else if (selectedRole === 'midwife') {
      userData.profileData = {
        licenseNumber: midwifeData.licenseNumber,
        qualifications: midwifeData.qualifications,
        yearsOfExperience: midwifeData.yearsOfExperience,
      };
    }

    try {
      await createClinicUser(userData);
      toast.success(`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} registered successfully!`);
      navigate('/users');
    } catch (error) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${errors[fieldName] ? '#EF4444' : COLORS.bgPink200}`,
    borderRadius: '12px',
    fontSize: '14px',
    transition: 'all 0.3s',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    color: COLORS.textPink900
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
          transition: 'all 0.3s',
          marginBottom: '24px'
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
            Add New Staff Member
          </h1>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>
            Register a new staff member for {currentClinic?.clinic_name || 'your clinic'}
          </p>
        </div>

        {/* Role Selection Tabs - Patient removed */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '20px 32px 0',
          borderBottom: `1px solid ${COLORS.bgPink200}`,
          overflowX: 'auto',
          background: COLORS.bgPink50
        }}>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                setSelectedRole(role.id);
                setCurrentStep(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: selectedRole === role.id ? `linear-gradient(135deg, ${role.color}, ${role.color}dd)` : 'transparent',
                color: selectedRole === role.id ? 'white' : COLORS.textPink800,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              <role.icon size={16} />
              {role.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: COLORS.textPink900, 
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <User size={20} color={COLORS.textPink600} />
                  Basic Information <span style={{ fontSize: '12px', color: '#EF4444' }}>(All fields mandatory)</span>
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {/* Full Name - Mandatory */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>
                      <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Full Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={commonData.fullName} 
                      onChange={handleCommonChange} 
                      style={inputStyle('fullName')} 
                      placeholder="Enter full name"
                    />
                    {errors.fullName && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px' }}>{errors.fullName}</p>}
                  </div>

                  {/* Email - Mandatory */}
                  <div>
                    <label style={labelStyle}>
                      <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Email Address <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={commonData.email} 
                      onChange={handleCommonChange} 
                      style={inputStyle('email')} 
                      placeholder="Enter email address"
                    />
                    {errors.email && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
                  </div>

                  {/* NIC - Mandatory */}
                  <div>
                    <label style={labelStyle}>
                      <IdCard size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      NIC Number <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="nic" 
                      value={commonData.nic} 
                      onChange={handleCommonChange} 
                      style={inputStyle('nic')} 
                      placeholder="Enter NIC number"
                    />
                    {errors.nic && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px' }}>{errors.nic}</p>}
                  </div>
                </div>

                {/* Password Section */}
                <div style={{
                  background: COLORS.bgPink50,
                  borderRadius: '16px',
                  padding: '24px',
                  marginTop: '24px'
                }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: COLORS.textPink900,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Lock size={18} color={COLORS.textPink600} />
                    Security Credentials <span style={{ fontSize: '12px', color: '#EF4444' }}>(Mandatory)</span>
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Password <span style={{ color: '#EF4444' }}>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={commonData.password}
                          onChange={handleCommonChange}
                          style={inputStyle('password')}
                          placeholder="Min 6 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: COLORS.textPink200
                          }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px' }}>{errors.password}</p>}
                    </div>

                    <div>
                      <label style={labelStyle}>Confirm Password <span style={{ color: '#EF4444' }}>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={commonData.confirmPassword}
                          onChange={handleCommonChange}
                          style={inputStyle('confirmPassword')}
                          placeholder="Re-enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: COLORS.textPink200
                          }}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
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
                      fontSize: '15px',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Professional Information (Optional) */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: COLORS.textPink900, 
                  marginBottom: '8px',
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

                {/* Admin - No professional info */}
                {selectedRole === 'admin' && (
                  <div style={{
                    background: COLORS.bgPink50,
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    border: `1px solid ${COLORS.bgPink200}`
                  }}>
                    <p style={{ color: COLORS.textPink800, fontSize: '14px' }}>
                      ℹ️ Administrator accounts do not require professional information.
                    </p>
                    <p style={{ color: COLORS.textPink200, fontSize: '12px', marginTop: '4px' }}>
                      Admin users have full system access across the clinic.
                    </p>
                  </div>
                )}

                {/* Doctor Fields - All Optional */}
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

                {/* Nurse Fields - All Optional */}
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

                {/* Midwife Fields - All Optional */}
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
                    onClick={handleBack}
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
                        <span style={{ 
                          display: 'inline-block', 
                          width: '16px', 
                          height: '16px', 
                          border: '2px solid white', 
                          borderTopColor: 'transparent', 
                          borderRadius: '50%', 
                          animation: 'spin 0.6s linear infinite',
                          marginRight: '8px',
                          verticalAlign: 'middle'
                        }} />
                        Creating...
                      </>
                    ) : (
                      '💾 Create Staff Member'
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

export default AddUser;