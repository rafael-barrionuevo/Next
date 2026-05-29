import { useState, useCallback, useEffect } from 'react';

/**
 * Hook que encapsula a lógica de simulação de download e persistência no localStorage.
 */
export function useDownload() {
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [downloadedIds, setDownloadedIds] = useState(new Set());
  const [downloadProgress, setDownloadProgress] = useState({});

  // Carrega downloads existentes do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('next_downloads') || '[]');
    const ids = new Set(saved.map(d => d.downloadId));
    setDownloadedIds(ids);
  }, []);

  const simulateDownload = useCallback((downloadId, onComplete) => {
    setDownloadingIds(prev => new Set(prev).add(downloadId));
    setDownloadProgress(prev => ({ ...prev, [downloadId]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadingIds(prev => { const s = new Set(prev); s.delete(downloadId); return s; });
        setDownloadedIds(prev => new Set(prev).add(downloadId));
        setDownloadProgress(prev => { const p = { ...prev }; delete p[downloadId]; return p; });
        onComplete();
      }
      setDownloadProgress(prev => ({ ...prev, [downloadId]: Math.min(progress, 100) }));
    }, 200);
  }, []);

  const handleDownloadFilme = useCallback((content) => {
    if (!content) return;
    const downloadId = `filme_${content._id}`;
    if (downloadedIds.has(downloadId) || downloadingIds.has(downloadId)) return;

    simulateDownload(downloadId, () => {
      const saved = JSON.parse(localStorage.getItem('next_downloads') || '[]');
      const item = {
        downloadId,
        contentId: content._id,
        titulo: content.titulo,
        img_capa: content.img_capa,
        tipo: 'filme',
      };
      localStorage.setItem('next_downloads', JSON.stringify([...saved, item]));
    });
  }, [downloadedIds, downloadingIds, simulateDownload]);

  const handleDownloadEpisodio = useCallback((content, ep, selectedSeason) => {
    if (!content) return;
    const downloadId = `ep_${ep._id}`;
    if (downloadedIds.has(downloadId) || downloadingIds.has(downloadId)) return;

    simulateDownload(downloadId, () => {
      const saved = JSON.parse(localStorage.getItem('next_downloads') || '[]');
      const item = {
        downloadId,
        contentId: content._id,
        titulo: content.titulo,
        img_capa: content.img_capa,
        tipo: 'serie',
        temporada: selectedSeason,
        episodio: ep.numero,
        tituloEpisodio: ep.titulo,
      };
      localStorage.setItem('next_downloads', JSON.stringify([...saved, item]));
    });
  }, [downloadedIds, downloadingIds, simulateDownload]);

  return {
    downloadingIds,
    downloadedIds,
    downloadProgress,
    handleDownloadFilme,
    handleDownloadEpisodio,
  };
}
