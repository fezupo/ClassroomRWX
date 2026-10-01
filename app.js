(() => {
  const data = window.CLASSROOM_RWX;
  const clips = data.clips;

  const slides = [
    { type: "intro" },
    ...clips.map((clip) => ({ type: "clip", clip })),
    { type: "close" }
  ];

  let index = 0;
  let notesVisible = false;

  const slide = document.getElementById("slide");
  const number = document.getElementById("slideNumber");
  const total = document.getElementById("slideTotal");
  const progress = document.getElementById("progressBar");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  const notesToggle = document.getElementById("notesToggle");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const dialog = document.getElementById("videoDialog");
  const frameHost = document.getElementById("videoFrameHost");
  const videoTitle = document.getElementById("videoTitle");
  const videoKicker = document.getElementById("videoKicker");
  const closeVideo = document.getElementById("closeVideo");

  total.textContent = slides.length;

  const esc = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  function statusClass(status) {
    if (status === "ready") return "ready";
    if (status === "source") return "source";
    return "verify";
  }

  function introTemplate() {
    return `
      <div class="slide-content intro">
        <span class="eyebrow">Boteco RWX · Web Presentation</span>
        <h1 class="hero-title">CLASSROOM<br><span>OF THE ELITE</span></h1>
        <p class="hero-copy">
          Temporadas 1 e 2 pela formação da Classe D, pelo sistema da escola e pelas teias de confiança,
          manipulação, amizade e poder.
        </p>

        <div class="intro-grid">
          <div class="intro-card">
            <strong>${clips.length}</strong>
            <span>trechos na sequência editorial</span>
          </div>
          <div class="intro-card">
            <strong>2</strong>
            <span>temporadas para construir a história</span>
          </div>
          <div class="intro-card">
            <strong>1 regra</strong>
            <span>o clipe abre a conversa; a bancada é o programa</span>
          </div>
        </div>
      </div>
    `;
  }

  function clipTemplate(clip) {
    const seasonClass = clip.season === 1 ? "season-1" : "season-2";
    const canPlay = clip.sourceType === "youtube" && clip.youtubeId;

    return `
      <div class="slide-content">
        <div class="arc-header">
          <div>
            <div class="arc-kicker">${esc(clip.arc)}</div>
            <h2 class="arc-title">${esc(clip.title)}</h2>
            <p class="arc-subtitle">${esc(clip.function)}</p>
          </div>

          <div class="meta-row">
            <span class="pill ${seasonClass}">Temporada ${clip.season}</span>
            <span class="pill">${esc(clip.episode)}</span>
            <span class="status ${statusClass(clip.status)}">${esc(clip.statusLabel)}</span>
          </div>
        </div>

        <div class="slide-grid">
          <article class="primary-panel">
            <div>
              <div class="scene-function">Por que este trecho entra</div>
              <p class="scene-summary">${esc(clip.summary)}</p>
            </div>

            <div class="clip-actions">
              ${canPlay ? `<button class="action-btn js-play" type="button">▶ Tocar trecho</button>` : ""}
              <a class="source-link" href="${esc(clip.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte ↗</a>
            </div>
          </article>

          <aside class="side-panel">
            <div class="info-block">
              <small>Fonte</small>
              <strong>${esc(clip.sourceLabel)}</strong>
            </div>
            <div class="info-block">
              <small>Trecho</small>
              <strong>${esc(clip.range)}</strong>
            </div>
            <div class="info-block">
              <small>Idioma</small>
              <strong>${esc(clip.language)}</strong>
            </div>
            <div class="info-block">
              <small>Janela de conversa</small>
              <span class="pace">${esc(clip.pace)}</span>
            </div>
          </aside>
        </div>

        <section class="notes-panel ${notesVisible ? "is-visible" : ""}">
          <div class="note">
            <small>Pergunta para Will + KV</small>
            <p>${esc(clip.question)}</p>
          </div>
          <div class="note">
            <small>Entrada do Felipe</small>
            <p>${esc(clip.hostCue)}</p>
          </div>
          <div class="note">
            <small>Saída do bloco</small>
            <p>${esc(clip.exitCue)}</p>
          </div>
        </section>
      </div>
    `;
  }

  function closeTemplate() {
    return `
      <div class="slide-content">
        <section class="close-panel">
          <span class="eyebrow">Fechamento</span>
          <h2 class="arc-title">DO SISTEMA À TEIA</h2>
          <p class="arc-subtitle">
            As duas primeiras temporadas começam explicando uma escola e terminam mostrando um ecossistema
            de pessoas que aprendem a usar reputação, confiança, medo e vínculos como parte do jogo.
          </p>

          <div class="close-list">
            <div class="close-item">
              <span>1</span>
              <div><strong>A escola cria o tabuleiro.</strong><p>Pontos, classes e regras transformam convivência em competição.</p></div>
            </div>
            <div class="close-item">
              <span>2</span>
              <div><strong>As relações criam as peças.</strong><p>Horikita, Kushida, Kei, Ryuen e os outros deixam de ser apenas colegas.</p></div>
            </div>
            <div class="close-item">
              <span>3</span>
              <div><strong>Ayanokoji revela o jogador.</strong><p>Quanto mais ele tenta permanecer invisível, mais as consequências apontam para ele.</p></div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function render() {
    const item = slides[index];
    if (item.type === "intro") slide.innerHTML = introTemplate();
    if (item.type === "clip") slide.innerHTML = clipTemplate(item.clip);
    if (item.type === "close") slide.innerHTML = closeTemplate();

    number.textContent = index + 1;
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;

    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;

    const play = slide.querySelector(".js-play");
    if (play && item.type === "clip") {
      play.addEventListener("click", () => openVideo(item.clip));
    }
  }

  function openVideo(clip) {
    if (!clip.youtubeId) return;

    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      playsinline: "1",
      cc_load_policy: "1",
      cc_lang_pref: "pt"
    });

    if (Number.isFinite(clip.start)) params.set("start", String(clip.start));
    if (Number.isFinite(clip.end)) params.set("end", String(clip.end));

    videoKicker.textContent = `${clip.episode} · ${clip.arc}`;
    videoTitle.textContent = clip.title;
    frameHost.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${clip.youtubeId}?${params.toString()}"
        title="${esc(clip.title)}"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;

    dialog.showModal();
  }

  function closeDialog() {
    frameHost.innerHTML = "";
    if (dialog.open) dialog.close();
  }

  function go(delta) {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index + delta));
    if (nextIndex === index) return;
    closeDialog();
    index = nextIndex;
    render();
  }

  function toggleNotes() {
    notesVisible = !notesVisible;
    notesToggle.style.color = notesVisible ? "var(--magenta)" : "";
    render();
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {}
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  notesToggle.addEventListener("click", toggleNotes);
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  closeVideo.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  window.addEventListener("keydown", (event) => {
    if (dialog.open && event.key === "Escape") {
      closeDialog();
      return;
    }
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      go(1);
    }
    if (event.key.toLowerCase() === "n") toggleNotes();
    if (event.key.toLowerCase() === "f") toggleFullscreen();
  });

  render();
})();
