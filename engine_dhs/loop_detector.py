from typing import Dict, List, Any
import networkx as nx

from .models import SwitchModel
from .schemas import PortState


class LoopDetector:
    @staticmethod
    def detect_loops(switches: Dict[str, SwitchModel]) -> List[List[str]]:
        """
        Builds a forwarding subgraph and identifies active L2 network cycles.
        """
        active_graph = nx.Graph()

        for sw_id, sw in switches.items():
            active_graph.add_node(sw_id)
            for port in sw.ports.values():
                if port.state == PortState.FORWARDING and port.connected_to_switch:
                    target_sw = switches[port.connected_to_switch]
                    target_port = target_sw.ports[port.connected_to_port]

                    # Link carries traffic only if BOTH ends are FORWARDING
                    if target_port.state == PortState.FORWARDING:
                        active_graph.add_edge(sw_id, port.connected_to_switch)

        # Returns list of cycles, e.g., [['SW1', 'SW2', 'SW3']]
        return list(nx.cycle_basis(active_graph))

    @classmethod
    def simulate_misconfigurations(cls, switches: Dict[str, SwitchModel]) -> List[Dict[str, Any]]:
        """
        Simulates forcing BLOCKED ports into FORWARDING to identify loop vulnerabilities.
        """
        vulnerable_links = []

        for sw_id, sw in switches.items():
            for port_name, port in sw.ports.items():
                if port.state == PortState.BLOCKING:
                    # Force port state to FORWARDING
                    port.state = PortState.FORWARDING

                    # Test if cycle is formed
                    loops = cls.detect_loops(switches)
                    if loops:
                        vulnerable_links.append({
                            "switch": sw_id,
                            "port": port_name,
                            "connected_to": f"{port.connected_to_switch}:{port.connected_to_port}",
                            "caused_loops": loops
                        })

                    # Revert back to original state
                    port.state = PortState.BLOCKING

        return vulnerable_links
