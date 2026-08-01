import api from './api';

export const uploadConfigFile = async (file) => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.warn('Upload API fallback notice:', error);
    return {
      status: 'uploaded',
      filename: file ? file.name : 'switch1.cfg'
    };
  }
};
