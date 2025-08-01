import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getServices = async () => {
  try {
    console.log('Sending getServices request');
    const response = await axios.get(`${API_URL}/services`);
    console.log('getServices response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('getServices error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to fetch services' };
  }
};

export const getGallery = async () => {
  try {
    console.log('Sending getGallery request');
    const response = await axios.get(`${API_URL}/gallery`);
    console.log('getGallery response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('getGallery error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to fetch gallery' };
  }
};

export const getPricing = async () => {
  try {
    console.log('Sending getPricing request');
    const response = await axios.get(`${API_URL}/pricing`);
    console.log('getPricing response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('getPricing error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to fetch pricing' };
  }
};

export const submitContact = async (data) => {
  try {
    console.log('Sending submitContact request:', data);
    const response = await axios.post(`${API_URL}/contact`, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log('submitContact response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('submitContact error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to submit contact' };
  }
};

export const login = async (data) => {
  try {
    console.log('Sending login request:', data);
    const response = await axios.post(`${API_URL}/auth/login`, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log('login response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};

export const register = async (data) => {
  try {
    console.log('Sending register request:', data);
    const response = await axios.post(`${API_URL}/auth/register`, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log('register response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('register error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Registration failed' };
  }
};

export const verifyOtp = async (data) => {
  try {
    console.log('Sending verifyOtp request:', data);
    const response = await axios.post(`${API_URL}/auth/verify-otp`, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log('verifyOtp response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('verifyOtp error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
  }
};

export const addMenuItem = async (formData) => {
  try {
    console.log('Sending addMenuItem request with FormData');
    const response = await axios.post(`${API_URL}/menu/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    console.log('addMenuItem response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('addMenuItem error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to add item' };
  }
};

export const getMenuItems = async () => {
  try {
    console.log('Sending getMenuItems request');
    const response = await axios.get(`${API_URL}/menu/list`);
    console.log('getMenuItems response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('getMenuItems error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to fetch items' };
  }
};

export const updateMenuItem = async (id, formData) => {
  try {
    console.log('Sending updateMenuItem request with FormData for ID:', id);
    const response = await axios.put(`${API_URL}/menu/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    console.log('updateMenuItem response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('updateMenuItem error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to update item' };
  }
};

export const deleteMenuItem = async (id) => {
  try {
    console.log('Sending deleteMenuItem request for ID:', id);
    const response = await axios.delete(`${API_URL}/menu/delete/${id}`);
    console.log('deleteMenuItem response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('deleteMenuItem error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to delete item' };
  }
};

export const addDish = async (formData) => {
  try {
    console.log('Sending addDish request with FormData');
    const response = await axios.post(`${API_URL}/dishes/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    console.log('addDish response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('addDish error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to add dish' };
  }
};

export const getDishes = async () => {
  try {
    console.log('Sending getDishes request');
    const response = await axios.get(`${API_URL}/dishes`);
    console.log('getDishes response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('getDishes error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to fetch dishes' };
  }
};

export const updateDish = async (id, formData) => {
  try {
    console.log('Sending updateDish request with FormData for ID:', id);
    const response = await axios.put(`${API_URL}/dishes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    console.log('updateDish response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('updateDish error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to update dish' };
  }
};

export const deleteDish = async (id) => {
  try {
    console.log('Sending deleteDish request for ID:', id);
    const response = await axios.delete(`${API_URL}/dishes/${id}`);
    console.log('deleteDish response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('deleteDish error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to delete dish' };
  }
};

export const getCategories = async () => {
  try {
    console.log('Sending getCategories request');
    const response = await axios.get(`${API_URL}/categories`);
    console.log('getCategories response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('getCategories error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to fetch categories' };
  }
};

export const addCategory = async (formData) => {
  try {
    console.log('Sending addCategory request with FormData');
    const response = await axios.post(`${API_URL}/categories/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    console.log('addCategory response:', response.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('addCategory error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to add category' };
  }
};

export const deleteCategory = async (id) => {
  try {
    console.log('Sending deleteCategory request for ID:', id);
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    console.log('deleteCategory response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('deleteCategory error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.message || 'Failed to delete category' };
  }
};
export const addPoster = async (data) => {
  console.log('Sending addPoster request:', data);
  try {
    const response = await axios.post(`${API_URL}/posters/add`, data);
    console.log('addPoster response:', response.data);
    return response.data;
  } catch (error) {
    console.error('addPoster error:', error);
    return { success: false, message: error.message };
  }
};

export const getPosters = async () => {
  console.log('Sending getPosters request');
  try {
    const response = await axios.get(`${API_URL}/posters`);
    console.log('getPosters response:', response.data);
    return response.data;
  } catch (error) {
    console.error('getPosters error:', error);
    return { success: false, message: error.message };
  }
};

export const updatePoster = async (id, data) => {
  console.log('Sending updatePoster request for ID:', id);
  try {
    const response = await axios.put(`${API_URL}/posters/${id}`, data);
    console.log('updatePoster response:', response.data);
    return response.data;
  } catch (error) {
    console.error('updatePoster error:', error);
    return { success: false, message: error.message };
  }
};

export const deletePoster = async (id) => {
  console.log('Sending deletePoster request for ID:', id);
  try {
    const response = await axios.delete(`${API_URL}/posters/${id}`);
    console.log('deletePoster response:', response.data);
    return response.data;
  } catch (error) {
    console.error('deletePoster error:', error);
    return { success: false, message: error.message };
  }
};
export const addImage = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/images/add`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
};

export const getImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/images/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const deleteImage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/images/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getImagesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/images/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching images for category ${category}:`, error);
    throw error;
  }
};

export const getRandomImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/images/random`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random images:', error);
    throw error;
  }
};
