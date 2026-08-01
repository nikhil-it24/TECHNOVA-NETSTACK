import api from './api';

export const fetchLoopRisk = async () => {
  try {
    const response = await api.get('/loop-risk');
    return response.data;
  } catch (error) {
    console.warn('Loop Risk API fallback notice:', error);
    return {
      risk: 0,
      status: 'waiting'
    };
  }
};

export const fetchAiRecommendation = async () => {
  try {
    const response = await api.get('/ai-recommendation');
    return response.data;
  } catch (error) {
    console.warn('AI Recommendation API fallback notice:', error);
    return {
      recommendation: 'Waiting for STP Engine'
    };
  }
};

export const fetchReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    console.warn('Reports API fallback notice:', error);
    return {
      status: 'No Reports'
    };
  }
};
