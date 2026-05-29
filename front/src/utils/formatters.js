// Gera uma cor de fundo baseada no nome (para avatares)
export function getAvatarColor(name = '') {
  const colors = ['#7c3aed', '#db2777', '#0891b2', '#059669', '#d97706', '#dc2626', '#4f46e5'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// Formata data ISO para pt-BR (ex: "29 de mai. de 2026")
export function formatarData(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}
