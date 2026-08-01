from typing import Dict, List, Any
from .models import SwitchModel
from .schemas import PortRole


class RiskEngine:
    @staticmethod
    def audit_security_and_risks(
        switches: Dict[str, SwitchModel], 
        loop_risks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Audits switch port configurations against security best practices 
        and formats loop vulnerability findings.
        """
        findings = []

        # 1. Configuration Audits
        for sw_id, sw in switches.items():
            for p_name, port in sw.ports.items():
                # Risk 1: PortFast / Edge port without BPDU Guard
                if port.is_edge and not port.bpdu_guard:
                    findings.append({
                        "severity": "HIGH",
                        "switch": sw_id,
                        "port": p_name,
                        "issue": "BPDU Guard Missing on Edge Port",
                        "description": (
                            f"Port {p_name} on {sw_id} has PortFast/Edge enabled without BPDU Guard. "
                            "Connecting an unauthorized switch could trigger STP topology recalculations."
                        )
                    })

                # Risk 2: Alternate Port without Loop Guard
                if not port.is_edge and port.connected_to_switch:
                    if not port.loop_guard and port.role == PortRole.ALTERNATE:
                        findings.append({
                            "severity": "MEDIUM",
                            "switch": sw_id,
                            "port": p_name,
                            "issue": "Loop Guard Missing on Alternate Port",
                            "description": (
                                f"Alternate port {p_name} on {sw_id} lacks Loop Guard. "
                                "Unidirectional link failures could cause this port to transition to Forwarding."
                            )
                        })

        # 2. Critical Loop Vulnerabilities
        for risk in loop_risks:
            findings.append({
                "severity": "CRITICAL",
                "switch": risk["switch"],
                "port": risk["port"],
                "issue": "Potential L2 Loop Scenario",
                "description": (
                    f"Forcing port {risk['port']} on {risk['switch']} into Forwarding state "
                    f"creates an active Layer 2 loop across path: {risk['caused_loops']}"
                )
            })

        return findings
