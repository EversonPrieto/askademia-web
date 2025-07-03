'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PerguntaI } from '@/utils/types/perguntas';
import { TipoUsuario } from '@/utils/types/usuarios';
import { OrangeCircleIcon, CommentIcon, ProfessorStarIcon, MonitorStarIcon } from '@/components/Icons';
import AuthModal from '@/components/AuthModal';
import '@/styles/home.css';

const UserDisplay = ({ usuario }: { usuario: { nome: string; tipo: TipoUsuario } }) => {
  if (usuario.tipo === 'ALUNO') return <span>Aluno</span>;
  return (
    <>
      <span>{usuario.nome}</span>
      {usuario.tipo === 'PROFESSOR' && <ProfessorStarIcon />}
      {usuario.tipo === 'MONITOR' && <MonitorStarIcon />}
    </>
  );
};

const NewQuestionForm = ({ disciplinaId, onQuestionAsked, onAuthRequired }: { disciplinaId: number; onQuestionAsked: () => void; onAuthRequired: () => void; }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    if (!title.trim()) {
      toast.error('Por favor, escreva sua pergunta.');
      return;
    }
    
    setIsSubmitting(true);
    // A descrição é enviada como uma string vazia, como era originalmente
    const newQuestionData = { titulo: title, descricao: "", usuarioId: user.id, disciplinaId };
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/perguntas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestionData),
      });

      if (!response.ok) throw new Error('Erro ao enviar a pergunta.');
      
      toast.success('Sua pergunta foi enviada!');
      setTitle('');
      onQuestionAsked();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível enviar a pergunta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="questionInputWrapper">
      <OrangeCircleIcon />
      <input
        type="text"
        className="questionInput"
        placeholder={user ? "Qual é a sua dúvida?" : "Faça login para perguntar"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={!user || isSubmitting}
      />
      <button className="askButton" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Perguntar'}
      </button>
    </div>
  );
};

const QuestionBlock = ({ item, onReplyPosted, onAuthRequired }: { item: PerguntaI; onReplyPosted: () => void; onAuthRequired: () => void; }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const rolePriority: Record<TipoUsuario, number> = { PROFESSOR: 3, MONITOR: 2, ALUNO: 1 };
  const sortedAnswers = [...item.respostas].sort((a, b) => {
    const priorityA = rolePriority[a.usuario.tipo] || 1;
    const priorityB = rolePriority[b.usuario.tipo] || 1;
    if (priorityA !== priorityB) return priorityB - priorityA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleToggleReply = () => {
    if (!user) onAuthRequired();
    else setIsReplying(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !user) return;
    setIsSubmitting(true);
    const replyData = { descricao: replyText, perguntaId: item.id, usuarioId: user.id };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/respostas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyData),
      });

      if (!response.ok) throw new Error('Erro ao enviar a resposta.');
      
      toast.success('Sua resposta foi enviada!');
      setReplyText('');
      setIsReplying(false);
      onReplyPosted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível enviar a resposta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="questionBlock">
      {/* Exibição do autor da pergunta */}
      <div className="questionMeta">
        <OrangeCircleIcon />
        <UserDisplay usuario={item.usuario} />
      </div>

      <div className="questionBox">
        <span>{item.titulo}</span>
        {item.respostas.length > 0 && <div className="responseCount"><CommentIcon /><span>{item.respostas.length} Respostas</span></div>}
      </div>
      
      <div className="answersList">
        {sortedAnswers.map((answer) => (
          <div className="answerItem" key={answer.id}>
            <div className="answerMeta"><OrangeCircleIcon /><UserDisplay usuario={answer.usuario} /></div>
            <div className="answerBubble"><span>{answer.descricao}</span></div>
          </div>
        ))}
      </div>
      
      <div className="replyAction">
        {!isReplying && <button className="replyToggleButton" onClick={handleToggleReply}>Responder</button>}
        {isReplying && user && <div className="replyForm"><textarea className="replyTextarea" rows={3} placeholder="Escreva sua resposta aqui..." value={replyText} onChange={(e) => setReplyText(e.target.value)} disabled={isSubmitting} /><button className="replySubmitButton" onClick={handleSubmitReply} disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Enviar Resposta'}</button></div>}
      </div>
    </div>
  );
};

export default function ForumPorDisciplinaPage() {
  const params = useParams();
  const disciplinaId = Number(params.id);

  const [questions, setQuestions] = useState<PerguntaI[]>([]);
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fetchForumData = useCallback(async () => {
    if (!disciplinaId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const [disciplinaRes, perguntasRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_URL_API}/disciplinas/${disciplinaId}`),
        fetch(`${process.env.NEXT_PUBLIC_URL_API}/disciplinas/${disciplinaId}/perguntas`)
      ]);

      if (!disciplinaRes.ok || !perguntasRes.ok) {
        throw new Error('Não foi possível carregar os dados do fórum.');
      }
      
      const disciplinaData = await disciplinaRes.json();
      const perguntasData: PerguntaI[] = await perguntasRes.json();
      
      perguntasData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setDisciplinaNome(disciplinaData.nome);
      setQuestions(perguntasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  }, [disciplinaId]); 

  useEffect(() => {
    fetchForumData();
  }, [fetchForumData]);

  const renderContent = () => {
    if (isLoading) return <p>Carregando fórum...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (questions.length === 0) return <p>Ainda não há perguntas nesta disciplina. Seja o primeiro a perguntar!</p>;

    return questions.map((item, index) => (
      <div key={item.id}>
        <QuestionBlock 
          item={item} 
          onReplyPosted={fetchForumData} 
          onAuthRequired={() => setIsAuthModalOpen(true)}
        />
        {index < questions.length - 1 && <hr className="divider" />}
      </div>
    ));
  };

  return (
    <>
      <main className="container">
        <h1 className="forum-title">Fórum de: <strong>{disciplinaNome || '...'}</strong></h1>
        
        <NewQuestionForm 
          disciplinaId={disciplinaId} 
          onQuestionAsked={fetchForumData} 
          onAuthRequired={() => setIsAuthModalOpen(true)}
        />
        
        <hr className="divider" />
        <h2 className="sectionTitle">Outros usuários já perguntaram....</h2>
        <div className="qaFeed">{renderContent()}</div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}