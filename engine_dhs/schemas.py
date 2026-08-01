from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel

class STPMode(str, Enum):
    PVST = "PVST"
    RPVST = "RPVST"
    MSTP = "MSTP"


# 1. Enums
class PortRole(str, Enum):
    ROOT = "ROOT"
    DESIGNATED = "DESIGNATED"
    ALTERNATE = "ALTERNATE"
    BACKUP = "BACKUP"
    DISABLED = "DISABLED"


class PortState(str, Enum):
    FORWARDING = "FORWARDING"
    BLOCKING = "BLOCKING"
    LEARNING = "LEARNING"
    LISTENING = "LISTENING"
    DISABLED = "DISABLED"


# 2. Interface Configuration (Child)
class InterfaceConfig(BaseModel):
    name: str
    mac_address: str
    port_priority: int = 128
    cost: Optional[int] = None
    is_edge: bool = False
    bpdu_guard: bool = False
    root_guard: bool = False
    loop_guard: bool = False
    enabled: bool = True


# 3. Switch Configuration (Child - must come BEFORE NetworkTopologySchema)
class SwitchConfig(BaseModel):
    switch_id: str
    bridge_priority: int = 32768
    mac_address: str
    interfaces: Dict[str, InterfaceConfig]


# 4. Link Model (Child)
class Link(BaseModel):
    link_id: str
    switch_a: str
    port_a: str
    switch_b: str
    port_b: str
    bandwidth_mbps: int = 1000


# 5. Network Topology Schema (Top-Level Parent Model)
class NetworkTopologySchema(BaseModel):
    vlan_id: int = 1
    switches: List[SwitchConfig]
    links: List[Link]


# Rebuild model to finalize field resolutions
NetworkTopologySchema.model_rebuild()
