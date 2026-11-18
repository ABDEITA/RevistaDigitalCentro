// Valores por defecto para todas las notas de esta carpeta
module.exports = {
  layout: "nota.njk",
  tipo: "nota",
  autor: "Redacción RD Centro",
  eleventyComputed: {
    // Los borradores no se publican
    permalink: (data) => (data.borrador ? false : `/notas/${data.page.fileSlug}/`),
  },
};
