/**
 * Validation Rules Schema
 * Defines validation rules for each endpoint
 */

const validationRules = {
  // Auth validation rules
  auth: {
    register: {
      name: { required: true, type: 'string', min: 2, max: 100 },
      email: { required: true, type: 'email' },
      password: { required: true, type: 'string', min: 6, max: 50 },
      phone: { required: false, type: 'string', pattern: /^[0-9]{10}$/ },
    },
    login: {
      email: { required: true, type: 'email' },
      password: { required: true, type: 'string', min: 6 },
    },
    forgotPassword: {
      email: { required: true, type: 'email' },
    },
    resetPassword: {
      resetToken: { required: true, type: 'string' },
      newPassword: { required: true, type: 'string', min: 6, max: 50 },
    },
    verifyEmail: {
      userId: { required: true, type: 'string' },
      verificationToken: { required: true, type: 'string' },
    },
  },
  // User validation rules
  user: {
    create: {
      name: { required: true, type: 'string', min: 2, max: 100 },
      email: { required: true, type: 'email' },
      phone: { required: false, type: 'string', pattern: /^[0-9]{10}$/ },
      status: { required: false, type: 'string', enum: ['active', 'inactive', 'banned'] },
    },
    update: {
      name: { required: false, type: 'string', min: 2, max: 100 },
      email: { required: false, type: 'email' },
      phone: { required: false, type: 'string', pattern: /^[0-9]{10}$/ },
      status: { required: false, type: 'string', enum: ['active', 'inactive', 'banned'] },
    },
    search: {
      query: { required: true, type: 'string', min: 1 },
      page: { required: false, type: 'number', min: 1 },
      limit: { required: false, type: 'number', min: 1, max: 100 },
    },
    changeStatus: {
      status: { required: true, type: 'string', enum: ['active', 'inactive', 'banned'] },
    },
  },
};

module.exports = validationRules;
