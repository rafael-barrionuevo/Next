import { useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { getAvatarColor, formatarData } from '../utils/formatters';

/**
 * Seção completa de avaliações: formulário de criação, lista de cards, edição inline.
 */
export default function AvaliacaoSection({
  isAuthenticated, currentUserId,
  avaliacoes, minhaAvaliacao,
  formNota, setFormNota,
  formComentario, setFormComentario,
  submitStatus, setSubmitStatus,
  submitError,
  editingId, setEditingId,
  handleSubmitAvaliacao,
}) {
  const navigate = useNavigate();

  return (
    <div className='relative z-10 px-4 max-w-7xl mx-auto w-full mt-10 mb-8'>
      <h2 className='text-2xl font-bold text-white border-l-4 border-purple-600 pl-3 mb-8'>
        Avaliações e Comentários
      </h2>

      {/* Formulário: só aparece para usuários logados sem avaliação do perfil ativo */}
      {isAuthenticated && !minhaAvaliacao && (
        <form
          onSubmit={handleSubmitAvaliacao}
          className='bg-[#1a1a1c] border border-white/5 rounded-2xl p-6 mb-10'
        >
          <h3 className='text-lg font-semibold text-white mb-5'>Deixe sua avaliação</h3>

          <div className='mb-5'>
            <label className='block text-sm font-medium text-gray-400 mb-2'>
              Nota <span className='text-purple-400 font-bold text-base ml-1'>{(formNota / 2).toFixed(1)}</span>
              <span className='text-gray-500'>/5.0</span>
            </label>
            <div className='flex items-center gap-4 [&_svg]:inline-block'>
              <Rating
                onClick={(rate) => setFormNota(rate * 2)}
                initialValue={formNota / 2}
                allowFraction={true}
                size={32}
                fillColor="#9333ea"
                emptyColor="#374151"
              />
            </div>
          </div>

          <div className='mb-5'>
            <label htmlFor='comentario-new' className='block text-sm font-medium text-gray-400 mb-2'>
              Comentário <span className='text-gray-600'>(opcional, máx. 500 caracteres)</span>
            </label>
            <textarea
              id='comentario-new'
              value={formComentario}
              onChange={e => setFormComentario(e.target.value)}
              maxLength={500} rows={3}
              placeholder='Conte o que achou deste conteúdo...'
              className='w-full bg-[#0d1117] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-gray-600 resize-none text-sm transition-colors duration-200'
            />
            <p className='text-xs text-gray-600 text-right mt-1'>{formComentario.length}/500</p>
          </div>

          <SubmitFeedback status={submitStatus} error={submitError} />

          <button
            type='submit'
            disabled={submitStatus === 'loading'}
            className='bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold py-2.5 px-8 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer text-sm'
          >
            {submitStatus === 'loading' ? 'Enviando...' : 'Enviar avaliação'}
          </button>
        </form>
      )}

      {!isAuthenticated && (
        <div className='bg-[#1a1a1c] border border-white/5 rounded-2xl p-6 mb-10 text-center'>
          <p className='text-gray-400 text-sm'>
            <button onClick={() => navigate('/login')} className='text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 cursor-pointer'>
              Faça login
            </button>
            {' '}para deixar sua avaliação.
          </p>
        </div>
      )}

      {/* Lista de avaliações */}
      {avaliacoes.length === 0 ? (
        <p className='text-gray-500 text-sm text-center py-8'>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {avaliacoes.map(av => (
            <AvaliacaoCard
              key={av._id}
              av={av}
              isOwn={currentUserId && (av.usuarioId === currentUserId || av.usuarioId?._id === currentUserId)}
              isEditing={editingId === av._id}
              formNota={formNota} setFormNota={setFormNota}
              formComentario={formComentario} setFormComentario={setFormComentario}
              submitStatus={submitStatus} setSubmitStatus={setSubmitStatus}
              submitError={submitError}
              onEdit={() => {
                setEditingId(av._id);
                setFormNota(av.nota);
                setFormComentario(av.comentario || '');
                setSubmitStatus('idle');
              }}
              onCancelEdit={() => { setEditingId(null); setSubmitStatus('idle'); }}
              onSubmit={handleSubmitAvaliacao}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sub-componente: Card de avaliação individual ───
function AvaliacaoCard({
  av, isOwn, isEditing,
  formNota, setFormNota,
  formComentario, setFormComentario,
  submitStatus, submitError,
  onEdit, onCancelEdit, onSubmit,
}) {
  return (
    <div className='bg-[#1a1a1c] border border-white/5 rounded-2xl p-5 hover:border-purple-600/30 transition-all duration-200'>
      <div className='flex gap-4'>
        {/* Avatar */}
        <div
          className='w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg select-none shadow-lg'
          style={{ backgroundColor: getAvatarColor(av.nome_perfil || av.nome_usuario) }}
        >
          {(av.nome_perfil || av.nome_usuario)?.charAt(0).toUpperCase() || '?'}
        </div>

        <div className='flex-1 min-w-0'>
          {/* Cabeçalho */}
          <div className='flex flex-wrap items-center gap-2 mb-1'>
            <span className='text-white font-semibold text-sm'>
              {av.nome_perfil || av.nome_usuario}
            </span>
            {av.nome_perfil && av.nome_perfil !== av.nome_usuario && (
              <span className='text-gray-500 text-xs'>({av.nome_usuario})</span>
            )}
            {av.data && (
              <span className='text-gray-500 text-xs ml-auto'>{formatarData(av.data)}</span>
            )}
          </div>

          {/* Estrelas 0–5 */}
          <div className='flex items-center gap-2 mb-2'>
            <div className='flex items-center [&_svg]:inline-block'>
              <Rating
                key={av._id}
                initialValue={av.nota / 2}
                readonly={true}
                allowFraction={true}
                size={16}
                fillColor="#9333ea"
                emptyColor="#374151"
              />
            </div>
            <span className='text-purple-400 text-xs font-bold'>{(av.nota / 2).toFixed(1)}<span className='text-gray-500'>/5</span></span>
          </div>

          {/* Comentário */}
          {!isEditing && (
            av.comentario
              ? <p className='text-gray-300 text-sm leading-relaxed'>{av.comentario}</p>
              : <p className='text-gray-600 text-xs italic'>Sem comentário.</p>
          )}

          {/* Botão editar */}
          {isOwn && !isEditing && (
            <button
              onClick={onEdit}
              className='mt-2 text-xs text-gray-500 hover:text-purple-400 transition-colors duration-200 cursor-pointer'
            >
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Formulário de edição inline */}
      {isEditing && (
        <form onSubmit={onSubmit} className='mt-4 pt-4 border-t border-white/5'>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-400 mb-2'>
              Nota <span className='text-purple-400 font-bold ml-1'>{formNota}</span><span className='text-gray-500'>/10</span>
            </label>
            <div className='flex items-center gap-4 [&_svg]:inline-block'>
              <Rating
                onClick={(rate) => setFormNota(rate * 2)}
                initialValue={formNota / 2}
                allowFraction={true}
                size={28}
                fillColor="#9333ea"
                emptyColor="#374151"
              />
            </div>
          </div>

          <textarea
            value={formComentario}
            onChange={e => setFormComentario(e.target.value)}
            maxLength={500} rows={3}
            placeholder='Seu comentário...'
            className='w-full bg-[#0d1117] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-gray-600 resize-none text-sm mb-3'
          />

          <SubmitFeedback status={submitStatus} error={submitError} successText='Avaliação atualizada!' />

          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={submitStatus === 'loading'}
              className='bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 cursor-pointer text-sm'
            >
              {submitStatus === 'loading' ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type='button'
              onClick={onCancelEdit}
              className='text-gray-400 hover:text-white py-2 px-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer text-sm'
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Sub-componente: Feedback de envio ───
function SubmitFeedback({ status, error, successText = 'Avaliação enviada com sucesso!' }) {
  return (
    <>
      {status === 'error' && (
        <p className='text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2'>{error}</p>
      )}
      {status === 'success' && (
        <p className='text-green-400 text-sm mb-4 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2'>{successText}</p>
      )}
    </>
  );
}
