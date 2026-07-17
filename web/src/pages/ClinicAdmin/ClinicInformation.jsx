import React, { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Edit2,
  Save,
  X,
  Heart,
  Stethoscope,
  Ambulance,
  Globe,
  Calendar,
  Users,
  Printer,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { updateClinic } from '../../services/clinicService';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const ClinicInformation = () => {
  const { currentClinic, user, refreshSession } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clinicInfo, setClinicInfo] = useState({
    name: '',
    legalName: '',
    registrationNo: '',
    establishedYear: '',
    email: '',
    phone: '',
    mobile: '',
    fax: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka',
    workingDays: 'Monday - Saturday',
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
    sundayHours: 'Emergency Only',
    emergencyService: '24/7 Emergency Available',
    description: '',
    mission: '',
    vision: '',
  });

  const [originalInfo, setOriginalInfo] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (!currentClinic) return;

    const mapped = {
      name: currentClinic.clinic_name || '',
      legalName: currentClinic.clinic_name || '',
      registrationNo: currentClinic.registration_no || '',
      establishedYear: currentClinic.created_at ? new Date(currentClinic.created_at).getFullYear().toString() : '',
      email: currentClinic.email || user?.email || '',
      phone: currentClinic.phone || '',
      mobile: currentClinic.phone || '',
      fax: '',
      website: '',
      address: currentClinic.address || '',
      city: currentClinic.city || '',
      state: currentClinic.province || '',
      zipCode: '',
      country: 'Sri Lanka',
      workingDays: currentClinic.workingDays || 'Monday - Saturday',
      openingTime: currentClinic.openingTime || '08:00 AM',
      closingTime: currentClinic.closingTime || '08:00 PM',
      sundayHours: currentClinic.sundayHours || 'Emergency Only',
      emergencyService: currentClinic.emergencyService || '24/7 Emergency Available',
      description: currentClinic.description || `${currentClinic.clinic_name} maternity clinic in ${currentClinic.city || 'Sri Lanka'}.`,
      mission: currentClinic.mission || 'To provide compassionate, high-quality maternity care.',
      vision: currentClinic.vision || 'To be the most trusted maternity healthcare provider in the region.',
    };

    setClinicInfo(mapped);
    setOriginalInfo(mapped);
  }, [currentClinic, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentClinic?.id) {
      toast.error('Clinic information is not available');
      return;
    }

    setIsLoading(true);
    try {
      await updateClinic(currentClinic.id, {
        clinic_name: clinicInfo.name,
        registration_no: clinicInfo.registrationNo,
        address: clinicInfo.address,
        city: clinicInfo.city,
        province: clinicInfo.state,
        phone: clinicInfo.phone || clinicInfo.mobile,
        email: clinicInfo.email,
        clinicData: {
          legalName: clinicInfo.legalName,
          establishedYear: clinicInfo.establishedYear,
          website: clinicInfo.website,
          fax: clinicInfo.fax,
          workingDays: clinicInfo.workingDays,
          openingTime: clinicInfo.openingTime,
          closingTime: clinicInfo.closingTime,
          sundayHours: clinicInfo.sundayHours,
          emergencyService: clinicInfo.emergencyService,
          description: clinicInfo.description,
          mission: clinicInfo.mission,
          vision: clinicInfo.vision,
        },
      });
      await refreshSession();
      setOriginalInfo(clinicInfo);
      setIsEditing(false);
      toast.success('Clinic information updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update clinic information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setClinicInfo(originalInfo);
    setIsEditing(false);
    toast.info('Changes discarded');
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Building2 },
    { id: 'contact', label: 'Contact & Address', icon: MapPin },
    { id: 'hours', label: 'Working Hours', icon: Clock },
    { id: 'about', label: 'About Us', icon: Heart },
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink900})`,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={24} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textPink900 }}>
                  Clinic Information
                </h1>
                <p style={{ color: COLORS.textPink800, fontSize: '14px', marginTop: '4px' }}>
                  Manage and update your clinic details
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
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
                Edit Information
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

      {/* Content based on active tab */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              Basic Information
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Clinic Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={clinicInfo.name}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.name}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Legal Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="legalName"
                    value={clinicInfo.legalName}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.legalName}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Registration Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="registrationNo"
                    value={clinicInfo.registrationNo}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.registrationNo}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Established Year
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="establishedYear"
                    value={clinicInfo.establishedYear}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.establishedYear}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact & Address Tab */}
        {activeTab === 'contact' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              Contact Information
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} color={COLORS.textPink600} /> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={clinicInfo.email}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.email}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} color={COLORS.textPink600} /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={clinicInfo.phone}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.phone}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="mobile"
                    value={clinicInfo.mobile}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.mobile}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Fax Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fax"
                    value={clinicInfo.fax}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.fax}</p>
                )}
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px', marginTop: '32px' }}>
              Address
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Street Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={clinicInfo.address}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.address}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={clinicInfo.city}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.city}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  State/Province
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={clinicInfo.state}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.state}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  ZIP Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="zipCode"
                    value={clinicInfo.zipCode}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.zipCode}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={clinicInfo.country}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.country}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Working Hours Tab */}
        {activeTab === 'hours' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              Operating Hours
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Working Days
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="workingDays"
                    value={clinicInfo.workingDays}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.workingDays}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Opening Time
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="openingTime"
                    value={clinicInfo.openingTime}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.openingTime}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Closing Time
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="closingTime"
                    value={clinicInfo.closingTime}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.closingTime}</p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                  Sunday Hours
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="sundayHours"
                    value={clinicInfo.sundayHours}
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
                  <p style={{ fontSize: '16px', color: COLORS.textPink900 }}>{clinicInfo.sundayHours}</p>
                )}
              </div>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', background: '#FEE2E2', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Ambulance size={24} color="#EF4444" />
                <div>
                  <strong style={{ color: '#991B1B' }}>Emergency Service</strong>
                  <p style={{ color: '#7F1D1D', fontSize: '14px', marginTop: '4px' }}>{clinicInfo.emergencyService}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Us Tab */}
        {activeTab === 'about' && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.bgPink200}`
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '24px' }}>
              About MaterniCare
            </h2>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                Description
              </label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={clinicInfo.description}
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
                <p style={{ fontSize: '15px', color: COLORS.textPink800, lineHeight: '1.6' }}>{clinicInfo.description}</p>
              )}
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                Mission
              </label>
              {isEditing ? (
                <textarea
                  name="mission"
                  value={clinicInfo.mission}
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
                <p style={{ fontSize: '15px', color: COLORS.textPink800, lineHeight: '1.6' }}>{clinicInfo.mission}</p>
              )}
            </div>
            
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.textPink800, marginBottom: '8px', display: 'block' }}>
                Vision
              </label>
              {isEditing ? (
                <textarea
                  name="vision"
                  value={clinicInfo.vision}
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
                <p style={{ fontSize: '15px', color: COLORS.textPink800, lineHeight: '1.6' }}>{clinicInfo.vision}</p>
              )}
            </div>
          </div>
        )}
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

export default ClinicInformation;