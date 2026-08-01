from typing import Dict
import networkx as nx

from .models import SwitchModel
from .schemas import PortRole


class PortRolesEngine:
    @staticmethod
    def assign_roles(switches: Dict[str, SwitchModel], graph: nx.Graph, root_id: str):
        """
        Assigns ROOT, DESIGNATED, and ALTERNATE roles following 802.1D STP rules.
        """
        # 1. Root Switch Ports: All active ports on the Root Bridge are Designated
        if root_id in switches:
            for port in switches[root_id].ports.values():
                if port.connected_to_switch:
                    port.role = PortRole.DESIGNATED

        # 2. Select Root Ports on Non-Root Switches
        for sw_id, sw in switches.items():
            if sw.is_root:
                continue

            best_port = None
            best_vector = None  # (cost, neighbor_bid, neighbor_port_priority, port_name)

            for p_name, port in sw.ports.items():
                if not port.connected_to_switch:
                    continue

                neighbor = switches[port.connected_to_switch]
                total_cost = neighbor.root_path_cost + port.cost
                candidate_vector = (total_cost, neighbor.bridge_id, port.port_priority, port.name)

                if best_vector is None or candidate_vector < best_vector:
                    best_vector = candidate_vector
                    best_port = p_name

            if best_port:
                sw.ports[best_port].role = PortRole.ROOT
                sw.root_port_name = best_port

        # 3. Resolve Designated vs Alternate on Remaining Link Segments
        for u, v in graph.edges():
            edge_data = graph.get_edge_data(u, v)
            p_u_name = edge_data['ports'][u]
            p_v_name = edge_data['ports'][v]

            p_u = switches[u].ports[p_u_name]
            p_v = switches[v].ports[p_v_name]

            # Skip if both ports are already Root Ports
            if p_u.role == PortRole.ROOT and p_v.role == PortRole.ROOT:
                continue

            vec_u = (switches[u].root_path_cost, switches[u].bridge_id, p_u.port_priority)
            vec_v = (switches[v].root_path_cost, switches[v].bridge_id, p_v.port_priority)

            # Assign Designated to the switch with the superior (lower) vector
            if p_u.role != PortRole.ROOT and p_v.role != PortRole.ROOT:
                if vec_u < vec_v:
                    p_u.role = PortRole.DESIGNATED
                    p_v.role = PortRole.ALTERNATE
                else:
                    p_v.role = PortRole.DESIGNATED
                    p_u.role = PortRole.ALTERNATE
            elif p_u.role != PortRole.ROOT:
                p_u.role = PortRole.DESIGNATED if vec_u < vec_v else PortRole.ALTERNATE
            elif p_v.role != PortRole.ROOT:
                p_v.role = PortRole.DESIGNATED if vec_v < vec_u else PortRole.ALTERNATE
