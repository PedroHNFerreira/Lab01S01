/**
 * admin.js — Painel Administrativo do Portfólio
 * Usa Supabase Auth (CDN) para autenticação e chama a Portfolio API para dados.
 */

const API_URL = "https://portfolio-api-production.up.railway.app";
const SUPABASE_URL = "https://SEU_PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "sua_anon_key_aqui";

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let jwtToken = null;
let currentTokenId = null; // token recém-criado

// ─── Utils ────────────────────────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function roleLabel(role) {
  return role === "contractor" ? "Contratante" : "Parceiro";
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
      ...(opts.headers || {}),
    },
  });
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");
  const btn = e.target.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = "Entrando...";
  errEl.textContent = "";

  const { data, error } = await sb.auth.signInWithPassword({ email, password });

  if (error) {
    errEl.textContent = "E-mail ou senha inválidos.";
    btn.disabled = false;
    btn.textContent = "Entrar";
    return;
  }

  jwtToken = data.session.access_token;
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "flex";
  lucide.createIcons();
  loadTab("tokens");
  loadRequestsBadge();
});

document.getElementById("btn-logout").addEventListener("click", async () => {
  await sb.auth.signOut();
  jwtToken = null;
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
});

// ─── Tabs ─────────────────────────────────────────────────────────────────────

document.querySelectorAll(".nav-item[data-tab]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    const tabEl = document.getElementById(`tab-${btn.dataset.tab}`);
    if (tabEl) tabEl.classList.add("active");
    loadTab(btn.dataset.tab);
    lucide.createIcons();
  });
});

function loadTab(tab) {
  if (tab === "tokens") loadTokens();
  if (tab === "requests") loadRequests("false");
  if (tab === "logs") loadLogs();
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

document.getElementById("btn-new-token").addEventListener("click", () => {
  document.getElementById("new-token-form").style.display = "block";
  document.getElementById("token-result").style.display = "none";
});
document.getElementById("btn-cancel-token").addEventListener("click", () => {
  document.getElementById("new-token-form").style.display = "none";
});

document.getElementById("btn-create-token").addEventListener("click", async () => {
  const role = document.getElementById("token-role").value;
  const label = document.getElementById("token-label").value.trim() || null;
  const expires_at = document.getElementById("token-expires").value || null;

  const data = await apiFetch("/api/admin/tokens", {
    method: "POST",
    body: JSON.stringify({ role, label, expires_at }),
  });

  if (data.token) {
    currentTokenId = data.token.id;
    document.getElementById("new-token-form").style.display = "none";
    document.getElementById("token-result").style.display = "block";
    document.getElementById("token-link-input").value = data.accessLink;
    lucide.createIcons();
    loadTokens();
  }
});

document.getElementById("btn-copy-link").addEventListener("click", () => {
  const input = document.getElementById("token-link-input");
  input.select();
  navigator.clipboard.writeText(input.value);
  document.getElementById("btn-copy-link").textContent = "Copiado!";
  setTimeout(() => {
    document.getElementById("btn-copy-link").innerHTML = '<i data-lucide="copy"></i> Copiar';
    lucide.createIcons();
  }, 2000);
});

document.getElementById("btn-send-email").addEventListener("click", async () => {
  const recipientEmail = document.getElementById("send-email").value.trim();
  const recipientName = document.getElementById("send-name").value.trim() || null;

  if (!recipientEmail) { alert("Informe o e-mail do destinatário."); return; }

  const data = await apiFetch("/api/admin/tokens/send-link", {
    method: "POST",
    body: JSON.stringify({ tokenId: currentTokenId, recipientEmail, recipientName }),
  });

  if (data.success) {
    alert("E-mail enviado com sucesso!");
    document.getElementById("token-result").style.display = "none";
  }
});

async function loadTokens() {
  const tbody = document.getElementById("tokens-tbody");
  const table = document.getElementById("tokens-table");
  document.getElementById("tokens-loading").style.display = "block";
  table.style.display = "none";

  const data = await apiFetch("/api/admin/tokens");
  document.getElementById("tokens-loading").style.display = "none";

  if (!Array.isArray(data)) return;

  tbody.innerHTML = data.map((t) => {
    const isActive = !t.revoked && (!t.expires_at || new Date(t.expires_at) > new Date());
    const statusHtml = isActive
      ? '<span class="badge badge-green">Ativo</span>'
      : '<span class="badge badge-red">Inativo</span>';

    return `
      <tr>
        <td>${t.label || "<em>sem identificação</em>"}</td>
        <td><span class="badge badge-blue">${roleLabel(t.role)}</span></td>
        <td>${fmt(t.created_at)}</td>
        <td>${fmt(t.expires_at)}</td>
        <td>${statusHtml}</td>
        <td>
          ${isActive ? `<button class="btn-icon btn-revoke" data-id="${t.id}" title="Revogar">
            <i data-lucide="ban"></i>
          </button>` : ""}
        </td>
      </tr>`;
  }).join("");

  table.style.display = "table";
  lucide.createIcons();

  document.querySelectorAll(".btn-revoke").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Revogar este token? O link deixará de funcionar.")) return;
      await apiFetch(`/api/admin/tokens/${btn.dataset.id}`, { method: "DELETE" });
      loadTokens();
    });
  });
}

