'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DisciplinaI } from '@/utils/types/disciplinas';
import { BookIcon } from '@/components/Icons';
import '../styles/home.css';

const DisciplinaCardSkeleton = () => (
  <div className="disciplina-card skeleton">
    <div className="skeleton-icon"></div>
    <div className="skeleton-text"></div>
  </div>
);

export default function HomePage() {
  const [disciplinas, setDisciplinas] = useState<DisciplinaI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/disciplinas`);
        if (!response.ok) throw new Error('Não foi possível carregar as disciplinas.');
        const data: DisciplinaI[] = await response.json();
        setDisciplinas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisciplinas();
  }, []);

  return (
    <main className="container selection-container">
      <div className="selection-header">
        <h1 className="selection-title">Explore o Conhecimento</h1>
        <p className="selection-subtitle">
          Selecione uma disciplina abaixo para ver as perguntas ou fazer uma nova.
        </p>
      </div>

      <div className="disciplinas-grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <DisciplinaCardSkeleton key={index} />)
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          disciplinas.map((disciplina) => (
            <Link
              href={`/disciplinas/${disciplina.id}`}
              key={disciplina.id}
              className="disciplina-card"
            >
              <div className="disciplina-card-icon">
                <BookIcon />
              </div>
              <span className="disciplina-card-title">{disciplina.nome}</span>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}