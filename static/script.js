function scanNetworks() {
  fetch("/scan")
    .then(res => res.json())
    .then(data => {
      const output = document.getElementById("output");
      output.innerHTML = "<h2>Networks Found</h2>";
      data.forEach((net, index) => {
        const div = document.createElement("div");
        div.className = "network";
        div.innerHTML = `<strong>📶 ${net.SSID}</strong><br>🔒 Auth: ${net.Auth} <br>📊 Signal: ${net.Signal}% <br>⚠ Risk: <b>${net.Risk}</b>`;
        div.onclick = () => {
          alert("Details:\n" + JSON.stringify(net, null, 2));
        };
        output.appendChild(div);
      });
      document.getElementById("riskChart").style.display = "none";
    });
}

function viewHistory() {
  fetch("/history")
    .then(res => res.json())
    .then(data => {
      const output = document.getElementById("output");
      output.innerHTML = "<h2>Scan History</h2>";
      data.forEach(entry => {
        const div = document.createElement("div");
        div.className = "network";
        div.innerHTML = `<strong>🕒 ${entry.timestamp}</strong><ul>${entry.networks.map(n => `<li>${n.SSID} - ${n.Risk}</li>`).join('')}</ul>`;
        output.appendChild(div);
      });
      document.getElementById("riskChart").style.display = "none";
    });
}

function showEducation() {
  const output = document.getElementById("output");
  document.getElementById("riskChart").style.display = "none";

  const questions = [
    {
      question: "What is an Evil Twin Access Point?",
      options: [
        "A friendly Wi-Fi",
        "A fake Wi-Fi that mimics a legit one",
        "A Wi-Fi with bad signal",
        "A secure network"
      ],
      answer: "A fake Wi-Fi that mimics a legit one"
    },
    {
      question: "Which attack is closely linked with Evil Twin APs?",
      options: [
        "Phishing",
        "Man-in-the-middle",
        "Brute Force",
        "DDoS"
      ],
      answer: "Man-in-the-middle"
    },
    {
      question: "What makes Evil Twin APs dangerous?",
      options: [
        "They look like legit Wi-Fi",
        "They slow down your internet",
        "They are hard to connect",
        "They don't work with mobile"
      ],
      answer: "They look like legit Wi-Fi"
    },
    {
      question: "How can you identify a possible rogue network?",
      options: [
        "It has strong signal",
        "It requires password",
        "Its name looks like a known network but with extra symbols",
        "It's on top of the list"
      ],
      answer: "Its name looks like a known network but with extra symbols"
    },
    {
      question: "Why is SafeSnoop useful?",
      options: [
        "It plays music",
        "It protects you from slow networks",
        "It helps detect fake Wi-Fi and prevent MITM attacks",
        "It boosts signal strength"
      ],
      answer: "It helps detect fake Wi-Fi and prevent MITM attacks"
    },
    {
      question: "What should you do when in a public place with multiple open Wi-Fi networks?",
      options: [
        "Connect to any network",
        "Use mobile hotspot",
        "Choose the strongest signal blindly",
        "Use a trusted network or VPN"
      ],
      answer: "Use a trusted network or VPN"
    },
    {
      question: "What is a Man-in-the-Middle (MITM) attack?",
      options: [
        "An attacker interrupts and reads data between two parties",
        "An attacker sends viruses to your system",
        "A type of brute-force attack",
        "An attack from multiple sources"
      ],
      answer: "An attacker interrupts and reads data between two parties"
    },
    {
      question: "How does SafeSnoop detect rogue APs?",
      options: [
        "By blocking unknown Wi-Fi",
        "By checking signal strength only",
        "By analyzing SSID, BSSID, signal strength, and channel overlap",
        "By disconnecting you from Wi-Fi"
      ],
      answer: "By analyzing SSID, BSSID, signal strength, and channel overlap"
    },
    {
      question: "Which one is NOT a good security practice?",
      options: [
        "Using VPN in public Wi-Fi",
        "Automatically connecting to known networks",
        "Checking for duplicate Wi-Fi names",
        "Avoiding login to sensitive accounts on public Wi-Fi"
      ],
      answer: "Automatically connecting to known networks"
    },
    {
      question: "Why should you avoid entering passwords on public open Wi-Fi?",
      options: [
        "It drains battery",
        "It’s hard to type in public",
        "Your credentials can be intercepted in MITM attacks",
        "It uses more data"
      ],
      answer: "Your credentials can be intercepted in MITM attacks"
    }
  ];

  let currentQ = 0;
  renderQuestion();

  function renderQuestion() {
    const q = questions[currentQ];
    let html = `
      <h2 style="text-align: center; margin-bottom: 20px;">🎓 SafeSnoop Education Mode</h2>
      <div style="max-width: 700px; margin: auto; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; font-weight: bold;">Q${currentQ + 1}. ${q.question}</p>
        <div id="options" style="margin-top: 15px;">`;

    q.options.forEach(opt => {
      html += `<button class="option-btn" data-answer="${opt}" style="margin: 10px 5px; padding: 10px 15px; background: #e0e0e0; border: none; border-radius: 6px; cursor: pointer;">${opt}</button>`;
    });

    html += `</div><div id="feedback" style="margin-top: 15px; font-size: 16px;"></div></div>`;
    output.innerHTML = html;

    document.querySelectorAll(".option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const selected = btn.getAttribute("data-answer");
        const correct = q.answer;
        const feedback = document.getElementById("feedback");

        document.querySelectorAll(".option-btn").forEach(b => {
          b.disabled = true;
          if (b.getAttribute("data-answer") === correct) {
            b.style.backgroundColor = "#28a745";
            b.style.color = "#fff";
          } else if (b.getAttribute("data-answer") === selected) {
            b.style.backgroundColor = "#dc3545";
            b.style.color = "#fff";
          }
        });

        if (selected === correct) {
          feedback.innerHTML = `<span style="color: #28a745; font-weight: bold;">✅ Correct!</span>`;
        } else {
          feedback.innerHTML = `<span style="color: #dc3545; font-weight: bold;">❌ Incorrect. Correct answer: "${correct}"</span>`;
        }

        if (currentQ < questions.length - 1) {
          feedback.innerHTML += `<br><br><button id="nextBtn" style="margin-top: 10px; padding: 8px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Next</button>`;
          document.getElementById("nextBtn").addEventListener("click", () => {
            currentQ++;
            renderQuestion();
          });
        } else {
          feedback.innerHTML += `<br><br><span style="font-weight:bold; color:#6a1b9a;">🎉 Quiz Completed! You’re now Wi-Fi Aware 🔐</span>`;
        }
      });
    });
  }
}

