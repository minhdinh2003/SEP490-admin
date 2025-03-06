import axiosInstance from '@/lib/axios-instance';

export interface SignUpParams {
  fullName: string;
  email: string;
  password: string;
}

export const signUpService = async (params: SignUpParams) => {
  const response = await axiosInstance.post('/api/auth/register', params);
  return response.data;
};
export const guestSignUpService = async (params: SignUpParams) => {
  const response = await axiosInstance.post('/api/auth/guestRegister', params);
  return response.data;
};

export interface SignInParams {
  email: string;
  password: string;
}

export const signInService = async (params: SignInParams) => {
  const response = await axiosInstance.post('/api/auth/login', params);
  return response.data;
};

export const signOutService = async () => {
  const response = await axiosInstance.post('/api/auth/logout');
  return response.data;
};

export const changePasswordService = async (data: any) => {
  const response = await axiosInstance.post('/api/auth/change-password', data);
  return response.data;
};

export const resetPasswordService = async (data: any) => {
  const response = await axiosInstance.post('/api/auth/resetPassword', data);
  return response.data;
};

export const forgotPasswordService = async (data: any) => {
  const response = await axiosInstance.post('/api/auth/forgotPassword', data);
  return response.data;
};

export const getCurrentUserService = async () => {
  const response = await axiosInstance.get('/api/user/currentUser');
  return response.data;
};
