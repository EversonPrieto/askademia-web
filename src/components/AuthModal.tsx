'use client'

import Link from 'next/link';
import { CloseIcon } from './Icons';
import '../styles/home.css'; 

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) {
    return null; 
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <h3 className="modal-title">Acesso Necessário</h3>
        <p className="modal-text">
          Para interagir e fazer parte da comunidade Askademia, você precisa estar conectado.
        </p>
        
        <div className="modal-actions">
          <Link href="/login" className="modal-button login">
            Entrar
          </Link>
          <Link href="/cadastro" className="modal-button register">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}