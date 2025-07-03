'use client'

import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import '@/styles/login.css';

type LoginFormData = {
  email: string;
  senha: string;
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>(); 
  const { login } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <section className='login'>
      <main className='main-login'>
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit(handleLogin)} noValidate>
          <label>
            <i className="far fa-envelope" aria-hidden="true"></i>
            <input
              type="email"
              placeholder="Digite seu email"
              required
              aria-label="Digite seu email"
              {...register("email", { required: true })}
            />
          </label>
          <label>
            <i className="fas fa-lock" aria-hidden="true"></i>
            <input
              type="password"
              placeholder="Digite sua senha"
              required
              aria-label="Digite sua senha"
              {...register("senha", { required: true })}
            />
            <button type="button" className="show-password" tabIndex={-1} aria-label="Mostrar senha">
              <i className="far fa-eye"></i>
            </button>
          </label>
          <div className="forgot-password">Esqueceu a senha?</div>
          <button type="submit" className="submit">Acessar</button>
        </form>
        <p className="register">
          Ainda não tem conta?
          <Link href="/cadastro"> Cadastre-se</Link>
        </p>
      </main>
    </section>
  );
}