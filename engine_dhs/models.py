from dataclasses import dataclass, field
from typing import Dict, Optional
from .schemas import PortRole, PortState


@dataclass
class PortModel:
    name: str
    mac_address: str
    port_priority: int
    configured_cost: Optional[int]
    speed_mbps: int
    is_edge: bool
    bpdu_guard: bool
    root_guard: bool
    loop_guard: bool
    enabled: bool
    connected_to_switch: Optional[str] = None
    connected_to_port: Optional[str] = None
    
    # Dynamic Calculated STP States
    role: PortRole = PortRole.DISABLED
    state: PortState = PortState.DISABLED
    path_cost: int = 0

    @property
    def cost(self) -> int:
        """Determines interface STP path cost based on explicit config or IEEE speed defaults."""
        if self.configured_cost is not None:
            return self.configured_cost
        
        # Standard IEEE 802.1D / 802.1w Cost Table
        if self.speed_mbps >= 10000:  # 10 Gbps
            return 2
        if self.speed_mbps >= 1000:   # 1 Gbps
            return 4
        if self.speed_mbps >= 100:    # 100 Mbps
            return 19
        return 100                    # 10 Mbps


@dataclass
class SwitchModel:
    switch_id: str
    priority: int
    mac_address: str
    ports: Dict[str, PortModel] = field(default_factory=dict)
    
    # Dynamic Calculated Properties
    is_root: bool = False
    root_path_cost: int = 0
    root_port_name: Optional[str] = None

    @property
    def bridge_id(self) -> str:
        """
        Calculates the 8-byte Bridge Identifier string (Priority + MAC).
        Used for tie-breaking in Root election and Designated Port selection.
        """
        clean_mac = self.mac_address.replace(":", "").replace(".", "").lower()
        return f"{self.priority:04x}.{clean_mac}"
