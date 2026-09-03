/**
 * rbac.js — Controle de Acesso Baseado em Papéis (Frontend)
 *
 * Fluxo:
 * 1. Lê ?token= da URL
 * 2. Valida com o backend
 * 3. Renderiza o conteúdo do papel correspondente
 * 4. Registra telemetria de cliques e downloads
 */

const API_URL = "https://portfolio-api-production.up.railway.app"; // URL do Railway

// ─── Estado Global ────────────────────────────────────────────────────────────

let currentRole = "visitor";
let currentTokenId = null;

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    try {
      const res = await fetch(`${API_URL}/api/validate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (data.role) {
        currentRole = data.role;
        currentTokenId = token;
      }
    } catch (err) {
      console.warn("[rbac] Falha ao validar token, exibindo como visitante.", err);
    }
  }

  applyRole(currentRole);
  setupAccessRequestModal();
  setupTelemetryListeners();
});

// ─── Renderização por Papel ───────────────────────────────────────────────────

function applyRole(role) {
  // Esconde todas as seções restritas
  document.querySelectorAll("[data-role]").forEach((el) => {
    el.style.display = "none";
  });

  // Exibe seções do papel atual e as públicas
  const visibleRoles = ["visitor", role];
  visibleRoles.forEach((r) => {
    document.querySelectorAll(`[data-role="${r}"]`).forEach((el) => {
      el.style.display = "";
    });
  });

  // Adiciona classe ao body para CSS condicional
  document.body.dataset.role = role;

  // Mostra/esconde botão "Solicitar Acesso"
  const requestBtn = document.getElementById("btn-request-access");
  if (requestBtn) {
    requestBtn.style.display = role === "visitor" ? "inline-flex" : "none";
  }
}

// ─── Modal de Solicitação de Acesso ──────────────────────────────────────────

function setupAccessRequestModal() {
  const modal = document.getElementById("access-request-modal");
  const openBtn = document.getElementById("btn-request-access");
  const closeBtn = document.getElementById("modal-close");
  const form = document.getElementById("access-request-form");

  if (!modal || !form) return;

  openBtn?.addEventListener("click", () => {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });

  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  form.addEventListener("submit", handleAccessRequest);
}

function closeModal() {
  const modal = document.getElementById("access-request-modal");
  if (modal) {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }
}

async function handleAccessRequest(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById("form-status");

  const payload = {
    name: form.querySelector("#req-name").value.trim(),
    organization: form.querySelector("#req-org").value.trim(),
    linkedin: form.querySelector("#req-linkedin").value.trim(),
    purpose: form.querySelector("#req-purpose").value.trim(),
  };

  // Feedback de loading
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Enviando...";
  if (statusEl) statusEl.textContent = "";

  try {
    const res = await fetch(`${API_URL}/api/request-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      if (statusEl) {
        statusEl.textContent = "✅ Solicitação enviada! Você receberá um e-mail em breve.";
        statusEl.className = "form-status success";
      }
      form.reset();
      setTimeout(closeModal, 2500);
    } else {
      throw new Error(data.error || "Erro desconhecido");
    }
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = "❌ Erro ao enviar. Tente novamente ou entre em contato diretamente.";
      statusEl.className = "form-status error";
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// ─── Telemetria de Cliques ────────────────────────────────────────────────────

function setupTelemetryListeners() {
  // Links de contato (WhatsApp, e-mail)
  document.querySelectorAll(".social-links a").forEach((link) => {
    link.addEventListener("click", () => {
      logEvent("link_click", window.location.pathname);
    });
  });

  // Links de download de PDF
  document.querySelectorAll("a[data-pdf]").forEach((link) => {
    link.addEventListener("click", () => {
      logEvent("pdf_download", link.getAttribute("href") || "/");
    });
  });
}

async function logEvent(action, path) {
  try {
    await fetch(`${API_URL}/api/telemetry/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokenId: currentTokenId,
        role: currentRole,
        action,
        path,
      }),
    });
  } catch (_) {
    // Telemetria não pode quebrar a experiência do usuário
  }
}
