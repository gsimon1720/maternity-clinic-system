import request from './api';

const normalizeRole = (role) => String(role || '').toLowerCase();

const mapUserToApiPayload = (userData) => {
  const {
    fullName,
    email,
    phoneNumber,
    nic,
    password,
    role,
    clinicId,
    clinicKey,
    clinic_id,
    status,
    ...rest
  } = userData;

  const profileData = { ...(rest.profileData || {}) };

  [
    'licenseNumber',
    'specialization',
    'qualifications',
    'yearsOfExperience',
    'emergencyName',
    'emergencyPhone',
    'emergencyRelation',
    'bloodGroup',
    'dateOfBirth',
    'address',
  ].forEach((field) => {
    if (rest[field] !== undefined && rest[field] !== '') {
      profileData[field] = rest[field];
    }
  });

  return {
    fullName,
    email,
    phoneNumber,
    nic,
    password,
    role: normalizeRole(role),
    clinicId: clinicId ?? clinic_id,
    clinicKey: clinicKey ?? clinicId ?? clinic_id,
    status: status || 'active',
    profileData,
  };
};

export const getClinicUsers = async ({ clinicId, search, status, roles, includeAll = false } = {}) => {
  const params = new URLSearchParams();

  if (clinicId !== undefined && clinicId !== null) params.set('clinicKey', clinicId);
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (roles && roles.length > 0) params.set('roles', roles.join(','));
  if (includeAll) params.set('includeAll', 'true');

  const query = params.toString();
  return request(`/users${query ? `?${query}` : ''}`);
};

export const getClinicUserById = async (id) => request(`/users/${id}`);

export const createClinicUser = async (userData) =>
  request('/users', {
    method: 'POST',
    body: JSON.stringify(mapUserToApiPayload(userData)),
  });

export const updateClinicUser = async (id, userData) =>
  request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mapUserToApiPayload(userData)),
  });

export const getAllUsers = async ({ clinicId, search, status, roles, includeAll = true } = {}) =>
  getClinicUsers({ clinicId, search, status, roles, includeAll });

export const deleteClinicUser = async (id) =>
  request(`/users/${id}`, {
    method: 'DELETE',
  });
