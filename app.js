(() => {
  const data = window.CLASSROOM_RWX;
  const tabs = document.getElementById("partTabs");
  const view = document.getElementById("partView");
  const prev = document.getElementById("prevPart");
  const next = document.getElementById("nextPart");
  const counter = document.getElementById("partCounter");
  const hero = document.querySelector(".hero");
  const heroPoster = document.getElementById("heroPoster");
  let active = 0;

  const esc = (v="") => String(v)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");

  function youtubeEmbed(media){
    const p = new URLSearchParams({
      rel:"0",
      playsinline:"1",
      cc_load_policy:"1",
      cc_lang_pref:"pt"
    });
    if(Number.isFinite(media.start)) p.set("start", String(media.start));
    if(Number.isFinite(media.end)) p.set("end", String(media.end));
    return `https://www.youtube-nocookie.com/embed/${media.id}?${p.toString()}`;
  }

  function mediaTemplate(media){
    let body = "";

    if(media.provider === "youtube"){
      body = `<div class="video-frame">
        <iframe
          src="${youtubeEmbed(media)}"
          title="${esc(media.title)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>`;
    } else if(media.provider === "dailymotion"){
      body = `<div class="video-frame">
        <iframe
          src="https://www.dailymotion.com/embed/video/${esc(media.id)}"
          title="${esc(media.title)}"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen></iframe>
      </div>`;
    } else {
      body = `<div class="pending-media">
        <div>
          <strong>Trecho local em preparação</strong>
          <p>O espaço já está reservado na ordem correta. O arquivo final entra aqui com áudio original japonês e legenda PT-BR, já cortado no começo e fim naturais da cena.</p>
        </div>
      </div>`;
    }

    return `
      <section class="media-block">
        <div class="media-head">
          <div>
            <small>Vídeo de contexto</small>
            <strong>${esc(media.title)}</strong>
          </div>
          <span class="media-tag">${esc(media.tag)}</span>
        </div>
        ${body}
        <p class="media-caption">${esc(media.caption)}</p>
      </section>
    `;
  }

  function storyTemplate(story){
    return `
      <article class="story">
        <span class="story-eyebrow">${esc(story.eyebrow)}</span>
        <h3>${esc(story.title)}</h3>
        <div class="story-copy">
          ${story.paragraphs.map(p => `<p>${p}</p>`).join("")}
        </div>
        ${mediaTemplate(story.media)}
      </article>
    `;
  }

  function renderTabs(){
    tabs.innerHTML = data.parts.map((part, i) => `
      <button class="part-tab ${i === active ? "is-active" : ""}" data-index="${i}" type="button">
        ${esc(part.tab)}
      </button>
    `).join("");

    tabs.querySelectorAll(".part-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        active = Number(btn.dataset.index);
        render();
        window.scrollTo({top: document.querySelector(".site-shell").offsetTop - 10, behavior:"smooth"});
      });
    });
  }

  function render(){
    const part = data.parts[active];

    renderTabs();

    if(heroPoster){
      const nextPoster = part.heroPoster;
      heroPoster.style.opacity = "0";
      heroPoster.removeAttribute("src");

      if(nextPoster){
        heroPoster.onload = () => {
          heroPoster.style.opacity = "0.96";
        };
        heroPoster.onerror = () => {
          heroPoster.onload = null;
          heroPoster.onerror = null;
          heroPoster.style.opacity = "0";
        };
        heroPoster.style.objectPosition = part.heroPosition || "50% 50%";
        heroPoster.src = nextPoster + (nextPoster.includes("?") ? "&" : "?") + "rwxpart=" + active;
      }
    }
    if(hero){
      hero.dataset.tone = part.heroTone || "default";
      hero.dataset.layout = part.heroLayout || "poster";
    }

    view.innerHTML = `
      <header class="part-head">
        <span class="part-number">${esc(part.kicker || (active === 0 ? "Prefácio" : `Parte ${String(active).padStart(2,"0")}`))}</span>
        <h2>${esc(part.title)}</h2>
        <p>${esc(part.intro)}</p>
      </header>
      ${part.stories.map(storyTemplate).join("")}
    `;

    counter.textContent = `${active + 1} / ${data.parts.length}`;
    prev.disabled = active === 0;
    next.disabled = active === data.parts.length - 1;
  }

  function go(delta){
    const target = Math.max(0, Math.min(data.parts.length - 1, active + delta));
    if(target === active) return;
    active = target;
    render();
    window.scrollTo({top: document.querySelector(".site-shell").offsetTop - 10, behavior:"smooth"});
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  window.addEventListener("keydown", e => {
    if(e.key === "ArrowLeft") go(-1);
    if(e.key === "ArrowRight") go(1);
  });

  render();
})();
