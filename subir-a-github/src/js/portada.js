/* La URL del feed de Behold se configura en el panel /admin
   (Configuración del sitio) o en src/_data/site.json → beholdFeedUrl. */
const CONFIG = {
  beholdFeedUrl: window.RDC_FEED || "",
  instagramUrl: "https://www.instagram.com/revistadigitalcentro/",
  maxPosts: 6
};
/* =========================================================== */

const U = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${w}&q=70`;
const SAMPLE = [
  ["1495020689067-958852a7765e", "Síguenos en Instagram para ver las publicaciones más recientes."],
  ["1512025316832-8658f04f8a83", "Detrás de cámaras"],
  ["1759299613786-aa1fcba3ab26", "Ciudad de México"],
  ["1559523161-0fc0d8b38a7a", "Entrevistas"],
  ["1623039405147-547794f92e9e", "El cartón de la semana"],
  ["1567506476376-1282584643ca", "Al aire por Xti-Tv"]
];

const ig = document.getElementById("ig");
function tile({ href, img, alt, caption, date, tag }, i) {
  const a = document.createElement("a");
  a.href = href; a.target = "_blank"; a.rel = "noopener";
  const im = document.createElement("img");
  im.src = img; im.alt = alt || "Publicación de Instagram"; im.loading = "lazy";
  a.append(im);
  if (tag) { const t = document.createElement("span"); t.className = "tag"; t.textContent = tag; a.append(t); }
  const c = document.createElement("div"); c.className = "cap";
  if (date) { const tm = document.createElement("time"); tm.textContent = date; c.append(tm); }
  c.append(document.createTextNode(caption || ""));
  a.append(c);
  return a;
}
function renderSample() {
  ig.replaceChildren(...SAMPLE.map(([id, cap], i) =>
    tile({ href: CONFIG.instagramUrl, img: U(id, i ? 700 : 1200), alt: cap, caption: cap }, i)));
}
function short(s, n) { s = (s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n).trimEnd() + "…" : s; }

function setCover(p, fmt) {
  const s = p.sizes || {};
  const big = ((s.large || s.full || s.medium) || {}).mediaUrl || p.thumbnailUrl || p.mediaUrl;
  if (!big) return;
  const hero = document.querySelector(".hero"), bg = hero.querySelector(".bg img"), feat = document.getElementById("feat");
  const d = p.timestamp ? new Date(p.timestamp) : null;
  bg.src = big; bg.alt = "";
  feat.href = p.permalink || CONFIG.instagramUrl;
  feat.querySelector("img").src = big;
  feat.querySelector("img").alt = short(p.prunedCaption || p.caption, 120) || "Última publicación en Instagram";
  feat.querySelector("b").textContent = "Última publicación" + (d && !isNaN(d) ? " · " + fmt.format(d) : "");
  feat.querySelector("span").textContent = short(p.prunedCaption || p.caption, 110);
  hero.classList.add("has-feat"); feat.hidden = false;
}

async function loadFeed() {
  if (!CONFIG.beholdFeedUrl) return renderSample();
  try {
    const r = await fetch(CONFIG.beholdFeedUrl);
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    const posts = (Array.isArray(data) ? data : data.posts || []).slice(0, CONFIG.maxPosts);
    if (!posts.length) throw new Error("sin publicaciones");
    const fmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" });
    setCover(posts[0], fmt);
    ig.replaceChildren(...posts.map((p, i) => {
      const s = p.sizes || {};
      const pick = i ? (s.medium || s.large || s.small) : (s.large || s.full || s.medium);
      const img = (pick && pick.mediaUrl) || p.thumbnailUrl || p.mediaUrl;
      const d = p.timestamp ? new Date(p.timestamp) : null;
      return tile({
        href: p.permalink || CONFIG.instagramUrl, img,
        alt: short(p.prunedCaption || p.caption, 120),
        caption: short(p.prunedCaption || p.caption, i ? 90 : 200),
        date: d && !isNaN(d) ? fmt.format(d) : "",
        tag: p.mediaType === "VIDEO" ? (p.isReel ? "Reel" : "Video") : p.mediaType === "CAROUSEL_ALBUM" ? "Álbum" : ""
      }, i);
    }));
  } catch (e) {
    console.warn("No se pudo cargar el feed de Instagram:", e);
    renderSample();
  }
}
loadFeed();

const tk = document.querySelector(".ticker div"); if (tk) tk.innerHTML += tk.innerHTML;
