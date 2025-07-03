'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import '../../styles/cadastro.css';
import { CadastroFormData } from '@/utils/types/usuarios';

export default function Cadastro() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<CadastroFormData>();

    const handleCadastro = async (data: CadastroFormData) => {
        setErro(null);
        setSucesso(null);

        const { nome, email, senha, confirmarSenha } = data;
        
        if (!nome || !email || !senha || !confirmarSenha) {
            setErro("Por favor, preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem!");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha }),
            });

            const responseData = await response.json();

            if (response.ok) {
                setSucesso("Cadastro realizado com sucesso! Redirecionando...");
                toast.success("Cadastro bem-sucedido!");
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setErro(responseData.erro || "Erro ao cadastrar usuário.");
            }
        } catch (error) {
            console.error("Erro de conexão com a API:", error);
            setErro("Erro de conexão. Tente novamente mais tarde.");
        }
    };

    return (
        <section className="cadastro">
            <main className='main-cadastro'>
                <h1>Cadastre-se</h1>

                {erro && <div className="mensagem erro">{erro}</div>}
                {sucesso && <div className="mensagem sucesso">{sucesso}</div>}

                <form onSubmit={handleSubmit(handleCadastro)} noValidate>
                    <label>
                        <i className="fas fa-user" aria-hidden="true"></i>
                        <input
                            type="text"
                            placeholder="Nome completo"
                            required
                            {...register("nome")}
                        />
                    </label>

                    <label>
                        <i className="far fa-envelope" aria-hidden="true"></i>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            required
                            {...register("email")}
                        />
                    </label>

                    <label className="senha-label">
                        <i className="fas fa-lock" aria-hidden="true"></i>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            required
                            {...register("senha")}
                        />
                        <button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)}>
                            <i className={showPassword ? "far fa-eye-slash" : "far fa-eye"}></i>
                        </button>
                    </label>

                    <label>
                        <i className="fas fa-lock" aria-hidden="true"></i>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            required
                            {...register("confirmarSenha")}
                        />
                    </label>

                    <button type="submit" className="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>

                <p className="sign-in">
                    Já tem uma conta?
                    <Link href="/login"> Entrar</Link>
                </p>
            </main>
        </section>
    );
}