from typing import Dict, Tuple
import networkx as nx

from .schemas import NetworkTopologySchema
from .models import SwitchModel, PortModel

class GraphBuilder:
    @staticmethod
    def build_network(schema: NetworkTopologySchema) -> Tuple[Dict[str, SwitchModel], nx.Graph]:
        """
        Parses input schema, instantiates in-memory switch/port models,
        and constructs a NetworkX graph with weighted edges.
        """
        switches: Dict[str, SwitchModel] = {}
        graph = nx.Graph()

        # 1. Instantiate switches and ports
        for s in schema.switches:
            sw = SwitchModel(
                switch_id=s.switch_id,
                priority=s.bridge_priority,
                mac_address=s.mac_address
            )

            for p_name, p_cfg in s.interfaces.items():
                sw.ports[p_name] = PortModel(
                    name=p_cfg.name,
                    mac_address=p_cfg.mac_address,
                    port_priority=p_cfg.port_priority,
                    configured_cost=p_cfg.cost,
                    speed_mbps=1000,  # Default 1Gbps, updated via links below
                    is_edge=p_cfg.is_edge,
                    bpdu_guard=p_cfg.bpdu_guard,
                    root_guard=p_cfg.root_guard,
                    loop_guard=p_cfg.loop_guard,
                    enabled=p_cfg.enabled
                )

            switches[s.switch_id] = sw
            graph.add_node(s.switch_id)

        # 2. Wire point-to-point links and calculate edge weights
        for link in schema.links:
            sw_a = switches[link.switch_a]
            sw_b = switches[link.switch_b]
            port_a = sw_a.ports[link.port_a]
            port_b = sw_b.ports[link.port_b]

            # Cross link interface references and speeds
            port_a.connected_to_switch = link.switch_b
            port_a.connected_to_port = link.port_b
            port_a.speed_mbps = link.bandwidth_mbps

            port_b.connected_to_switch = link.switch_a
            port_b.connected_to_port = link.port_a
            port_b.speed_mbps = link.bandwidth_mbps

            # Edge weight uses interface STP path cost
            cost = port_a.cost
            graph.add_edge(
                link.switch_a,
                link.switch_b,
                weight=cost,
                ports={link.switch_a: link.port_a, link.switch_b: link.port_b}
            )

        return switches, graph
