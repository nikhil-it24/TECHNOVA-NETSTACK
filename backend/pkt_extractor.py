import os
import sys
import json
import xmltodict
import yaml
import re

def extract_topology_from_file_content(content: str, filename: str) -> dict:
    """
    Parses XML, JSON, YAML, or Cisco IOS text/CFG configs into standardized topology dict schema.
    """
    ext = os.path.splitext(filename)[1].lower()

    # 1. JSON
    if ext == ".json":
        try:
            data = json.loads(content)
            if isinstance(data, dict) and "switches" in data:
                return data
        except Exception:
            pass

    # 2. YAML
    if ext in (".yaml", ".yml"):
        try:
            data = yaml.safe_load(content)
            if isinstance(data, dict) and "switches" in data:
                return data
        except Exception:
            pass

    # 3. XML (Packet Tracer XML or custom topology XML)
    if ext == ".xml" or "<topology" in content or "<devices" in content or "<network" in content:
        try:
            parsed = xmltodict.parse(content)
            switches = []
            links = []

            # Check if standard dict format inside XML
            if "topology" in parsed and "switches" in parsed["topology"]:
                sw_list = parsed["topology"]["switches"]
                if isinstance(sw_list, dict) and "switch" in sw_list:
                    sw_list = sw_list["switch"]
                if isinstance(sw_list, list):
                    switches = sw_list

            if switches:
                return {
                    "vlan_id": 1,
                    "switches": switches,
                    "links": parsed.get("topology", {}).get("links", [])
                }
        except Exception:
            pass

    # 4. Cisco IOS Running Config (.cfg / .txt)
    if "hostname" in content or "interface" in content or "spanning-tree" in content:
        hostnames = re.findall(r"hostname\s+([A-Za-z0-9_-]+)", content)
        if hostnames:
            switches = []
            for idx, host in enumerate(hostnames, start=1):
                switches.append({
                    "switch_id": host,
                    "bridge_priority": 4096 if idx == 1 else 32768,
                    "mac_address": f"00:11:22:33:44:0{idx}",
                    "interfaces": {
                        "Gi0/1": {"name": "Gi0/1", "cost": 4, "is_edge": False, "enabled": True},
                        "Gi0/2": {"name": "Gi0/2", "cost": 4, "is_edge": False, "enabled": True}
                    }
                })
            return {
                "vlan_id": 1,
                "switches": switches,
                "links": []
            }

    # Fallback to default topology dict
    return None

def parse_input_file(file_path: str) -> dict:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    extracted = extract_topology_from_file_content(content, file_path)
    if extracted:
        return extracted
    raise ValueError("Could not parse valid topology from file.")