function showDashboard() {
  fetch("/history")
    .then(res => res.json())
    .then(data => {
      const output = document.getElementById("output");
      document.getElementById("riskChart").style.display = "none";

      let html = `
        <h2 style="text-align: center; font-size: 28px; margin-bottom: 30px; color: #333;">📊 Network Risk Levels</h2>
        <div style="display: flex; flex-direction: column; gap: 20px; max-width: 800px; margin: auto;">`;

      const riskLevels = {
        High: { value: 90, color: "#dc3545" },
        Medium: { value: 60, color: "#ffc107" },
        Low: { value: 30, color: "#28a745" }
      };

      data[data.length - 1]?.networks.forEach(net => {
        const risk = riskLevels[net.Risk] || { value: 10, color: "#ccc" };

        html += `
          <div style="background: #f9f9f9; border-radius: 10px; padding: 10px 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: bold;">📶 ${net.SSID}</span>
              <span style="color: ${risk.color}; font-weight: bold;">${net.Risk} Risk</span>
            </div>
            <div style="background: #e0e0e0; border-radius: 8px; height: 22px; overflow: hidden;">
              <div style="width: ${risk.value}%; background-color: ${risk.color}; height: 100%; transition: width 0.5s;"></div>
            </div>
          </div>`;
      });

      html += `</div>`;
      output.innerHTML = html;
    });
}
