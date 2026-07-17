import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2, MapPin, Phone, Mail, Calendar, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClinic } from '../../services/clinicService';

const AddClinic = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinic_name: '',
    registration_no: '',
    address: '',
    city: '',
    district: '',
    province: '',
    phone: '',
    email: '',
    license_number: '',
    established_date: '',
    subscription_plan: 'basic',
    clinic_admin_email: '',
    clinic_admin_name: '',
    clinic_admin_password: ''
  });

  const [errors, setErrors] = useState({});

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clinic_name.trim()) newErrors.clinic_name = 'Clinic name is required';
    if (!formData.registration_no.trim()) newErrors.registration_no = 'Registration number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.province) newErrors.province = 'Province is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.clinic_admin_email.trim()) {
      newErrors.clinic_admin_email = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clinic_admin_email)) {
      newErrors.clinic_admin_email = 'Email is invalid';
    }
    if (!formData.clinic_admin_name.trim()) newErrors.clinic_admin_name = 'Admin name is required';
    if (!formData.clinic_admin_password) {
      newErrors.clinic_admin_password = 'Password is required';
    } else if (formData.clinic_admin_password.length < 6) {
      newErrors.clinic_admin_password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }
    
    setIsLoading(true);

    try {
      await createClinic({
        clinic_name: formData.clinic_name,
        registration_no: formData.registration_no,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        province: formData.province,
        phone: formData.phone,
        email: formData.email,
        status: 'active',
        clinic_admin_name: formData.clinic_admin_name,
        clinic_admin_email: formData.clinic_admin_email,
        clinic_admin_password: formData.clinic_admin_password,
      });
      toast.success('Clinic and admin account created successfully!');
      navigate('/super-admin/clinics');
    } catch (error) {
      toast.error(error.message || 'Failed to create clinic');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '0px', minHeight: '100vh' }}>
      <button
        onClick={() => navigate('/super-admin/clinics')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#831843', fontWeight: '500', transition: 'color 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#db2777'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#831843'}
      >
        <ArrowLeft size={18} /> Back to Clinics
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #fbcfe8', boxShadow: '0 20px 25px -5px rgba(131,24,67,0.05)' }}>
        <div style={{ background: 'linear-gradient(135deg, #db2777, #831843)', padding: '32px', color: 'white', textAlign: 'center' }}>
          <Building2 size={40} style={{ marginBottom: '16px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Register New Clinic</h1>
          <p style={{ opacity: 0.9 }}>Add a new clinic to the MaterniCare network</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#831843' }}>
            <Building2 size={18} color="#db2777" /> Clinic Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Clinic Name *</label>
              <input type="text" name="clinic_name" value={formData.clinic_name} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.clinic_name ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.clinic_name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.clinic_name}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Registration Number *</label>
              <input type="text" name="registration_no" value={formData.registration_no} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.registration_no ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.registration_no && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.registration_no}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.phone ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.phone && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.phone}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.email ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>License Number</label>
              <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Established Date</label>
              <input type="date" name="established_date" value={formData.established_date} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#831843' }}>
            <MapPin size={18} color="#db2777" /> Location Details
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Address *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" style={{ width: '100%', padding: '10px', border: `2px solid ${errors.address ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.address && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.address}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.city ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.city && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.city}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>District *</label>
              <select name="district" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.district ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none', background: 'white' }}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.district && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.district}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Province *</label>
              <select name="province" value={formData.province} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.province ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none', background: 'white' }}>
                <option value="">Select Province</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.province && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.province}</p>}
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#831843' }}>
            <UserPlus size={18} color="#db2777" /> Clinic Admin Account
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Admin Full Name *</label>
              <input type="text" name="clinic_admin_name" value={formData.clinic_admin_name} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.clinic_admin_name ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.clinic_admin_name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.clinic_admin_name}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Admin Email *</label>
              <input type="email" name="clinic_admin_email" value={formData.clinic_admin_email} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.clinic_admin_email ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.clinic_admin_email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.clinic_admin_email}</p>}
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Admin Password *</label>
              <input type="password" name="clinic_admin_password" value={formData.clinic_admin_password} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `2px solid ${errors.clinic_admin_password ? '#ef4444' : '#fbcfe8'}`, borderRadius: '10px', outline: 'none' }} />
              {errors.clinic_admin_password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.clinic_admin_password}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #db2777, #831843)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)' }}>
              {isLoading ? 'Creating...' : 'Create Clinic'}
            </button>
            <button type="button" onClick={() => navigate('/super-admin/clinics')} style={{ padding: '14px 24px', background: '#fce7f3', border: '1px solid #fbcfe8', borderRadius: '12px', cursor: 'pointer', color: '#db2777', fontWeight: '600' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClinic;