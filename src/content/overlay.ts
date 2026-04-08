const OVERLAY_ID = "anti-judi-shield-overlay";

export function showWarningOverlay(matchCount: number, score: number): void {
  if (document.getElementById(OVERLAY_ID)) return;

  // Create shadow DOM host
  const host = document.createElement("div");
  host.id = OVERLAY_ID;
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "closed" });

  shadow.innerHTML = `
    <style>
      .overlay {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 360px;
        background: #1e1e2e;
        border: 2px solid #ef4444;
        border-radius: 16px;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #fff;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        pointer-events: auto;
        animation: slideIn 0.3s ease-out;
      }
      @keyframes slideIn {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }
      .shield-icon {
        font-size: 28px;
      }
      .title {
        font-size: 16px;
        font-weight: 700;
        color: #ef4444;
      }
      .message {
        font-size: 13px;
        color: #a0a0b0;
        line-height: 1.5;
        margin-bottom: 16px;
      }
      .stats {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }
      .stat {
        flex: 1;
        background: #2a2a3e;
        border-radius: 8px;
        padding: 8px;
        text-align: center;
      }
      .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #ef4444;
      }
      .stat-label {
        font-size: 11px;
        color: #666;
      }
      .btn {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        background: #ef4444;
        color: #fff;
        transition: background 0.2s;
      }
      .btn:hover {
        background: #dc2626;
      }
    </style>
    <div class="overlay">
      <div class="header">
        <span class="shield-icon">🛡️</span>
        <span class="title">Konten Judi Terdeteksi!</span>
      </div>
      <div class="message">
        Halaman ini mengandung konten yang berkaitan dengan judi online.
        Beberapa elemen telah disamarkan untuk melindungimu.
      </div>
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${matchCount}</div>
          <div class="stat-label">Frasa Judi</div>
        </div>
        <div class="stat">
          <div class="stat-value">${score}</div>
          <div class="stat-label">Skor Risiko</div>
        </div>
      </div>
      <button class="btn" id="dismiss-btn">Saya Mengerti</button>
    </div>
  `;

  const dismissBtn = shadow.getElementById("dismiss-btn");
  dismissBtn?.addEventListener("click", () => {
    host.remove();
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    host.remove();
  }, 10000);
}

export function removeOverlay(): void {
  document.getElementById(OVERLAY_ID)?.remove();
}
