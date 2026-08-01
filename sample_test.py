import json
from engine_dhs import STPEngine

# Sample Topology: 3 Switches in a Triangle Loop
# SW1 has the lowest priority (4096), so it should become the Root Bridge.
sample_topology = {
    "vlan_id": 1,
    "switches": [
        {
            "switch_id": "SW1",
            "bridge_priority": 4096,  # Root Bridge Candidate
            "mac_address": "0001.0000.0001",
            "interfaces": {
                "GigabitEthernet0/1": {
                    "name": "GigabitEthernet0/1",
                    "mac_address": "0001.0000.0011"
                },
                "GigabitEthernet0/2": {
                    "name": "GigabitEthernet0/2",
                    "mac_address": "0001.0000.0012"
                }
            }
        },
        {
            "switch_id": "SW2",
            "bridge_priority": 32768,
            "mac_address": "0002.0000.0002",
            "interfaces": {
                "GigabitEthernet0/1": {
                    "name": "GigabitEthernet0/1",
                    "mac_address": "0002.0000.0021"
                },
                "GigabitEthernet0/2": {
                    "name": "GigabitEthernet0/2",
                    "mac_address": "0002.0000.0022"
                }
            }
        },
        {
            "switch_id": "SW3",
            "bridge_priority": 32768,
            "mac_address": "0003.0000.0003",
            "interfaces": {
                "GigabitEthernet0/1": {
                    "name": "GigabitEthernet0/1",
                    "mac_address": "0003.0000.0031",
                    "is_edge": True,      # Edge port (PortFast)
                    "bpdu_guard": False    # Missing BPDU Guard (triggers HIGH risk)
                },
                "GigabitEthernet0/2": {
                    "name": "GigabitEthernet0/2",
                    "mac_address": "0003.0000.0032"
                }
            }
        }
    ],
    "links": [
        {
            "link_id": "L1",
            "switch_a": "SW1",
            "port_a": "GigabitEthernet0/1",
            "switch_b": "SW2",
            "port_b": "GigabitEthernet0/1",
            "bandwidth_mbps": 1000
        },
        {
            "link_id": "L2",
            "switch_a": "SW2",
            "port_a": "GigabitEthernet0/2",
            "switch_b": "SW3",
            "port_b": "GigabitEthernet0/2",
            "bandwidth_mbps": 1000
        },
        {
            "link_id": "L3",
            "switch_a": "SW3",
            "port_a": "GigabitEthernet0/2",
            "switch_b": "SW1",
            "port_b": "GigabitEthernet0/2",
            "bandwidth_mbps": 1000
        }
    ]
}

def run_test():
    print("--- Initializing Engine ---")
    engine = STPEngine(sample_topology)
    
    print("--- Running Simulation ---")
    result = engine.run_simulation()
    
    print("\n--- Simulation Output ---")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    run_test()
