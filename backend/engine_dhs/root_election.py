from typing import Dict
from .models import SwitchModel

class RootElection:
    @staticmethod
    def elect_root(switches: Dict[str, SwitchModel]) -> str:
        """
        Elects the Root Bridge using IEEE 802.1D tie-breaker logic:
        Lowest Bridge Priority -> Lowest MAC Address.
        """
        if not switches:
            raise ValueError("No switches found in topology.")

        # min() compares tuples: (priority, mac_address)
        root_switch = min(
            switches.values(),
            key=lambda s: (s.priority, s.mac_address.replace(":", "").replace(".", "").lower())
        )

        for s_id, sw in switches.items():
            sw.is_root = (s_id == root_switch.switch_id)
            if sw.is_root:
                sw.root_path_cost = 0

        return root_switch.switch_id
