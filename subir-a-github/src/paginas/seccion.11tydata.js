// Una sección sin notas no se indexa, para no mostrar páginas vacías en Google
module.exports = {
  eleventyComputed: {
    noindex: (data) =>
      !!data.cat && !(data.collections.notas || []).some((n) => n.data.categoria === data.cat.nombre),
  },
};
