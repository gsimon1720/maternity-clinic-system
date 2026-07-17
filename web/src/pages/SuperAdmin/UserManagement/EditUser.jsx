import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClinicUserById, updateClinicUser } from '../../../services/userService';
import { getClinics } from '../../../services/clinicService';

const getClinicId = (clinic) => clinic?.clinic_id ?? clinic?.id;

const PLUM = '#831843';
const PINK = '#db2777';

const ROLES = [
  { id: 'patient', label: 'Patient' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'nurse', label: 'Nurse' },
  { id: 'midwife', label: 'Midwife' },
  { id: 'clinic_admin', label: 'Clinic Admin' },
];

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nic: '',
    phoneNumber: '',
    role: 'doctor',
    clinicId: '',
    status: 'active',
    licenseNumber: '',
    specialization: '',
    qualifications: '',
    yearsOfExperience: '',
  });

  useEffect(() => {
    Promise.all([getClinics(), getClinicUserById(id)])
      .then(([clinicList, userData]) => {
        setClinics(clinicList || []);
        const role = String(userData.role || 'doctor').toLowerCase();
        setIsSuperAdminUser(role === 'super_admin');
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          nic: userData.nic || '',
          phoneNumber: userData.phoneNumber || '',
          role,
          clinicId: userData.clinicId || '',
          status: userData.status || 'active',
          licenseNumber: userData.licenseNumber || '',
          specialization: userData.specialization || '',
          qualifications: userData.qualifications || '',
          yearsOfExperience: userData.yearsOfExperience || '',
        });
      })
      .catch((error) => {
        toast.error(error.message || 'Unable to load user');
        navigate('/super-admin/users');
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateClinicUser(id, {
        fullName: formData.fullName,
        email: formData.email,
        nic: formData.nic,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        clinicKey: formData.clinicId || undefined,
        status: formData.status,
        profileData: {
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization,
          qualifications: formData.qualifications,
          yearsOfExperience: formData.yearsOfExperience,
        },
      });
      toast.success('User updated successfully');
      navigate('/super-admin/users');
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #fbcfe8',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
  };

  if (isLoading) {
    return <div style={{ padding: '24px', color: '#831843', fontWeight: '500' }}>Loading user...</div>;
  }

  return (
    <div style={{ padding: '0px', minHeight: '100vh' }}>
      <button
        onClick={() => navigate('/super-admin/users')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#831843', fontWeight: '500', transition: 'color 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#db2777'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#831843'}
      >
        <ArrowLeft size={18} /> Back to Users
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #fbcfe8', boxShadow: '0 20px 25px -5px rgba(131,24,67,0.05)' }}>
        <div style={{ background: 'linear-gradient(135deg, #db2777, #831843)', padding: '32px', color: 'white', textAlign: 'center' }}>
          <User size={32} style={{ marginBottom: '12px', display: 'inline-block' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Edit User</h1>
          <p style={{ opacity: 0.85 }}>{formData.fullName}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {isSuperAdminUser && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#fef3c7', borderRadius: '12px', color: '#92400e', fontSize: '13px' }}>
              Super admin accounts can only update basic profile details. Role and clinic cannot be changed here.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#9d174d' }}>Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#9d174d' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#9d174d' }}>NIC</label>
              <input name="nic" value={formData.nic} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#9d174d' }}>Phone</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} />
            </div>
            {!isSuperAdminUser && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#9d174d' }}>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} style={{ ...inputStyle, background: 'white' }}>
                    {ROLES.map((role) => (
                      <option key={role.id} value={role.id}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#9d174d' }}>Clinic</label>
                  <select name="clinicId" value={formData.clinicId} onChange={handleChange} style={{ ...inputStyle, background: 'white' }}>
                    <option value="">No clinic</option>
                    {clinics.map((clinic) => (
                      <option key={getClinicId(clinic)} value={getClinicId(clinic)}>{clinic.clinic_name} — {clinic.city}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#9d174d' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ ...inputStyle, background: 'white' }}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {['doctor', 'nurse', 'midwife'].includes(formData.role) && (
            <>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: PLUM }}>Professional Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <input name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} style={inputStyle} />
                <input name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} style={inputStyle} />
                <input name="qualifications" placeholder="Qualifications" value={formData.qualifications} onChange={handleChange} style={inputStyle} />
                <input name="yearsOfExperience" placeholder="Years of Experience" value={formData.yearsOfExperience} onChange={handleChange} style={inputStyle} />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="submit" disabled={isSaving} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 24px', background: 'linear-gradient(135deg, #db2777, #831843)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)' }}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/super-admin/users')} style={{ padding: '14px 24px', background: '#fce7f3', border: '1px solid #fbcfe8', borderRadius: '12px', cursor: 'pointer', color: '#db2777', fontWeight: '600' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
