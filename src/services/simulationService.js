import api from './api';

export const runSimulation = async () => {
  try {
    const response = await api.post('/api/simulate');
    return response.data;
  } catch (error) {
    console.warn('Simulation API fallback notice:', error);
    return {
      status: 'waiting_for_stp_engine'
    };
  }
};
