/**
 * Categoriza uma lista de conteúdos em grupos mutuamente exclusivos para reduzir repetição.
 * 
 * @param {Array} items Lista de filmes ou séries
 * @returns {{
 *   animacaoInfantil: Array,
 *   ficcaoTerror: Array,
 *   crimeSuspense: Array,
 *   acaoAventura: Array,
 *   dramaHistorico: Array
 * }}
 */
export function categorizeContent(items = []) {
  const animacaoInfantil = [];
  const ficcaoTerror = [];
  const crimeSuspense = [];
  const acaoAventura = [];
  const dramaHistorico = [];

  items.forEach(item => {
    const genres = item.genero || [];

    // Priority 1: Animação, Infantil, Família, Paródia, Comédia
    if (genres.some(g => ['animação', 'infantil', 'família', 'paródia', 'comédia'].includes(g.toLowerCase()))) {
      animacaoInfantil.push(item);
    }
    // Priority 2: Ficção Científica, Sci-Fi, Terror
    else if (genres.some(g => ['ficção científica', 'sci-fi', 'terror'].includes(g.toLowerCase()))) {
      ficcaoTerror.push(item);
    }
    // Priority 3: Crime, Suspense
    else if (genres.some(g => ['crime', 'suspense'].includes(g.toLowerCase()))) {
      crimeSuspense.push(item);
    }
    // Priority 4: Ação, Aventura, Fantasia
    else if (genres.some(g => ['ação', 'aventura', 'fantasia'].includes(g.toLowerCase()))) {
      acaoAventura.push(item);
    }
    // Priority 5: Drama, Histórico
    else if (genres.some(g => ['drama', 'histórico'].includes(g.toLowerCase()))) {
      dramaHistorico.push(item);
    }
  });

  return {
    animacaoInfantil,
    ficcaoTerror,
    crimeSuspense,
    acaoAventura,
    dramaHistorico
  };
}
