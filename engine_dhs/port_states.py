from typing import Dict
from .models import SwitchModel
from .schemas import PortRole, PortState


class PortStatesEngine:
    @staticmethod
    def resolve_states(switches: Dict[str, SwitchModel]):
        """
        Maps assigned STP roles into physical forwarding/blocking operational states
        and enforces Root Guard policy checks.
        """
        for sw in switches.values():
            for port in sw.ports.values():
                # Disabled interfaces remain disabled
                if not port.enabled:
                    port.state = PortState.DISABLED
                    continue

                # Root Guard Violation: Block root-guard port if elected as Root Port
                if port.root_guard and port.role == PortRole.ROOT:
                    port.state = PortState.BLOCKING  # Root-inconsistent state
                    continue

                # Standard Role-to-State Mapping
                if port.role in [PortRole.ROOT, PortRole.DESIGNATED]:
                    port.state = PortState.FORWARDING
                elif port.role in [PortRole.ALTERNATE, PortRole.BACKUP]:
                    port.state = PortState.BLOCKING
                else:
                    port.state = PortState.DISABLED
