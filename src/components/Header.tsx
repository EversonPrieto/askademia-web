'use client'

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthContext";
import { MenuIcon, LogoutIcon } from './Icons';
import '../styles/header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true); // Para o header mobile
  const lastScrollY = useRef(0); 

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Lógica de visibilidade apenas para o header mobile
      if (currentScrollY <= 60) {
        setIsVisible(true);
      } 
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } 
      else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => setIsMenuOpen(false); // Fecha o menu mobile ao clicar em um link

  const handleLogout = () => {
    handleLinkClick(); // Fecha o menu mobile (se aberto)
    logout();
  };

  // Define os itens do menu para ambos mobile e desktop
  const navItems = user
    ? [{ label: 'Home', path: '/' }]
    : [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' },
        { label: 'Cadastre-se', path: '/cadastro' },
      ];

  return (
    <>
      {/* 
        Header para Mobile (será escondido no desktop via CSS) 
        A lógica de 'isVisible' se aplica a este elemento.
      */}
      <header className={`mobile-header-container ${isVisible ? 'visible' : 'hidden'}`}>
        <nav className="nav-bar">
          <button onClick={toggleMenu} className="menuButton" aria-label="Abrir ou fechar menu">
            <MenuIcon />
          </button>
          <Link href="/" className="nav-title-link">
            <h1 className="nav-title">Askademia</h1>
          </Link>
        </nav>

        {isMenuOpen && (
          <div className="dropdownMenu">
            {user && (
              <div className="user-info">
                <span>Bem-vindo, <strong>{user.nome}</strong>!</span>
              </div>
            )}
            
            {navItems.map((item) => (
              <Link href={item.path} key={item.path} className="menuLink" onClick={handleLinkClick}>
                {item.label}
              </Link>
            ))}

            {user && (
              <>
                <hr className="menu-divider" />
                <button onClick={handleLogout} className="menuLink logout-button">
                  <LogoutIcon />
                  Sair
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* 
        Sidebar para Desktop (será escondida no mobile via CSS)
        Esta sidebar é sempre visível no desktop e não tem a lógica de 'isVisible'.
      */}
      <aside className="desktop-sidebar">
        <Link href="/" className="sidebar-title-link">
          <h1 className="sidebar-title">Askademia</h1>
        </Link>
        
        <nav className="sidebar-nav">
          {user && (
            <div className="sidebar-user-info">
              <span>Bem-vindo, <strong>{user.nome}</strong>!</span>
            </div>
          )}

          {navItems.map((item) => (
            <Link href={item.path} key={item.path} className="sidebar-link">
              {item.label}
            </Link>
          ))}

          {user && (
            <>
              <hr className="sidebar-divider" />
              <button onClick={handleLogout} className="sidebar-logout-button">
                <LogoutIcon />
                Sair
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}