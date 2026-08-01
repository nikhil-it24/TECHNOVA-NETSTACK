from typing import Dict, Any
from .schemas import NetworkTopologySchema
from .graph_builder import GraphBuilder
from .root_election import RootElection
from .shortest_paths import ShortestPaths
from .port_roles import PortRolesEngine
from .port_states import PortStatesEngine
from .loop_detector import LoopDetector
from .risk_engine import RiskEngine


class STPEngine:
    def __init__(self, topology_data: Dict[str, Any]):
        """
        Validates raw dictionary input against NetworkTopologySchema.
        """
        self.schema = NetworkTopologySchema(**topology_data)

    def run_simulation(self) -> Dict[str, Any]:
        """
        Runs the full STP simulation pipeline and returns structured results.
        """
        # 1. Construct Network Graph
        switches, graph = GraphBuilder.build_network(self.schema)

        # 2. Elect Root Bridge
        root_id = RootElection.elect_root(switches)

        # 3. Calculate Path Costs to Root Bridge
        ShortestPaths.calculate_path_costs(switches, graph, root_id)

        # 4. Assign Port Roles & Resolve Forwarding/Blocking States
        PortRolesEngine.assign_roles(switches, graph, root_id)
        PortStatesEngine.resolve_states(switches)

        # 5. Run Misconfiguration Simulation & Security Risk Audit
        loop_misconfigs = LoopDetector.simulate_misconfigurations(switches)
        risk_report = RiskEngine.audit_security_and_risks(switches, loop_misconfigs)

        # 6. Format Consolidated Simulation Output
        topology_summary = {}
        for sw_id, sw in switches.items():
            topology_summary[sw_id] = {
                "is_root": sw.is_root,
                "root_path_cost": sw.root_path_cost,
                "bridge_id": sw.bridge_id,
                "ports": {
                    p_name: {
                        "role": p.role.value,
                        "state": p.state.value,
                        "connected_to": (
                            f"{p.connected_to_switch}:{p.connected_to_port}" 
                            if p.connected_to_switch else None
                        ),
                        "bpdu_guard": p.bpdu_guard,
                        "root_guard": p.root_guard,
                        "loop_guard": p.loop_guard
                    }
                    for p_name, p in sw.ports.items()
                }
            }

        return {
            "root_bridge": root_id,
            "topology": topology_summary,
            "risk_report": risk_report
        }
