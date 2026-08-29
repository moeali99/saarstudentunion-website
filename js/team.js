(function () {
  const teamRoot = document.getElementById("team-root");
  const feedRoot = document.getElementById("feed-root");
  if (!teamRoot || !feedRoot) return;

  teamRoot.addEventListener("click", onTeamClick);

  let payload = null;
  let currentLang = document.documentElement.lang || "de";
  let modalEl = null;
  let lastFocus = null;

  async function loadConfig() {
    try {
      const r = await fetch("data/config.json", { cache: "no-store" });
      if (!r.ok) return null;
      return await r.json();
    } catch (_) {
      return null;
    }
  }

  async function fetchSupabaseTeam(cfg) {
    const supa = cfg && cfg.supabase;
    if (!supa || !supa.url || !supa.anonKey) return null;
    const base = String(supa.url).replace(/\/+$/, "");
    const url = `${base}/rest/v1/team_members?select=sort_order,name,role,excerpt,detail,photo,photo_pos,photo_zoom,photo_size,instagram&order=sort_order.asc,created_at.asc`;
    const r = await fetch(url, {
      headers: {
        apikey: supa.anonKey,
        Authorization: `Bearer ${supa.anonKey}`,
      },
      cache: "no-store",
    });
    if (!r.ok) return null;
    const rows = await r.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return {
      instagram: "", // optional; keep existing feed links
      members: rows.map((x) => ({
        photo: x.photo,
        instagram: x.instagram,
        name: x.name,
        role: x.role,
        excerpt: x.excerpt,
        detail: x.detail,
        photoPos: x.photo_pos,
        photoZoom: x.photo_zoom,
        photoSize: x.photo_size,
      })),
      feed: null,
    };
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safeObjectPosition(value) {
    if (!value) return "";
    const v = String(value).trim();
    // Allow only basic CSS positions like: "50% 20%" / "center top" / "left 30%"
    if (!/^(?:left|right|center|\d+(?:\.\d+)?%)(?:\s+(?:top|bottom|center|\d+(?:\.\d+)?%))?$/.test(v))
      return "";
    return v;
  }

  function safeZoom(value) {
    if (value === null || value === undefined || value === "") return "";
    const n = Number(value);
    if (!Number.isFinite(n)) return "";
    // Keep it in a reasonable range to avoid weird layout / huge pixels
    if (n < 1 || n > 2) return "";
    return String(n);
  }

  function safePhotoSize(value) {
    if (value === null || value === undefined || value === "") return "";
    const n = Number(value);
    if (!Number.isFinite(n)) return "";
    // Reasonable portrait circle size in px
    if (n < 96 || n > 180) return "";
    return String(Math.round(n));
  }

  function t(obj, lang) {
    if (!obj) return "";
    return obj[lang] || obj.de || obj.en || "";
  }

  function openHintLabel() {
    const el = document.getElementById("saar-team-open-hint");
    const s = el && el.textContent ? el.textContent.trim() : "";
    return s || "Mehr über";
  }

  function closeModalLabel() {
    const el = document.getElementById("saar-team-modal-close");
    const s = el && el.textContent ? el.textContent.trim() : "";
    return s || "Schließen";
  }

  function ensureModal() {
    if (modalEl) return modalEl;
    const wrap = document.createElement("div");
    wrap.id = "team-member-modal";
    wrap.className = "team-modal";
    wrap.setAttribute("hidden", "");
    wrap.innerHTML = `
      <div class="team-modal__backdrop" data-team-modal-dismiss tabindex="-1"></div>
      <div class="team-modal__panel" role="dialog" aria-modal="true" aria-labelledby="team-modal-title">
        <button type="button" class="team-modal__close" data-team-modal-dismiss aria-label="">
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 id="team-modal-title" class="team-modal__title"></h2>
        <p class="team-modal__role"></p>
        <div class="team-modal__detail"></div>
      </div>
    `;
    document.body.appendChild(wrap);
    modalEl = wrap;

    const closeBtn = wrap.querySelector(".team-modal__close");
    closeBtn.setAttribute("aria-label", closeModalLabel());

    wrap.addEventListener("click", (e) => {
      if (e.target.closest("[data-team-modal-dismiss]")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modalEl.hasAttribute("hidden")) {
        e.preventDefault();
        closeModal();
      }
    });

    return wrap;
  }

  function openModal(member) {
    const lang = currentLang;
    const root = ensureModal();
    const name = t(member.name, lang);
    const role = t(member.role, lang);
    const detailRaw = t(member.detail, lang) || t(member.excerpt, lang);

    root.querySelector("#team-modal-title").textContent = name;
    root.querySelector(".team-modal__role").textContent = role;
    root.querySelector(".team-modal__detail").textContent = detailRaw;

    const closeBtn = root.querySelector(".team-modal__close");
    closeBtn.setAttribute("aria-label", closeModalLabel());

    lastFocus = document.activeElement;
    root.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    if (!modalEl || modalEl.hasAttribute("hidden")) return;
    modalEl.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function render() {
    if (!payload) return;
    const lang = currentLang;

    const members = payload.members || [];
    teamRoot.innerHTML = members
      .map((m, idx) => {
        const namePlain = t(m.name, lang);
        const name = esc(namePlain);
        const role = esc(t(m.role, lang));
        const photo = esc(m.photo);
        const photoPos = safeObjectPosition(m.photoPos);
        const photoZoom = safeZoom(m.photoZoom);
        const photoSize = safePhotoSize(m.photoSize);
        const styleBits = [];
        if (photoPos) styleBits.push(`object-position:${esc(photoPos)}`);
        if (photoZoom) styleBits.push(`transform:scale(${esc(photoZoom)})`);
        const photoStyle = styleBits.length ? ` style="${styleBits.join(";")}"` : "";
        const frameStyle = photoSize ? ` style="--team-photo-size:${esc(photoSize)}px"` : "";
        const excerptRaw = t(m.excerpt, lang);
        const excerptBlock = excerptRaw
          ? `<p class="team-card__excerpt">${esc(excerptRaw)}</p>`
          : "";
        const ariaOpen = esc(`${openHintLabel()}: ${namePlain}`);
        return `<article class="team-card">
          <div class="team-card__photo-wrap">
            <div class="team-card__photo-frame"${frameStyle}>
              <img class="team-card__photo" src="${photo}" alt="${name}" width="400" height="400" loading="lazy" decoding="async"${photoStyle} />
            </div>
          </div>
          <div class="team-card__body">
            <h3 class="team-card__name">
              <button type="button" class="team-card__name-trigger" data-team-idx="${idx}" aria-haspopup="dialog" aria-label="${ariaOpen}">
                ${name}
              </button>
            </h3>
            <p class="team-card__role">${role}</p>
            ${excerptBlock}
          </div>
        </article>`;
      })
      .join("");

    const feed = payload.feed || [];
    feedRoot.innerHTML = feed
      .map((f) => {
        const capRaw = t(f.caption, lang);
        const cap = esc(capRaw);
        const altImg = esc(capRaw.slice(0, 120));
        const img = esc(f.image);
        const href = esc(f.href || payload.instagram || "#");
        return `
        <a class="feed-tile" href="${href}" target="_blank" rel="noopener noreferrer">
          <span class="feed-tile__media">
            <img src="${img}" alt="${altImg}" loading="lazy" decoding="async" />
          </span>
          <span class="feed-tile__cap">${cap}</span>
        </a>`;
      })
      .join("");

    teamRoot.setAttribute("aria-busy", "false");
    feedRoot.setAttribute("aria-busy", "false");
  }

  function onTeamClick(e) {
    const btn = e.target.closest(".team-card__name-trigger");
    if (!btn || !payload) return;
    const idx = parseInt(btn.getAttribute("data-team-idx"), 10);
    if (Number.isNaN(idx) || !payload.members[idx]) return;
    e.preventDefault();
    openModal(payload.members[idx]);
  }

  function setLang(lang) {
    currentLang = lang;
    if (modalEl && !modalEl.hasAttribute("hidden")) closeModal();
    render();
  }

  window.addEventListener("saar-lang", (e) => {
    const lang = e.detail && e.detail.lang;
    if (lang) setLang(lang);
  });

  (async () => {
    try {
      const cfg = await loadConfig();
      const fromDb = await fetchSupabaseTeam(cfg);
      if (fromDb) {
        payload = fromDb;
      } else {
        const r = await fetch("data/team.json", { cache: "no-store" });
        payload = await r.json();
      }
      ensureModal();
      setLang(document.documentElement.lang || "de");
    } catch (_) {
      teamRoot.innerHTML =
        '<p class="team-error">Team-Daten konnten nicht geladen werden (data/team.json).</p>';
      feedRoot.innerHTML = "";
      teamRoot.setAttribute("aria-busy", "false");
      feedRoot.setAttribute("aria-busy", "false");
    }
  })();
})();
