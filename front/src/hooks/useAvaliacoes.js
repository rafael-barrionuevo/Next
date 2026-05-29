import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook que encapsula toda a lógica de avaliações de um conteúdo.
 * @param {string} conteudoId - ID do conteúdo
 * @param {string} currentUserId - ID do usuário logado
 * @param {object} perfilAtivo - Perfil ativo (com _id)
 * @param {boolean} isAuthenticated
 */
export function useAvaliacoes(conteudoId, currentUserId, perfilAtivo, isAuthenticated) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [minhaAvaliacao, setMinhaAvaliacao] = useState(null);
  const [rating, setRating] = useState(0);
  const [formNota, setFormNota] = useState(5);
  const [formComentario, setFormComentario] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchAvaliacoes = useCallback(async () => {
    try {
      const response = await api.get(`/conteudos/${conteudoId}/avaliacoes`);
      const data = response.data;

      // Calcula média para o rating geral
      if (data.length > 0) {
        const total = data.reduce((acc, curr) => acc + curr.nota, 0);
        let average = total / data.length;
        const dec = average % 1;
        average = dec === 0.5 ? Math.floor(average) + 0.5 : Math.round(average);
        setRating(average);
      } else {
        setRating(0);
      }

      // Detecta avaliação do PERFIL ativo
      let minha = null;
      if (currentUserId) {
        const perfilId = perfilAtivo?._id?.toString() || null;
        if (perfilId) {
          minha = data.find(a => a.perfilId === perfilId && (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId));
        } else {
          minha = data.find(a =>
            (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId) && !a.perfilId
          );
        }
      }
      setMinhaAvaliacao(minha || null);
      if (minha) {
        setFormNota(minha.nota);
        setFormComentario(minha.comentario || '');
      } else {
        setFormNota(5);
        setFormComentario('');
      }

      // Ordena: perfil ativo primeiro → outros perfis do mesmo user → resto (nota desc)
      const sorted = [...data].sort((a, b) => {
        const perfilId = perfilAtivo?._id?.toString() || null;
        const aIsMe = perfilId
          ? a.perfilId === perfilId
          : (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId) && !a.perfilId;
        const bIsMe = perfilId
          ? b.perfilId === perfilId
          : (b.usuarioId === currentUserId || b.usuarioId?._id === currentUserId) && !b.perfilId;
        const aIsSameUser = !aIsMe && (a.usuarioId === currentUserId || a.usuarioId?._id === currentUserId);
        const bIsSameUser = !bIsMe && (b.usuarioId === currentUserId || b.usuarioId?._id === currentUserId);

        if (aIsMe && !bIsMe) return -1;
        if (!aIsMe && bIsMe) return 1;
        if (aIsSameUser && !bIsSameUser) return -1;
        if (!aIsSameUser && bIsSameUser) return 1;
        return b.nota - a.nota;
      });
      setAvaliacoes(sorted);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  }, [conteudoId, currentUserId, perfilAtivo]);

  useEffect(() => {
    if (conteudoId) fetchAvaliacoes();
  }, [conteudoId, fetchAvaliacoes]);

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const targetId = editingId || minhaAvaliacao?._id;
      if (targetId) {
        await api.patch(`/avaliacoes/${targetId}`, {
          nota: Number(formNota),
          comentario: formComentario,
        });
        setEditingId(null);
      } else {
        await api.post('/avaliacoes', {
          conteudoId,
          nota: Number(formNota),
          comentario: formComentario,
          perfilId: perfilAtivo?._id?.toString() || null,
        });
      }
      setSubmitStatus('success');
      await fetchAvaliacoes();
    } catch (err) {
      setSubmitStatus('error');
      setSubmitError(err.response?.data?.error || 'Erro ao enviar avaliação.');
    }
  };

  return {
    avaliacoes,
    minhaAvaliacao,
    rating,
    formNota, setFormNota,
    formComentario, setFormComentario,
    submitStatus, setSubmitStatus,
    submitError,
    editingId, setEditingId,
    handleSubmitAvaliacao,
  };
}
