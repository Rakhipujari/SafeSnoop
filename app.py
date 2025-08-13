from flask import Flask, render_template, jsonify, request
import subprocess
import json
from datetime import datetime
import os
import time

app = Flask(__name__)

HISTORY_FILE = "scans/history.json"

def calculate_risk(signal, auth, ssid):
    risk_score = 0

    # 1. Open or weak encryption? → more risky
    if auth.lower() in ["open", "none"]:
        risk_score += 3
    elif "wep" in auth.lower():
        risk_score += 2

    # 2. Signal strength still matters
    if signal > 80:
        risk_score += 1
    elif signal < 40:
        risk_score -= 1

    # 3. Suspicious SSID name?
    risky_keywords = ["free", "public", "airport", "hotel", "wifi"]
    if any(word in ssid.lower() for word in risky_keywords):
        risk_score += 2

    # Final Decision
    if risk_score >= 5:
        return "High"
    elif risk_score >= 3:
        return "Medium"
    else:
        return "Low"





def scan_wifi():
    result = subprocess.check_output("netsh wlan show networks mode=bssid", shell=True).decode()
    networks = []
    current = {}

    for line in result.splitlines():
        line = line.strip()
        if line.startswith("SSID"):
            if current:
                networks.append(current)
            current = {"SSID": line.split(":", 1)[1].strip()}
        elif "Signal" in line:
            current["Signal"] = int(line.split(":")[1].replace("%", "").strip())
        elif "Authentication" in line:
            current["Auth"] = line.split(":", 1)[1].strip()

    if current:
        networks.append(current)

    # Add risk level based on multiple factors
    for net in networks:
        signal = net.get("Signal", 0)
        auth = net.get("Auth", "None")
        ssid = net.get("SSID", "")
        net["Risk"] = calculate_risk(signal, auth, ssid)

    return networks


def save_history(networks):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = {"timestamp": timestamp, "networks": networks}
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE) as f:
            data = json.load(f)
    else:
        data = []
    data.append(entry)
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=2)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/scan')
def scan():
    networks = scan_wifi()
    save_history(networks)
    return jsonify(networks)


@app.route('/history')
def history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE) as f:
            data = json.load(f)
    else:
        data = []
    return jsonify(data)

@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")  # Create a corresponding dashboard.html file



if __name__ == "__main__":
    app.run(debug=True)