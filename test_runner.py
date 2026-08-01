import yaml
import os
import sys

def run_test(yaml_file_path: str):
    if not os.path.exists(yaml_file_path):
        print(f"[!] Error: File '{yaml_file_path}' not found.")
        return

    print(f"[*] Loading YAML topology: {yaml_file_path}")
    with open(yaml_file_path, "r", encoding="utf-8") as f:
        topology_data = yaml.safe_load(f)

    print("[+] Successfully parsed YAML into Python dict.")
    print("[*] Feeding payload to engine_dhs...\n")

    try:
        import engine_dhs
        
        # Call the primary entry point in engine_dhs
        if hasattr(engine_dhs, 'process_topology'):
            engine_dhs.process_topology(topology_data)
        elif hasattr(engine_dhs, 'main'):
            engine_dhs.main(topology_data)
        else:
            print("[!] Imported engine_dhs successfully. Engine is ready.")

    except ImportError:
        print("[!] Error: 'engine_dhs' module not found in your Python environment or directory.")
    except Exception as e:
        print(f"[!] Engine Execution Error: {e}")

if __name__ == "__main__":
    target_yaml = sys.argv[1] if len(sys.argv) > 1 else "test_topology.yaml"
    run_test(target_yaml)
