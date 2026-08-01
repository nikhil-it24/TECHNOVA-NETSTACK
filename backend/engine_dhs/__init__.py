"""
STP Engine Package
------------------

A Python modular engine for parsing, simulating, and analyzing
Spanning Tree Protocol (802.1D / PVST) topologies, identifying L2 loop
vulnerabilities, and validating STP security guard configurations.
"""

from .stp_engine import STPEngine
from .schemas import NetworkTopologySchema, STPMode, PortRole, PortState
from .models import SwitchModel, PortModel

__all__ = [
    "STPEngine",
    "NetworkTopologySchema",
    "STPMode",
    "PortRole",
    "PortState",
    "SwitchModel",
    "PortModel",
]
