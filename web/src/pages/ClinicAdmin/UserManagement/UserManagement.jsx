import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, Users, UserCheck, Stethoscope, Baby, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { deleteClinicUser, getClinicUsers } from '../../../services/userService';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const UserManagement = () => {
  const navigate = useNavigate();
  const { currentClinic } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      if (!currentClinic?.id) {
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getClinicUsers({
          clinicId: currentClinic.id,
          includeAll: true,
        });

        setUsers((response || []).map((user) => ({
          id: user.id,
          name: user.fullName,
          role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown',
          email: user.email,
          phone: user.phoneNumber || 'N/A',
          status: user.status || 'active',
          lastLogin: user.lastLogin || 'N/A',
          clinic_id: user.clinicId,
        })));
      } catch (error) {
        console.error('Failed to load users', error);
        toast.error(error.message || 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentClinic]);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all'
      || (filterRole === 'pending' ? user.status === 'pending' : user.role.toLowerCase() === filterRole.toLowerCase());
    
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteClinicUser(id)
        .then(() => {
          setUsers(users.filter(user => user.id !== id));
          toast.success('User deleted successfully');
        })
        .catch((error) => {
          toast.error(error.message || 'Unable to delete user');
        });
    }
  };

  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'doctor': return '#10B981';
      case 'midwife': return '#8B5CF6';
      case 'nurse': return '#3B82F6';
      case 'admin': return '#EF4444';
      default: return COLORS.textPink600;
    }
  };

  const getRoleIcon = (role) => {
    switch(role.toLowerCase()) {
      case 'doctor': return <Stethoscope size={14} />;
      case 'midwife': return <Baby size={14} />;
      case 'nurse': return <Users size={14} />;
      case 'admin': return <Shield size={14} />;
      default: return <Users size={14} />;
    }
  };

  const getRoleBadgeStyle = (role) => {
    const color = getRoleColor(role);
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      background: `${color}15`,
      color: color,
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    };
  };

  // Stats - Staff only
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalDoctors = users.filter(u => u.role === 'Doctor').length;
  const totalNurses = users.filter(u => u.role === 'Nurse').length;
  const totalMidwives = users.filter(u => u.role === 'Midwife').length;
  const totalAdmins = users.filter(u => u.role === 'Admin').length;

  return (
    <div style={{ 
      padding: '24px', 
      background: `linear-gradient(135deg, ${COLORS.bgPink50} 0%, ${COLORS.bgPink100} 100%)`, 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '8px' }}>
          Staff Management
        </h1>
        <p style={{ color: COLORS.textPink800, fontSize: '14px' }}>
          Manage staff members for {currentClinic?.clinic_name || 'your clinic'}
          <span style={{ 
            display: 'inline-block', 
            marginLeft: '12px', 
            padding: '2px 10px', 
            background: COLORS.bgPink200, 
            borderRadius: '20px',
            fontSize: '11px',
            color: COLORS.textPink800
          }}>
            Patients managed by Midwives
          </span>
        </p>
      </div>

      {/* Stats Cards - Staff Only */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          border: `1px solid ${COLORS.bgPink200}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: `${COLORS.textPink600}15`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} color={COLORS.textPink600} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>{totalUsers}</div>
              <div style={{ fontSize: '12px', color: COLORS.textPink800 }}>Total Staff</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          border: `1px solid ${COLORS.bgPink200}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#10b98115',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCheck size={20} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{activeUsers}</div>
              <div style={{ fontSize: '12px', color: COLORS.textPink800 }}>Active Staff</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          border: `1px solid ${COLORS.bgPink200}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#10B98115',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Stethoscope size={20} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>{totalDoctors}</div>
              <div style={{ fontSize: '12px', color: COLORS.textPink800 }}>Doctors</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          border: `1px solid ${COLORS.bgPink200}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3B82F615',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>{totalNurses}</div>
              <div style={{ fontSize: '12px', color: COLORS.textPink800 }}>Nurses</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          border: `1px solid ${COLORS.bgPink200}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#8B5CF615',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Baby size={20} color="#8B5CF6" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B5CF6' }}>{totalMidwives}</div>
              <div style={{ fontSize: '12px', color: COLORS.textPink800 }}>Midwives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter and Add Button Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: COLORS.textPink200
              }} 
            />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: `1px solid ${COLORS.bgPink200}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.textPink600;
                e.target.style.boxShadow = `0 0 0 3px ${COLORS.bgPink200}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.bgPink200;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: '10px 16px',
              border: `1px solid ${COLORS.bgPink200}`,
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white',
              color: COLORS.textPink800,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = COLORS.textPink600;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = COLORS.bgPink200;
            }}
          >
            <option value="all">All Roles</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="midwife">Midwife</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>

        {/* Add User Button - Only for staff */}
        <button
          onClick={() => navigate('/users/add')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink800})`,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
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
          <Plus size={18} />
          Add New Staff
        </button>
      </div>

      {/* Users Table - Staff Only */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflowX: 'auto',
        border: `1px solid ${COLORS.bgPink200}`
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '800px'
        }}>
          <thead>
            <tr style={{
              background: COLORS.bgPink50,
              borderBottom: `1px solid ${COLORS.bgPink200}`
            }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>#</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>NAME</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>ROLE</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>EMAIL</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>PHONE</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>STATUS</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>LAST LOGIN</th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>ACTIONS</th>
             </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: COLORS.textPink800 }}>
                  Loading users from Supabase...
                </td>
              </tr>
            ) : currentUsers.map((user, index) => (
              <tr key={user.id} style={{
                borderBottom: `1px solid ${COLORS.bgPink100}`,
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = COLORS.bgPink50}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '16px', fontSize: '14px', color: COLORS.textPink800 }}>
                  {user.id}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: `linear-gradient(135deg, ${getRoleColor(user.role)}, ${getRoleColor(user.role)}cc)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: COLORS.textPink900, fontSize: '14px' }}>
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={getRoleBadgeStyle(user.role)}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: COLORS.textPink800 }}>
                  {user.email}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: COLORS.textPink800 }}>
                  {user.phone}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: user.status === 'active' ? '#10b981' : user.status === 'pending' ? '#f59e0b' : '#ef4444',
                    marginRight: '8px'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: user.status === 'active' ? '#10b981' : user.status === 'pending' ? '#f59e0b' : '#ef4444',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: COLORS.textPink800 }}>
                  {user.lastLogin}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      onClick={() => navigate(`/users/view/${user.id}`)}
                      style={{
                        padding: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#3b82f6',
                        borderRadius: '6px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      title="View User"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                      style={{
                        padding: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#f59e0b',
                        borderRadius: '6px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fffbeb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      title="Edit User"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      style={{
                        padding: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        borderRadius: '6px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: COLORS.textPink800
          }}>
            <Users size={48} color={COLORS.bgPink200} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPink900, marginBottom: '8px' }}>
              No staff members found
            </h3>
            <p style={{ fontSize: '14px', color: COLORS.textPink800 }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div style={{
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${COLORS.bgPink200}`,
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '14px', color: COLORS.textPink800 }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${COLORS.bgPink200}`,
                  background: 'white',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? COLORS.bgPink200 : COLORS.textPink800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    padding: '6px 12px',
                    border: currentPage === i + 1 ? 'none' : `1px solid ${COLORS.bgPink200}`,
                    background: currentPage === i + 1 ? COLORS.textPink600 : 'white',
                    color: currentPage === i + 1 ? 'white' : COLORS.textPink800,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: currentPage === i + 1 ? '600' : '400'
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${COLORS.bgPink200}`,
                  background: 'white',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? COLORS.bgPink200 : COLORS.textPink800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;