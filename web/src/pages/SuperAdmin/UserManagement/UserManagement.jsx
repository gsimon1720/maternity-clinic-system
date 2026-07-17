import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight,
  Users, UserCheck, Stethoscope, Baby, Shield, Heart, Building2, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deleteClinicUser, getAllUsers } from '../../../services/userService';
import { getClinics } from '../../../services/clinicService';
import toast from 'react-hot-toast';

const getClinicId = (clinic) => clinic?.clinic_id ?? clinic?.id;

const PLUM = '#831843';
const PINK = '#db2777';

const formatRole = (role) => {
  if (!role) return 'Unknown';
  return role.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterClinic, setFilterClinic] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers({
        clinicId: filterClinic !== 'all' ? filterClinic : undefined,
        includeAll: true,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });

      setUsers((response || []).map((user) => ({
        id: user.id,
        name: user.fullName,
        role: user.role,
        roleLabel: formatRole(user.role),
        email: user.email,
        phone: user.phoneNumber || 'N/A',
        status: user.status || 'active',
        lastLogin: user.lastLogin || 'N/A',
        clinicId: user.clinicId,
        clinicName: user.clinicName || '—',
        clinicCity: user.clinicCity || '',
      })));
    } catch (error) {
      toast.error(error.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClinics()
      .then((data) => setClinics(data || []))
      .catch(() => setClinics([]));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [filterClinic, filterStatus]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roleLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.clinicName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === 'all' ||
      (filterRole === 'pending' ? user.status === 'pending' : user.role === filterRole);

    return matchesSearch && matchesRole;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteClinicUser(id)
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
          toast.success('User deleted successfully');
        })
        .catch((error) => toast.error(error.message || 'Unable to delete user'));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'doctor': return '#10B981';
      case 'midwife': return '#8B5CF6';
      case 'nurse': return '#3B82F6';
      case 'clinic_admin': return '#F59E0B';
      case 'patient': return PINK;
      case 'super_admin': return PLUM;
      default: return '#6b7280';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor': return <Stethoscope size={14} />;
      case 'midwife': return <Baby size={14} />;
      case 'nurse': return <Users size={14} />;
      case 'clinic_admin': return <Shield size={14} />;
      case 'patient': return <Heart size={14} />;
      default: return <Users size={14} />;
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    doctors: users.filter((u) => u.role === 'doctor').length,
    midwives: users.filter((u) => u.role === 'midwife').length,
    nurses: users.filter((u) => u.role === 'nurse').length,
    patients: users.filter((u) => u.role === 'patient').length,
    clinicAdmins: users.filter((u) => u.role === 'clinic_admin').length,
  };

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: PLUM, marginBottom: '8px' }}>
          User Management
        </h1>
        <p style={{ color: '#db2777', fontSize: '14px', fontWeight: '500' }}>
          Manage all users across every clinic in the MaterniCare network
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Users', value: stats.total, color: PLUM, icon: Users },
          { label: 'Active', value: stats.active, color: '#10b981', icon: UserCheck },
          { label: 'Doctors', value: stats.doctors, color: '#10B981', icon: Stethoscope },
          { label: 'Midwives', value: stats.midwives, color: '#8B5CF6', icon: Baby },
          { label: 'Nurses', value: stats.nurses, color: '#3B82F6', icon: Users },
          { label: 'Patients', value: stats.patients, color: PINK, icon: Heart },
          { label: 'Clinic Admins', value: stats.clinicAdmins, color: '#F59E0B', icon: Shield },
        ].map((stat) => (
          <div key={stat.label} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: `${stat.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#9d174d', fontWeight: '500' }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#db2777' }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '10px 12px 10px 40px', border: '2px solid #fbcfe8', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <select value={filterClinic} onChange={(e) => { setFilterClinic(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 16px', border: '2px solid #fbcfe8', borderRadius: '12px', fontSize: '14px', background: 'white', outline: 'none', color: '#831843', fontWeight: '500' }}>
            <option value="all">All Clinics</option>
            {clinics.map((clinic) => (
              <option key={getClinicId(clinic)} value={getClinicId(clinic)}>{clinic.clinic_name} ({clinic.city})</option>
            ))}
          </select>

          <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 16px', border: '2px solid #fbcfe8', borderRadius: '12px', fontSize: '14px', background: 'white', outline: 'none', color: '#831843', fontWeight: '500' }}>
            <option value="all">All Roles</option>
            <option value="clinic_admin">Clinic Admin</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="midwife">Midwife</option>
            <option value="patient">Patient</option>
            <option value="pending">Pending Approval</option>
          </select>

          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 16px', border: '2px solid #fbcfe8', borderRadius: '12px', fontSize: '14px', background: 'white', outline: 'none', color: '#831843', fontWeight: '500' }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button
          onClick={() => navigate('/super-admin/users/add')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: `linear-gradient(135deg, ${PINK}, #831843)`, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)' }}
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.02)' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9d174d', fontWeight: '500' }}>Loading users...</div>
        ) : currentUsers.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9d174d', fontWeight: '500' }}>No users found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fdf2f8', borderBottom: '1px solid #fbcfe8' }}>
                {['User', 'Role', 'Clinic', 'Contact', 'Status', 'Last Login', 'Actions'].map((header) => (
                  <th key={header} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#831843', textTransform: 'uppercase' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #fbcfe8' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '600', color: PLUM }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#9d174d' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: `${getRoleColor(user.role)}15`, color: getRoleColor(user.role), borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      {getRoleIcon(user.role)} {user.roleLabel}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#831843', fontWeight: '500' }}>
                      <Building2 size={14} color="#db2777" />
                      <span>{user.clinicName}</span>
                    </div>
                    {user.clinicCity && <div style={{ fontSize: '11px', color: '#9d174d', marginLeft: '20px' }}>{user.clinicCity}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#831843' }}>{user.phone}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: user.status === 'active' ? '#d1fae5' : user.status === 'pending' ? '#fef3c7' : '#fee2e2', color: user.status === 'active' ? '#10b981' : user.status === 'pending' ? '#d97706' : '#ef4444' }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#9d174d' }}>
                    {user.lastLogin !== 'N/A' ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => navigate(`/super-admin/users/view/${user.id}`)} style={{ padding: '6px', background: '#fce7f3', border: '1px solid #fbcfe8', borderRadius: '8px', cursor: 'pointer' }} title="View"><Eye size={16} color={PLUM} /></button>
                      <button onClick={() => navigate(`/super-admin/users/edit/${user.id}`)} style={{ padding: '6px', background: '#fbcfe8', border: '1px solid #fbcfe8', borderRadius: '8px', cursor: 'pointer' }} title="Edit"><Edit2 size={16} color={PINK} /></button>
                      {user.role !== 'super_admin' && (
                        <button onClick={() => handleDeleteUser(user.id, user.name)} style={{ padding: '6px', background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="Delete"><Trash2 size={16} color="#ef4444" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} style={{ padding: '8px 12px', border: '1px solid #fbcfe8', borderRadius: '8px', background: '#fce7f3', color: '#db2777', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '14px', color: '#831843', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} style={{ padding: '8px 12px', border: '1px solid #fbcfe8', borderRadius: '8px', background: '#fce7f3', color: '#db2777', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
