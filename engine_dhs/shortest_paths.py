from typing import Dict, List
import networkx as nx

from .models import SwitchModel


class ShortestPaths:
    @staticmethod
    def calculate_path_costs(switches: Dict[str, SwitchModel], graph: nx.Graph, root_id: str) -> Dict[str, List[str]]:
        """
        Calculates minimum cumulative path cost to Root Bridge for all switches 
        using Dijkstra's shortest path algorithm.
        """
        # Calculate shortest path weights (cumulative port costs)
        lengths = nx.single_source_dijkstra_path_length(graph, root_id)
        
        # Determine actual node path sequences
        paths = nx.single_source_dijkstra_path(graph, root_id)

        for sw_id, sw in switches.items():
            sw.root_path_cost = lengths[sw_id]

        return paths
