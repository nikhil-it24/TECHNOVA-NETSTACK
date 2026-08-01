import api from './api';

export const fetchTopology = async () => {
  try {
    const response = await api.get('/api/topology');
    return response.data;
  } catch (error) {
    console.warn('Topology API fallback notice:', error);
    return {
      nodes: [
        { id: "SW1", type: "switch", label: "SW-CORE-01", position: { x: 250, y: 50 } },
        { id: "SW2", type: "switch", label: "SW-DIST-01", position: { x: 100, y: 200 } },
        { id: "SW3", type: "switch", label: "SW-DIST-02", position: { x: 400, y: 200 } },
        { id: "SW4", type: "switch", label: "SW-ACC-01", position: { x: 100, y: 350 } }
      ],
      edges: [
        { id: "e1-2", source: "SW1", target: "SW2", type: "trunk", label: "Gi0/1" },
        { id: "e1-3", source: "SW1", target: "SW3", type: "trunk", label: "Gi0/2" },
        { id: "e2-3", source: "SW2", target: "SW3", type: "redundant_blocked", label: "Gi0/24" },
        { id: "e2-4", source: "SW2", target: "SW4", type: "access", label: "Gi0/3" }
      ]
    };
  }
};
