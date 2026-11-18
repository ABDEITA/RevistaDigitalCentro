// Revista Digital Centro — configuración de Eleventy
const site = require("./src/_data/site.json");

const quitarAcentos = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
const slugCategoria = (nombre) => {
  const c = site.categorias.find((x) => x.nombre === nombre);
  return c ? c.slug : quitarAcentos(nombre).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

module.exports = function (eleventyConfig) {
  // Archivos que se copian tal cual
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js", "src/img": "img", "src/admin": "admin", "src/robots.txt": "robots.txt" });

  // Notas publicadas (sin borradores), de la más nueva a la más vieja
  eleventyConfig.addCollection("notas", (api) =>
    api
      .getFilteredByGlob("src/notas/*.md")
      .filter((n) => !n.data.borrador)
      .sort((a, b) => b.date - a.date)
  );

  // Filtros
  const fmtLarga = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Mexico_City" });
  const fmtCorta = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Mexico_City" });
  eleventyConfig.addFilter("fechaLarga", (d) => fmtLarga.format(new Date(d)));
  eleventyConfig.addFilter("fechaCorta", (d) => fmtCorta.format(new Date(d)));
  eleventyConfig.addFilter("isoFecha", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("rfcFecha", (d) => new Date(d).toUTCString());
  eleventyConfig.addFilter("diaFecha", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("head", (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : arr));
  eleventyConfig.addFilter("slugCategoria", slugCategoria);
  eleventyConfig.addFilter("deCategoria", (arr, nombre) => (arr || []).filter((n) => n.data.categoria === nombre));
  eleventyConfig.addFilter("relacionadas", (arr, url, nombre) =>
    (arr || []).filter((n) => n.url !== url && n.data.categoria === nombre).slice(0, 3)
  );
  eleventyConfig.addFilter("minutosLectura", (html) => {
    const palabras = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(palabras / 220));
  });
  eleventyConfig.addFilter("textoPlano", (html) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v ?? ""));
  eleventyConfig.addFilter("xml", (s) =>
    String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
  );
  eleventyConfig.addFilter("urlEncode", (s) => encodeURIComponent(String(s ?? "")));
  eleventyConfig.addFilter("fechaMasReciente", (arr) =>
    (arr && arr.length ? new Date(Math.max(...arr.map((n) => new Date(n.data.actualizado || n.date)))) : new Date()).toISOString()
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
};