// ─── Solicitações ─────────────────────────────────────────────────────────────

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadRequests(btn.dataset.filter);
  });
});

async function loadRequestsBadge() {
  const data = await apiFetch("/api/admin/requests?reviewed=false");
  if (Array.isArray(data) && data.length > 0) {
    const badge = document.getElementById("requests-badge");
    badge.textContent = data.length;
    badge.style.display = "inline";
  }
}

async function loadRequests(reviewedFilter) {
  const listEl = document.getElementById("requests-list");
  document.getElementById("requests-loading").style.display = "block";
  listEl.innerHTML = "";

  const qs = reviewedFilter !== "" ? `?reviewed=${reviewedFilter}` : "";
  const data = await apiFetch(`/api/admin/requests${qs}`);
  document.getElementById("requests-loading").style.display = "none";

  if (!Array.isArray(data) || data.length === 0) {
    listEl.innerHTML = "<p class='empty-msg'>Nenhuma solicitação encontrada.</p>";
    return;
  }

  listEl.innerHTML = data.map((r) => `
    <div class="request-card ${r.reviewed ? "reviewed" : ""}">
      <div class="request-info">
        <h4>${r.name} <span class="text-muted">— ${r.organization}</span></h4>
        <a href="${r.linkedin}" target="_blank" class="link-blue">${r.linkedin}</a>
        <p class="purpose">${r.purpose}</p>
        <small class="text-muted">${fmt(r.created_at)}</small>
      </div>
      <div class="request-actions">
        ${!r.reviewed ? `<button class="btn btn-primary btn-sm btn-review" data-id="${r.id}">
          <i data-lucide="check"></i> Marcar como revisado
        </button>` : `<span class="badge badge-green">Revisado</span>`}
      </div>
    </div>
  `).join("");

  lucide.createIcons();

  document.querySelectorAll(".btn-review").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await apiFetch(`/api/admin/requests/${btn.dataset.id}/review`, { method: "PATCH" });
      loadRequests(reviewedFilter);
      loadRequestsBadge();
    });
  });
}

// ─── Telemetria ───────────────────────────────────────────────────────────────

async function loadLogs() {
  document.getElementById("logs-loading").style.display = "block";
  document.getElementById("logs-table").style.display = "none";

  const [summary, logs] = await Promise.all([
    apiFetch("/api/admin/logs/summary"),
    apiFetch("/api/admin/logs?limit=100"),
  ]);

  document.getElementById("logs-loading").style.display = "none";

  // Resumo por token
  if (Array.isArray(summary)) {
    document.getElementById("logs-summary").innerHTML = summary.map((s) => `
      <div class="summary-card">
        <div class="summary-label">${s.label}</div>
        <div class="summary-role"><span class="badge badge-blue">${roleLabel(s.role)}</span></div>
        <div class="summary-stats">
          <span>👁 ${s.page_views || 0} visualizações</span>
          <span>📄 ${s.pdf_downloads || 0} downloads</span>
          <span>🔗 ${s.link_clicks || 0} cliques</span>
        </div>
      </div>
    `).join("") || "<p class='empty-msg'>Sem dados de telemetria ainda.</p>";
  }

  // Tabela de logs
  if (Array.isArray(logs) && logs.length > 0) {
    document.getElementById("logs-tbody").innerHTML = logs.map((l) => `
      <tr>
        <td>${fmt(l.created_at)}</td>
        <td>${l.tokens?.label || "—"}</td>
        <td><span class="badge badge-blue">${l.role}</span></td>
        <td>${l.action}</td>
        <td class="truncate">${l.path || "/"}</td>
      </tr>
    `).join("");
    document.getElementById("logs-table").style.display = "table";
  }
}
