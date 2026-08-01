import os
import sys
import json
import xmltodict
import yaml

def parse_input_file(file_path: str) -> dict:
    """
    Reads XML, JSON, or YAML files and standardizes them into a Python dict.
    """
    ext = os.path.splitext(file_path)[1].lower()

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if ext == ".xml":
        print("[+] Parsing XML format...")
        return xmltodict.parse(content)
    elif ext in (".yaml", ".yml"):
        print("[+] Parsing YAML format...")
        return yaml.safe_load(content)
    elif ext == ".json":
        print("[+] Parsing JSON format...")
        return json.loads(content)
    else:
        raise ValueError(f"Unsupported file extension: '{ext}'")


def process_file_pipeline(input_path: str):
    if not os.path.exists(input_path):
        print(f"[!] Error: File '{input_path}' not found in current directory.")
        return

    base_name = os.path.splitext(input_path)[0]
    yaml_filename = f"{base_name}.yaml"
    json_filename = f"{base_name}.json"

    print("=" * 50)
    print(f"[*] Processing Pipeline for: {input_path}")
    print("=" * 50)

    try:
        # Step 1: Parse file (XML/YAML/JSON) into unified Python dict
        topology_dict = parse_input_file(input_path)

        # Step 2: Save a clean YAML representation for logging/debugging
        if not input_path.endswith(".yaml"):
            with open(yaml_filename, "w", encoding="utf-8") as yf:
                yaml.dump(topology_dict, yf, default_flow_style=False, sort_keys=False)
            print(f"[+] Step 1 Complete: Exported clean YAML -> {yaml_filename}")

        # Step 3: Feed payload directly into engine_dhs
        print("\n[+] Step 2: Feeding payload dictionary to engine_dhs...")
        import engine_dhs
        
        if hasattr(engine_dhs, 'process_topology'):
            engine_dhs.process_topology(topology_dict)
        elif hasattr(engine_dhs, 'main'):
            engine_dhs.main(topology_dict)
        else:
            print("[!] engine_dhs imported successfully. Topology dict ready for execution.")

        print("=" * 50)
        print("[✔] Pipeline Execution Completed Successfully!")
        print("=" * 50)

    except Exception as e:
        print(f"[!] Pipeline Error: {e}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        # Default target fallback
        target = "technova SM 26.xml" if os.path.exists("technova SM 26.xml") else "topology.yaml"

    process_file_pipeline(target)
