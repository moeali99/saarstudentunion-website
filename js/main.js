(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const SOCIAL_LINKS_B64 = {
    instagram: "aHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9zYWFyc3R1ZGVudHMudW5pb24/aWdzaD1OVFU1Ylc0MFp6RjFaV3R3",
    tiktok: "aHR0cHM6Ly93d3cudGlrdG9rLmNvbS9Ac2FhcnN0dWRlbnRzLnVuaW9uP19yPTEmX3Q9WkctOTVoSGV4ZTJCVVg",
    linkedin: "aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkvc2Fhci1zdHVkZW50cy11bmlvbi8",
    whatsapp: "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9HWDJ1Z0JFMzBRbkpjQlA1aFZnOWdo",
  };

  // Fallback (e.g. if atob is unavailable in some environments)
  const SOCIAL_LINKS_PLAIN = {
    instagram: "https://www.instagram.com/saarstudents.union?igsh=NTU5bW40ZzF1ZWtw",
    tiktok: "https://www.tiktok.com/@saarstudents.union?_r=1&_t=ZG-95hHexe2BUX",
    linkedin: "https://www.linkedin.com/company/saar-students-union/",
    whatsapp: "https://chat.whatsapp.com/GX2ugBE30QnJcBP5hVg9gh",
  };

  function b64ToUrl(v) {
    try {
      if (!v) return "";
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(String(v)), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch (_) {
      return "";
    }
  }

  function socialHref(key) {
    return b64ToUrl(SOCIAL_LINKS_B64[key]) || SOCIAL_LINKS_PLAIN[key] || "";
  }

  function applySocialLinks() {
    document.querySelectorAll("[data-social]").forEach((el) => {
      const key = el.getAttribute("data-social");
      const href = key ? socialHref(key) : null;
      if (href) el.setAttribute("href", href);
    });
  }

  let joinModalEl = null;
  let joinLastFocus = null;

  function ensureJoinModal() {
    if (joinModalEl) return joinModalEl;
    const wrap = document.createElement("div");
    wrap.id = "join-modal";
    wrap.className = "team-modal";
    wrap.setAttribute("hidden", "");
    wrap.innerHTML = `
      <div class="team-modal__backdrop" data-join-dismiss tabindex="-1"></div>
      <div class="team-modal__panel" role="dialog" aria-modal="true" aria-labelledby="join-modal-title">
        <button type="button" class="team-modal__close" data-join-dismiss aria-label="">
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 id="join-modal-title" class="team-modal__title"></h2>
        <p class="team-modal__detail"></p>
        <div class="footer__contact-actions" id="join-modal-actions"></div>
      </div>
    `;
    document.body.appendChild(wrap);
    joinModalEl = wrap;

    const closeBtn = wrap.querySelector(".team-modal__close");
    closeBtn.addEventListener("click", closeJoinModal);
    wrap.addEventListener("click", (e) => {
      if (e.target.closest("[data-join-dismiss]")) closeJoinModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && joinModalEl && !joinModalEl.hasAttribute("hidden")) {
        e.preventDefault();
        closeJoinModal();
      }
    });
    return wrap;
  }

  function openJoinModal(dict, opts) {
    const root = ensureJoinModal();
    const titleEl = root.querySelector("#join-modal-title");
    const detailEl = root.querySelector(".team-modal__detail");
    const closeBtn = root.querySelector(".team-modal__close");
    const actions = root.querySelector("#join-modal-actions");

    const o = opts || {};
    const titleKey = o.titleKey || "join-modal-title";
    const leadKey = o.leadKey || "join-modal-lead";
    const closeKey = o.closeKey || "join-modal-close";
    const emailKey = o.emailKey || "join-modal-email";
    const igKey = o.igKey || "join-modal-ig";
    const tiktokKey = o.tiktokKey || "join-modal-tiktok";
    const whatsappKey = o.whatsappKey || "join-modal-whatsapp";
    const linkedinKey = o.linkedinKey || "join-modal-linkedin";

    titleEl.textContent = dict[titleKey] || dict["join-modal-title"] || "Kontakt";
    detailEl.textContent =
      dict[leadKey] || dict["join-modal-lead"] || "Wie möchtest du Kontakt aufnehmen?";
    closeBtn.setAttribute("aria-label", dict[closeKey] || dict["join-modal-close"] || "Schließen");

    actions.innerHTML = "";
    const email = document.createElement("a");
    email.className = "btn btn--primary";
    email.href = "mailto:saarstudentsunion@gmail.com?subject=Mitglied%20werden%20/%20Join%20us";
    email.textContent = dict[emailKey] || dict["join-modal-email"] || "E-Mail senden";
    actions.appendChild(email);

    const ig = document.createElement("a");
    ig.className = "btn btn--outline";
    ig.href = socialHref("instagram");
    ig.target = "_blank";
    ig.rel = "noopener noreferrer";
    ig.textContent = dict[igKey] || dict["join-modal-ig"] || "Instagram";
    actions.appendChild(ig);

    const tk = document.createElement("a");
    tk.className = "btn btn--outline";
    tk.href = socialHref("tiktok");
    tk.target = "_blank";
    tk.rel = "noopener noreferrer";
    tk.textContent = dict[tiktokKey] || dict["join-modal-tiktok"] || "TikTok";
    actions.appendChild(tk);

    const wa = document.createElement("a");
    wa.className = "btn btn--outline";
    wa.href = socialHref("whatsapp");
    wa.target = "_blank";
    wa.rel = "nofollow noopener noreferrer";
    wa.textContent = dict[whatsappKey] || dict["join-modal-whatsapp"] || "WhatsApp";
    actions.appendChild(wa);

    const li = document.createElement("a");
    li.className = "btn btn--outline";
    li.href = socialHref("linkedin");
    li.target = "_blank";
    li.rel = "nofollow noopener noreferrer";
    li.textContent = dict[linkedinKey] || dict["join-modal-linkedin"] || "LinkedIn";
    actions.appendChild(li);

    joinLastFocus = document.activeElement;
    root.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeJoinModal() {
    if (!joinModalEl || joinModalEl.hasAttribute("hidden")) return;
    joinModalEl.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (joinLastFocus && typeof joinLastFocus.focus === "function") joinLastFocus.focus();
  }

  const translations = {
    de: {
      "nav-home": "Start",
      "nav-about": "Über uns",
      "nav-structure": "Struktur",
      "nav-news": "Aktuelles",
      "nav-services": "Angebote",
      "nav-team": "Team",
      "nav-contact": "Kontakt",
      "nav-app": "App",
      "nav-impact": "Impact",
      join: "Mitglied werden",
      "hero-badge": "Offizieller Instagram-Kanal",
      "hero-title": "Saar Students Union",
      "hero-tagline": "Bildung verbindet Welten",
      "hero-lead":
        "Wir vernetzen Studierende, fördern Engagement auf dem Campus und halten euch über Events und Initiativen auf dem Laufenden.",
      "hero-ig": "Auf Instagram folgen",
      "hero-contact": "Kontakt aufnehmen",
      "hero-card-title": "Das erwartet euch",
      "hero-li1": "Community-Events und Campus-Life",
      "hero-li2": "Vertretung studierender Belange",
      "hero-li3": "Kooperationen mit Fachbereichen & Vereinen",
      "about-h2": "Über die Union",
      "about-p1":
        "Die Saar Students Union ist die organisierte Interessenvertretung und der kreative Hub für Studierende. Unser Ziel ist ein inklusives Campus-Erlebnis — von Willkommensformaten bis zu Projekten, die eure Ideen sichtbar machen.",
      "about-p2":
        "Auf unserem Instagram-Kanal teilen wir Termine, Rückblicke und Stimmen aus der Community. Schaut vorbei und werdet Teil der Bewegung.",
      "structure-h2": "Mitglieder & Struktur",
      "structure-sub":
        "Unabhängiger Studierendenverband im Saarland — im Gründungs- und Gemeinnützigkeitsprozess.",
      "structure-stat1": "Vorstand",
      "structure-stat2": "Gründungsteam",
      "structure-stat3": "Aktive Unterstützer",
      "structure-stat4": "Ehrenamtlich",
      "structure-areas-h": "Interne Bereiche",
      "structure-area1": "Social Media",
      "structure-area2": "IT & App",
      "structure-area3": "Beratung & Support",
      "structure-area4": "Marketing",
      "structure-area5": "Finanzen",
      "structure-vol-h": "Freiwillige aus",
      "structure-vol1": "htw saar",
      "structure-vol2": "Universität des Saarlandes (UDS)",
      "structure-vol3": "ISZ",
      "structure-vol4": "Uniklinik / UKS",
      "work-h2": "Unsere Arbeit",
      "work-sub": "Niedrigschwellige Beratung, Community-Aufbau und Integration — online & vor Ort.",
      "work1-t": "Beratung",
      "work1-li1": "Anmeldung (Stadt, Bank, Krankenkasse)",
      "work1-li2": "Studienbewerbung & VPD",
      "work1-li3": "Stipendien, Wohnungssuche, Jobs",
      "work2-t": "Community",
      "work2-li1": "Aktive WhatsApp-Community",
      "work2-li2": "Monatliche Treffen vor Ort",
      "work2-li3": "Wöchentliche Online-Runden",
      "work3-t": "Akademische Unterstützung",
      "work3-li1": "Austausch zwischen höheren und neuen Semestern",
      "work3-li2": "Lernhilfen & Zusammenfassungen",
      "work3-li3": "Orientierung in Prüfungs- & Studienstrukturen",
      "work4-t": "Soziale & kulturelle Integration",
      "work4-li1": "Welcome Dinner & Events",
      "work4-li2": "Fastenbrechen & Begegnungsformate",
      "work4-li3": "Lokale & internationale Studierende vernetzen",
      "work5-t": "Kooperationen",
      "work5-li1": "International Office, AStA, Fachschaftsrat",
      "work5-li2": "ISZ, Uniklinik, lokale Initiativen",
      "work5-li3": "Vernetzung statt parallele Strukturen",
      "work6-t": "Zielgruppen",
      "work6-li1": "Internationale & neu zugezogene Studierende",
      "work6-li2": "Studierende an htw saar, UDS, UKS, ISZ",
      "work6-li3": "Menschen, die Orientierung vor der Ankunft brauchen",
      "problems-h2": "Die Probleme der Studierenden",
      "problems-sub":
        "Viele Herausforderungen sind strukturell — wir helfen schnell, praktisch und ohne Bürokratie.",
      "problems1-t": "Verwaltung & Orientierung",
      "problems1-li1": "Komplexe Prozesse (Anmeldung, VPD, Anerkennung)",
      "problems1-li2": "Kaum Orientierung vor der Ankunft",
      "problems1-li3": "Keine zentrale Informationsquelle",
      "problems2-t": "Alltag",
      "problems2-li1": "Wohnungssuche (hohe Nachfrage, Wartezeiten)",
      "problems2-li2": "Sprach- & Kulturbarrieren",
      "problems2-li3": "Kommunikationsprobleme mit Stellen",
      "problems3-t": "Belastung & Strukturen",
      "problems3-li1": "Psychische Belastung (Stress, Einsamkeit)",
      "problems3-li2": "Wenig Zusammenarbeit zwischen Angeboten",
      "problems3-li3": "Getrennte Strukturen statt Vernetzung",
      "news-h2": "Aktuelles & Highlights",
      "news-sub": "Kurze Meldungen zu Programmen, Treffen und Themen, die für Studierende an der HTW und im Saarland relevant sind.",
      "news1-tag": "Campus",
      "news1-t": "Willkommenswoche",
      "news1-p": "Programm, Treffpunkte und erste Orientierung für neue Studierende.",
      "news2-tag": "Community",
      "news2-t": "Townhall mit dem Vorstand",
      "news2-p": "Offene Fragen, Transparenz zu Projekten und Feedback aus der Studierendenschaft.",
      "news3-tag": "Kultur",
      "news3-t": "Kulturbühne & Networking",
      "news3-p": "Kreative Formate, die Fachbereiche und Studierende zusammenbringen.",
      "serv-h2": "Unsere Schwerpunkte",
      "serv-sub": "Orientierung an klassischen Vereinssektionen — ähnlich strukturiert wie auf großen Verbandsseiten.",
      "team-h2": "Team & Vorstand",
      "team-banner-cap": "Neuer Vorstand gewählt",
      "team-sub":
        "Rolle, Kurztext und Porträt auf der Karte. Ein Klick auf den Namen öffnet ausführliche Infos.",
      "team-card-ig": "Profil auf Instagram",
      "team-open-detail": "Mehr über",
      "team-modal-close": "Schließen",
      "team-modal-footer-hint":
        "Ausführliche Texte stehen in data/team.json (Feld detail) und können dort angepasst werden.",
      "join-modal-title": "Mitglied werden",
      "join-modal-lead": "Wie möchtest du Kontakt aufnehmen? Wähle einen Kanal.",
      "join-modal-close": "Schließen",
      "join-modal-email": "E-Mail senden",
      "join-modal-ig": "Instagram DM",
      "join-modal-tiktok": "TikTok",
      "join-modal-whatsapp": "WhatsApp",
      "join-modal-linkedin": "LinkedIn",
      "feed-h2": "Aus dem Instagram-Feed",
      "feed-sub":
        "Einblicke in Orientierung, Community und Events aus unserem Kanal — jede Kachel öffnet unser Instagram-Profil mit allen aktuellen Posts.",
      "s1-t": "Interessenvertretung",
      "s1-p": "Schnittstelle zu Gremien, Lehre und Services — strukturiert und studierendennahe.",
      "s2-t": "Events & Formate",
      "s2-p": "Von Workshops bis Socials: wir gestalten Programme, die Verbindung schaffen.",
      "s3-t": "Kommunikation",
      "s3-p": "Klare Kanäle: Instagram als Herzstück plus Mail für offizielle Anfragen.",
      stats1: "Events / Jahr",
      stats2: "Aktive Mitglieder",
      stats3: "Partner auf dem Campus",
      stats4: "Jahre für die Community",
      "cta-h": "Bleibt verbunden",
      "cta-p": "Folgt uns für Live-Updates, Stories und Einblicke hinter die Kulissen.",
      "cta-btn": "Kanal auswählen",
      "cta-modal-title": "Bleibt verbunden",
      "cta-modal-lead": "Wie möchtest du uns folgen oder Kontakt aufnehmen?",
      "cta-tiktok": "TikTok öffnen",
      "contact-lead":
        "Wie möchtest du uns kontaktieren? Per E-Mail, Instagram oder TikTok — oder komm gerne in unsere WhatsApp-Gruppe und frag dort.",
      "contact-email": "E-Mail senden",
      "contact-ig": "Instagram DM",
      "contact-tiktok": "TikTok",
      "contact-linkedin": "LinkedIn",
      "contact-whatsapp": "WhatsApp",
      "app-badge": "In Entwicklung",
      "app-h2": "Unsere Union-App",
      "app-lead":
        "Parallel zur Website entsteht eine App für Campus-Infos, Events und eure Anliegen — noch nicht im Store, aber mit euch im Blick.",
      "app-li1": "Wichtiges vom Campus schnell griffbereit",
      "app-li2": "Weniger verpassen: Fokus auf Community & Termine",
      "app-li3": "Datenschutzfreundlich und ohne Schnickschnack geplant",
      "app-cta-mail": "Interesse oder Feedback",
      "app-cta-download": "APK herunterladen",
      "app-cta-ig": "Auf dem Laufenden bleiben",
      "app-visual-cap": "So ungefähr wird’s wirken — Details folgen.",
      "app-gallery-h2": "App-Einblicke",
      "app-gallery-sub": "Ein kleiner Blick in Onboarding & Branding (aus der APK extrahiert).",
      "impact-h2": "Impact & Förderung",
      "impact-sub": "Was wir bereits erreicht haben — und warum Unterstützung jetzt Wirkung multipliziert.",
      "impact-a-h": "Unser Impact",
      "impact-a1": "Unterstützung von über 1.000 Studierenden (2023–2025)",
      "impact-a2": "Größte studentische Community im Saarland mit aufgebaut",
      "impact-a3": "Sonderpreis für studentisches Engagement",
      "impact-a4": "Einladung zum Bürgerfest 2025 durch den Bundespräsidenten",
      "impact-a5": "Mediale Sichtbarkeit (z. B. Saarbrücker Zeitung)",
      "impact-b-h": "Warum wir Förderung brauchen",
      "impact-b1": "Weiterentwicklung der App (IT, Server, neue Funktionen)",
      "impact-b2": "Aufbau & Pflege der Website",
      "impact-b3": "Finanzierung von Events & Informationsveranstaltungen",
      "impact-b4": "Technische Ausstattung (Laptops, Mikrofone, Tools)",
      "impact-b5": "Büro / Arbeitsraum für Beratung & Organisation",
      "impact-why-h": "Warum es wichtig ist, uns zu unterstützen",
      "impact-why-sub": "Schnell, niedrigschwellig, verlässlich — 7 Tage die Woche, online & vor Ort.",
      "impact-c1-t": "Entlastung",
      "impact-c1-p": "Wir entlasten Ausländerbehörde, Rathaus, International Office, AStA.",
      "impact-c2-t": "Integration",
      "impact-c2-p": "Bessere Integration & Stabilität für Studierende im Saarland.",
      "impact-c3-t": "Erfolgschancen",
      "impact-c3-p": "Verbesserung akademischer und sozialer Erfolgschancen.",
      "goals-h": "Unsere Ziele",
      "goals-sub": "Vision 2026–2030",
      "goals1": "Offizieller Launch der Saar Students Union App",
      "goals2": "Ausbau des Verbands auf das gesamte Saarland (Kooperationen & Strukturen)",
      "goals3":
        "Strategische Partnerschaften (DAAD, GIZ, Ministerien, Stadt Saarbrücken, UDS, htw saar)",
      "goals4": "Unterstützungssystem vor der Ankunft in Deutschland",
      "goals5": "Modell perspektivisch auf andere Bundesländer übertragen",
      "foot-about": "Kurzinfo",
      "foot-about-t":
        "Saar Students Union — Studierendenvertretung und Community-Hub an der HTW Saar: Orientierung, Vernetzung und Stimme für Studierende in der Region.",
      "foot-links": "Schnellzugriff",
      "foot-contact": "Kontakt",
      "foot-copy": "© {year} Saar Students Union. Alle Rechte vorbehalten.",
    },
    en: {
      "nav-home": "Home",
      "nav-about": "About",
      "nav-structure": "Structure",
      "nav-news": "News",
      "nav-services": "What we do",
      "nav-team": "Team",
      "nav-contact": "Contact",
      "nav-app": "App",
      "nav-impact": "Impact",
      join: "Join us",
      "hero-badge": "Official Instagram",
      "hero-title": "Saar Students Union",
      "hero-tagline": "Education connects worlds",
      "hero-lead":
        "We connect students, support campus engagement, and keep you posted on events and initiatives.",
      "hero-ig": "Follow on Instagram",
      "hero-contact": "Get in touch",
      "hero-card-title": "What to expect",
      "hero-li1": "Community events and campus life",
      "hero-li2": "Representation of student interests",
      "hero-li3": "Collaboration with faculties & clubs",
      "about-h2": "About the union",
      "about-p1":
        "Saar Students Union is the organized voice and creative hub for students. We aim for an inclusive campus experience — from welcome formats to projects that make your ideas visible.",
      "about-p2":
        "On Instagram we share dates, recaps, and voices from the community. Drop by and become part of the movement.",
      "structure-h2": "Members & structure",
      "structure-sub":
        "Independent student association in Saarland — currently in the founding and non-profit process.",
      "structure-stat1": "Board",
      "structure-stat2": "Founding team",
      "structure-stat3": "Active supporters",
      "structure-stat4": "Volunteer-based",
      "structure-areas-h": "Internal areas",
      "structure-area1": "Social media",
      "structure-area2": "IT & app",
      "structure-area3": "Advising & support",
      "structure-area4": "Marketing",
      "structure-area5": "Finance",
      "structure-vol-h": "Volunteers from",
      "structure-vol1": "htw saar",
      "structure-vol2": "Saarland University (UDS)",
      "structure-vol3": "ISZ",
      "structure-vol4": "University hospital / UKS",
      "work-h2": "What we do",
      "work-sub": "Low-barrier support, community building, and integration — online & in person.",
      "work1-t": "Advising",
      "work1-li1": "Registration (city, bank, health insurance)",
      "work1-li2": "University applications & VPD",
      "work1-li3": "Scholarships, housing search, jobs",
      "work2-t": "Community",
      "work2-li1": "Active WhatsApp community",
      "work2-li2": "Monthly in-person meetups",
      "work2-li3": "Weekly online rounds",
      "work3-t": "Academic support",
      "work3-li1": "Exchange between senior and new semesters",
      "work3-li2": "Study help & summaries",
      "work3-li3": "Orientation in exam & study structures",
      "work4-t": "Social & cultural integration",
      "work4-li1": "Welcome dinners & events",
      "work4-li2": "Iftar & community meetups",
      "work4-li3": "Connecting local and international students",
      "work5-t": "Partnerships",
      "work5-li1": "International Office, AStA, student councils",
      "work5-li2": "ISZ, university hospital, local initiatives",
      "work5-li3": "Connecting structures instead of duplicating them",
      "work6-t": "Target groups",
      "work6-li1": "International and newly arrived students",
      "work6-li2": "Students at htw saar, UDS, UKS, ISZ",
      "work6-li3": "People who need guidance before arriving in Germany",
      "problems-h2": "Student challenges",
      "problems-sub":
        "Many issues are structural — we help quickly, practically, and without bureaucracy.",
      "problems1-t": "Administration & orientation",
      "problems1-li1": "Complex processes (registration, VPD, recognition)",
      "problems1-li2": "Little guidance before arriving in Germany",
      "problems1-li3": "No single central information source",
      "problems2-t": "Everyday life",
      "problems2-li1": "Housing search (high demand, long waiting times)",
      "problems2-li2": "Language and cultural barriers",
      "problems2-li3": "Communication barriers with institutions",
      "problems3-t": "Mental load & structures",
      "problems3-li1": "Mental strain (stress, loneliness)",
      "problems3-li2": "Limited cooperation between support offers",
      "problems3-li3": "Separated structures instead of connected services",
      "news-h2": "News & highlights",
      "news-sub": "Short updates on programmes, meetups, and topics that matter to students at HTW and in the Saarland.",
      "news1-tag": "Campus",
      "news1-t": "Welcome week",
      "news1-p": "Programme, meetups, and first orientation for new students.",
      "news2-tag": "Community",
      "news2-t": "Town hall with the board",
      "news2-p": "Open questions, transparency on projects, and feedback from students.",
      "news3-tag": "Culture",
      "news3-t": "Culture stage & networking",
      "news3-p": "Creative formats that bring faculties and students together.",
      "serv-h2": "Our focus areas",
      "serv-sub": "Structured like large association sites — easy to extend.",
      "team-h2": "Team & board",
      "team-banner-cap": "New board elected",
      "team-sub":
        "Role, short bio, and portrait on each card. Click a name for the full story.",
      "team-card-ig": "Instagram profile",
      "team-open-detail": "More about",
      "team-modal-close": "Close",
      "team-modal-footer-hint":
        "Longer bios are stored in data/team.json (detail) and can be edited there.",
      "join-modal-title": "Join us",
      "join-modal-lead": "How would you like to contact us? Choose a channel.",
      "join-modal-close": "Close",
      "join-modal-email": "Send email",
      "join-modal-ig": "Instagram DM",
      "join-modal-tiktok": "TikTok",
      "join-modal-whatsapp": "WhatsApp",
      "join-modal-linkedin": "LinkedIn",
      "feed-h2": "From our Instagram feed",
      "feed-sub":
        "Glimpses of orientation, community, and events from our channel — each tile opens our Instagram profile with the latest posts.",
      "s1-t": "Representation",
      "s1-p": "Interface to committees, teaching, and services — structured and close to students.",
      "s2-t": "Events & formats",
      "s2-p": "From workshops to socials: programmes that build connection.",
      "s3-t": "Communication",
      "s3-p": "Clear channels: Instagram as the heart plus email for official requests.",
      stats1: "Events / year",
      stats2: "Active members",
      stats3: "Campus partners",
      stats4: "Years for the community",
      "cta-h": "Stay connected",
      "cta-p": "Follow us for live updates, stories, and behind-the-scenes.",
      "cta-btn": "Choose a channel",
      "cta-modal-title": "Stay connected",
      "cta-modal-lead": "How would you like to follow us or get in touch?",
      "cta-tiktok": "Open TikTok",
      "contact-lead":
        "How would you like to contact us? Email, Instagram, or TikTok — or join our WhatsApp group and ask there.",
      "contact-email": "Send email",
      "contact-ig": "Instagram DM",
      "contact-tiktok": "TikTok",
      "contact-linkedin": "LinkedIn",
      "contact-whatsapp": "WhatsApp",
      "app-badge": "In development",
      "app-h2": "Our union app",
      "app-lead":
        "Alongside the website we’re building an app for campus info, events, and your concerns — not in the stores yet, but designed with you in mind.",
      "app-li1": "The essentials from campus, easy to reach",
      "app-li2": "Miss less: focused on community and dates",
      "app-li3": "Planned to be privacy-friendly and straightforward",
      "app-cta-mail": "Interest or feedback",
      "app-cta-download": "Download APK",
      "app-cta-ig": "Stay in the loop",
      "app-visual-cap": "Roughly how it will feel — details to follow.",
      "app-gallery-h2": "App preview",
      "app-gallery-sub": "A quick look at onboarding & branding (extracted from the APK).",
      "impact-h2": "Impact & funding",
      "impact-sub": "What we’ve already achieved — and why support now multiplies impact.",
      "impact-a-h": "Our impact",
      "impact-a1": "Supported 1,000+ students (2023–2025)",
      "impact-a2": "Helped build the largest student community in Saarland",
      "impact-a3": "Special award for student engagement",
      "impact-a4": "Invited to the 2025 citizens’ festival by the Federal President",
      "impact-a5": "Media visibility (e.g. Saarbrücker Zeitung)",
      "impact-b-h": "Why we need funding",
      "impact-b1": "Further app development (IT costs, servers, new features)",
      "impact-b2": "Build & maintain the website",
      "impact-b3": "Fund events and information sessions",
      "impact-b4": "Technical equipment (laptops, microphones, tools)",
      "impact-b5": "Office / workspace for advising & coordination",
      "impact-why-h": "Why supporting us matters",
      "impact-why-sub": "Fast, low-barrier, reliable — 7 days a week, online & in person.",
      "impact-c1-t": "Relief",
      "impact-c1-p": "We reduce workload for immigration office, city offices, International Office, AStA.",
      "impact-c2-t": "Integration",
      "impact-c2-p": "Better integration and stability for students in Saarland.",
      "impact-c3-t": "Success",
      "impact-c3-p": "Improved academic and social chances of success.",
      "goals-h": "Our goals",
      "goals-sub": "Vision 2026–2030",
      "goals1": "Official launch of the Saar Students Union app",
      "goals2": "Expand across Saarland (formal partnerships & structures)",
      "goals3": "Strategic partnerships (DAAD, GIZ, ministries, City of Saarbrücken, UDS, htw saar)",
      "goals4": "Full support system for students before arrival in Germany",
      "goals5": "Transfer our model to other federal states over time",
      "foot-about": "About",
      "foot-about-t":
        "Saar Students Union — student representation and community hub at HTW Saar: orientation, networking, and a voice for students in the region.",
      "foot-links": "Quick links",
      "foot-contact": "Contact",
      "foot-copy": "© {year} Saar Students Union. All rights reserved.",
    },
    ar: {
      "nav-home": "الرئيسية",
      "nav-about": "عن الاتحاد",
      "nav-structure": "الهيكل",
      "nav-news": "الأخبار",
      "nav-services": "خدماتنا",
      "nav-team": "الفريق",
      "nav-contact": "اتصل بنا",
      "nav-app": "التطبيق",
      "nav-impact": "الأثر",
      join: "انضم إلينا",
      "hero-badge": "حساب إنستغرام الرسمي",
      "hero-title": "Saar Students Union",
      "hero-tagline": "التعليم يربط العوالم",
      "hero-lead":
        "نوصل الطلاب، وندعم المشاركة الحيوية في الحرم الجامعي، ونُبقيكم على اطلاع بالفعاليات والمبادرات.",
      "hero-ig": "تابعونا على إنستغرام",
      "hero-contact": "تواصل معنا",
      "hero-card-title": "ما الذي نقدمه",
      "hero-li1": "فعاليات مجتمعية وحياة طلابية",
      "hero-li2": "تمثيل مصالح الطلاب",
      "hero-li3": "شراكات مع الكليات والنوادي",
      "about-h2": "نبذة عن الاتحاد",
      "about-p1":
        "اتحاد طلاب سار هو الصوت المنظم والمساحة الإبداعية للطلاب. نسعى لتجربة حرم جامعي شاملة — من برامج الترحيب إلى مشاريع تُبرز أفكاركم.",
      "about-p2":
        "على إنستغرام نشارك المواعيد، والتغطيات، وصوت المجتمع الطلابي. زوروا الحساب وكونوا جزءًا من الحركة.",
      "structure-h2": "الأعضاء والهيكل",
      "structure-sub": "اتحاد طلابي مستقل في سارلاند — حاليًا في مرحلة التأسيس وإجراءات العمل غير الربحي.",
      "structure-stat1": "مجلس الإدارة",
      "structure-stat2": "فريق التأسيس",
      "structure-stat3": "داعمون نشطون",
      "structure-stat4": "عمل تطوعي",
      "structure-areas-h": "الأقسام الداخلية",
      "structure-area1": "وسائل التواصل",
      "structure-area2": "تقنية المعلومات والتطبيق",
      "structure-area3": "استشارات ودعم",
      "structure-area4": "تسويق",
      "structure-area5": "المالية",
      "structure-vol-h": "متطوعون من",
      "structure-vol1": "htw saar",
      "structure-vol2": "جامعة سارلاند (UDS)",
      "structure-vol3": "ISZ",
      "structure-vol4": "المستشفى الجامعي / UKS",
      "work-h2": "عملنا",
      "work-sub": "دعم سهل الوصول، بناء مجتمع، واندماج — عبر الإنترنت وعلى أرض الواقع.",
      "work1-t": "الاستشارات",
      "work1-li1": "التسجيل (البلدية، البنك، التأمين الصحي)",
      "work1-li2": "التقديم للدراسة و VPD",
      "work1-li3": "منح، سكن، وظائف",
      "work2-t": "المجتمع",
      "work2-li1": "مجتمع واتساب نشط",
      "work2-li2": "لقاءات شهرية حضورية",
      "work2-li3": "جلسات أسبوعية عبر الإنترنت",
      "work3-t": "دعم أكاديمي",
      "work3-li1": "تبادل خبرات بين طلاب متقدمين وجدد",
      "work3-li2": "مساعدات دراسية وملخصات",
      "work3-li3": "شرح بنية الامتحانات والدراسة",
      "work4-t": "اندماج اجتماعي وثقافي",
      "work4-li1": "عشاء ترحيبي وفعاليات",
      "work4-li2": "إفطار جماعي ولقاءات",
      "work4-li3": "ربط الطلاب المحليين والدوليين",
      "work5-t": "شراكات",
      "work5-li1": "المكتب الدولي، AStA، مجالس الأقسام",
      "work5-li2": "ISZ، المستشفى الجامعي، مبادرات محلية",
      "work5-li3": "تنسيق الجهود بدل تكرارها",
      "work6-t": "الفئات المستهدفة",
      "work6-li1": "طلاب دوليون وواصلون حديثًا",
      "work6-li2": "طلاب htw saar و UDS و UKS و ISZ",
      "work6-li3": "من يحتاجون إرشادًا قبل الوصول إلى ألمانيا",
      "problems-h2": "مشاكل وتحديات الطلاب",
      "problems-sub": "كثير من التحديات هيكلية — نحن نساعد بسرعة وبشكل عملي وبدون تعقيد.",
      "problems1-t": "الإجراءات والتوجيه",
      "problems1-li1": "عمليات معقدة (التسجيل، VPD، معادلة الشهادات)",
      "problems1-li2": "قلة التوجيه قبل الوصول",
      "problems1-li3": "غياب مصدر معلومات مركزي",
      "problems2-t": "الحياة اليومية",
      "problems2-li1": "البحث عن سكن (طلب مرتفع، انتظار طويل)",
      "problems2-li2": "حواجز اللغة والثقافة",
      "problems2-li3": "صعوبات التواصل مع الجهات",
      "problems3-t": "الضغط والبُنى",
      "problems3-li1": "ضغط نفسي (توتر، وحدة)",
      "problems3-li2": "تعاون محدود بين الخدمات",
      "problems3-li3": "تشتت الخدمات بدل ربطها",
      "news-h2": "الأخبار والمستجدات",
      "news-sub": "تحديثات قصيرة عن البرامج واللقاءات والمواضيع المهمة لطلاب HTW ومنطقة سار.",
      "news1-tag": "الحرم الجامعي",
      "news1-t": "أسبوع الترحيب",
      "news1-p": "برنامج، ونقاط لقاء، وتوجيه أولي للطلاب الجدد.",
      "news2-tag": "المجتمع",
      "news2-t": "لقاء مفتوح مع مجلس الإدارة",
      "news2-p": "أسئلة مفتوحة، وشفافية في المشاريع، وملاحظات من الطلاب.",
      "news3-tag": "الثقافة",
      "news3-t": "منصة ثقافية وتواصل",
      "news3-p": "صيغ إبداعية تجمع بين الكليات والطلاب.",
      "serv-h2": "مجالات عملنا",
      "serv-sub": "هيكل واضح كالمواقع المؤسسية — سهل التوسعة.",
      "team-h2": "الفريق والمجلس",
      "team-banner-cap": "تم انتخاب مجلس إداري جديد",
      "team-sub":
        "الدور والنص القصير والصورة على البطاقة. اضغطوا الاسم لمزيد من التفاصيل.",
      "team-card-ig": "الملف على إنستغرام",
      "team-open-detail": "المزيد عن",
      "team-modal-close": "إغلاق",
      "team-modal-footer-hint":
        "النصوص الطويلة في data/team.json (الحقل detail) ويمكن تعديلها هناك.",
      "join-modal-title": "انضم إلينا",
      "join-modal-lead": "كيف تودّ/تودّين التواصل معنا؟ اختر/اختاري القناة.",
      "join-modal-close": "إغلاق",
      "join-modal-email": "إرسال بريد",
      "join-modal-ig": "رسالة إنستغرام",
      "join-modal-tiktok": "تيك توك",
      "join-modal-whatsapp": "واتساب",
      "join-modal-linkedin": "لينكدإن",
      "feed-h2": "من منشورات إنستغرام",
      "feed-sub":
        "لمحات عن التوجيه والمجتمع والفعاليات من قناتنا — كل بلاطة تفتح ملف إنستغرام مع أحدث المنشورات.",
      "s1-t": "التمثيل والمصالح",
      "s1-p": "ربط مع اللجان والتدريس والخدمات — بشكل منظم وقريب من الطلاب.",
      "s2-t": "الفعاليات والبرامج",
      "s2-p": "من ورش العمل إلى اللقاءات الاجتماعية: برامج تبني الروابط.",
      "s3-t": "التواصل",
      "s3-p": "قنوات واضحة: إنستغرام كمركز، والبريد للاستفسارات الرسمية.",
      stats1: "فعالية / سنة",
      stats2: "عضو نشط",
      stats3: "شركاء في الحرم",
      stats4: "سنوات للمجتمع",
      "cta-h": "ابقوا على تواصل",
      "cta-p": "تابعونا للتحديثات والقصص ولمحة خلف الكواليس.",
      "cta-btn": "اختيار القناة",
      "cta-modal-title": "ابقوا على تواصل",
      "cta-modal-lead": "كيف تودّون المتابعة أو التواصل معنا؟",
      "cta-tiktok": "فتح تيك توك",
      "contact-lead":
        "كيف تودّون التواصل معنا؟ عبر البريد أو إنستغرام أو تيك توك — أو انضمّوا إلى مجموعتنا على واتساب واسألوا هناك.",
      "contact-email": "إرسال بريد",
      "contact-ig": "رسالة إنستغرام",
      "contact-tiktok": "تيك توك",
      "contact-linkedin": "لينكدإن",
      "contact-whatsapp": "واتساب",
      "app-badge": "قيد التطوير",
      "app-h2": "تطبيق الاتحاد",
      "app-lead":
        "إلى جانب الموقع نعمل على تطبيق لأخبار الحرم والفعاليات وشؤونكم — ليس في المتاجر بعد، لكنه موجّه إليكم.",
      "app-li1": "المهم من الحرم في متناول اليد بسرعة",
      "app-li2": "أقل فوتًا: تركيز على المجتمع والمواعيد",
      "app-li3": "مخطط ليكون صديقًا للخصوصية وبسيطًا",
      "app-cta-mail": "اهتمام أو ملاحظات",
      "app-cta-download": "تحميل APK",
      "app-cta-ig": "ابقوا على اطلاع",
      "app-visual-cap": "فكرة تقريبية عن الشكل — التفاصيل لاحقًا.",
      "app-gallery-h2": "لمحة عن التطبيق",
      "app-gallery-sub": "نظرة سريعة على واجهة البداية والهوية (مستخرجة من ملف APK).",
      "impact-h2": "الأثر والدعم",
      "impact-sub": "ما حققناه بالفعل — ولماذا دعمكم الآن يضاعف الأثر.",
      "impact-a-h": "أثرنا",
      "impact-a1": "دعم أكثر من 1000 طالب (2023–2025)",
      "impact-a2": "المساهمة في بناء أكبر مجتمع طلابي في سارلاند",
      "impact-a3": "جائزة خاصة للعمل الطلابي",
      "impact-a4": "دعوة إلى احتفال المواطنين 2025 من قبل الرئيس الاتحادي",
      "impact-a5": "حضور إعلامي (مثل Saarbrücker Zeitung)",
      "impact-b-h": "لماذا نحتاج إلى دعم",
      "impact-b1": "تطوير التطبيق (تكاليف تقنية وخوادم وميزات جديدة)",
      "impact-b2": "بناء الموقع وصيانته",
      "impact-b3": "تمويل الفعاليات واللقاءات التعريفية",
      "impact-b4": "معدات تقنية (لابتوبات، ميكروفونات، أدوات)",
      "impact-b5": "مكتب/مساحة عمل للاستشارات والتنظيم",
      "impact-why-h": "لماذا دعمنا مهم",
      "impact-why-sub": "دعم سريع وسهل وموثوق — 7 أيام في الأسبوع، عبر الإنترنت وعلى أرض الواقع.",
      "impact-c1-t": "تخفيف الضغط",
      "impact-c1-p": "نخفف الضغط عن الجهات الرسمية والمكتب الدولي و AStA.",
      "impact-c2-t": "الاندماج",
      "impact-c2-p": "اندماج أفضل واستقرار أكبر للطلاب في سارلاند.",
      "impact-c3-t": "فرص النجاح",
      "impact-c3-p": "تحسين فرص النجاح الأكاديمي والاجتماعي.",
      "goals-h": "أهدافنا",
      "goals-sub": "رؤية 2026–2030",
      "goals1": "الإطلاق الرسمي لتطبيق Saar Students Union",
      "goals2": "توسيع الاتحاد ليشمل كامل سارلاند (شراكات وبُنى ثابتة)",
      "goals3": "شراكات استراتيجية (DAAD, GIZ, وزارات، مدينة ساربروكن، UDS, htw saar)",
      "goals4": "نظام دعم كامل قبل الوصول إلى ألمانيا",
      "goals5": "تطبيق النموذج على ولايات أخرى تدريجيًا",
      "foot-about": "نبذة",
      "foot-about-t":
        "اتحاد طلاب سار — تمثيل طلابي ومجتمع في HTW سار: التوجيه والتواصل وصوت الطلاب في المنطقة.",
      "foot-links": "روابط سريعة",
      "foot-contact": "التواصل",
      "foot-copy": "© {year} Saar Students Union. جميع الحقوق محفوظة.",
    },
  };

  if (typeof window !== "undefined" && window.SAAR_EXTRA_I18N) {
    Object.assign(translations, window.SAAR_EXTRA_I18N);
  }

  const ISO6391 =
    "aa ab ae af ak am an ar as av ay az ba be bg bi bm bn bo br bs ca ce ch co cr cs cu cv cy da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu"
      .split(/\s+/)
      .filter(Boolean);
  const EN_REF = translations.en;
  for (const c of ISO6391) {
    if (!translations[c]) translations[c] = EN_REF;
  }

  const RTL_LANGS = new Set(["ar", "dv", "fa", "he", "ku", "ps", "sd", "ug", "ur", "yi"]);

  function getDict(lang) {
    const en = translations.en;
    const loc = translations[lang];
    if (!loc) return en;
    if (loc === en && lang !== "en") return en;
    return { ...en, ...loc };
  }

  function applyLang(lang) {
    const dict = getDict(lang);
    document.documentElement.lang = lang;
    const primary = lang.split("-")[0];
    document.documentElement.dir =
      RTL_LANGS.has(lang) || RTL_LANGS.has(primary) ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key]) {
        el.textContent = dict[key].replace("{year}", String(new Date().getFullYear()));
      }
    });

    const sel = document.getElementById("saar-lang-select");
    if (sel) sel.value = lang;

    try {
      localStorage.setItem("saar-lang", lang);
    } catch (_) {
      /* ignore */
    }

    window.dispatchEvent(new CustomEvent("saar-lang", { detail: { lang } }));
  }

  let initial = "de";
  try {
    const saved = localStorage.getItem("saar-lang");
    if (saved && translations[saved]) initial = saved;
  } catch (_) {
    /* ignore */
  }

  function fillLangSelectOnce() {
    const sel = document.getElementById("saar-lang-select");
    if (!sel || sel.dataset.saarFilled === "1") return;
    const uiLang = navigator.language || "de";
    let dn = null;
    try {
      dn = new Intl.DisplayNames([uiLang], { type: "language" });
    } catch (_) {}
    const codes = Object.keys(translations);
    codes.sort((a, b) => {
      const la = dn ? dn.of(a) || a : a;
      const lb = dn ? dn.of(b) || b : b;
      try {
        return la.localeCompare(lb, uiLang, { sensitivity: "base" });
      } catch (_) {
        return String(la).localeCompare(String(lb));
      }
    });
    for (const code of codes) {
      const opt = document.createElement("option");
      opt.value = code;
      let label = code.toUpperCase();
      try {
        const selfDn = new Intl.DisplayNames([code], { type: "language" });
        label = selfDn.of(code) || label;
      } catch (_) {}
      opt.textContent = label;
      sel.appendChild(opt);
    }
    sel.dataset.saarFilled = "1";
    sel.addEventListener("change", () => applyLang(sel.value));
  }

  applySocialLinks();
  fillLangSelectOnce();
  applyLang(initial);

  const joinBtn = document.querySelector("[data-join-open]");
  if (joinBtn) {
    joinBtn.addEventListener("click", () => {
      const lang = document.documentElement.lang || "de";
      const dict = getDict(lang);
      openJoinModal(dict);
    });
  }

  const ctaBtn = document.querySelector("[data-cta-open]");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      const lang = document.documentElement.lang || "de";
      const dict = getDict(lang);
      openJoinModal(dict, { titleKey: "cta-modal-title", leadKey: "cta-modal-lead" });
    });
  }
})();
