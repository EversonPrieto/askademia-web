'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/cadastro.css';

export default function Cadastro() {
    const router = useRouter();

    const [usuario, setUsuario] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({ ...prev, [name]: value }));
        setErro(null); 
        setSucesso(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);
        setSucesso(null);

        const { nome, email, senha, confirmarSenha } = usuario;

        if (!nome || !email || !senha || !confirmarSenha) {
            setErro("Preencha todos os campos.");
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

            const dados = await response.json();

            if (response.ok) {
                setSucesso("Cadastro realizado com sucesso!");
                setTimeout(() => router.push('/login'), 1500);
            } else {
                if (dados.erro) {
                    setErro(dados.erro);
                } else {
                    setErro("Erro ao cadastrar usuário.");
                }
            }
        } catch (error) {
            setErro("Erro de conexão com a API.");
        }
    };

    return (
        <section className="cadastro">
            <main className='main-cadastro'>
                <h1>Cadastre-se</h1>

                {erro && <div className="mensagem erro">{erro}</div>}
                {sucesso && <div className="mensagem sucesso">{sucesso}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <label>
                        <i className="fas fa-user" aria-hidden="true"></i>
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome completo"
                            value={usuario.nome}
                            onChange={handleChange}
                            required
                            aria-label="Digite seu nome"
                        />
                    </label>

                    <label>
                        <i className="far fa-envelope" aria-hidden="true"></i>
                        <input
                            type="email"
                            name="email"
                            placeholder="Digite seu email"
                            value={usuario.email}
                            onChange={handleChange}
                            required
                            aria-label="Digite seu email"
                        />
                    </label>

                    <label className="senha-label">
                        <i className="fas fa-lock" aria-hidden="true"></i>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="senha"
                            placeholder="Digite sua senha"
                            value={usuario.senha}
                            onChange={handleChange}
                            required
                            aria-label="Digite sua senha"
                        />
                        <button
                            type="button"
                            className="show-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            <i className={showPassword ? "far fa-eye-slash" : "far fa-eye"}></i>
                        </button>
                    </label>

                    <label>
                        <i className="fas fa-lock" aria-hidden="true"></i>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmarSenha"
                            placeholder="Confirme sua senha"
                            value={usuario.confirmarSenha}
                            onChange={handleChange}
                            required
                            aria-label="Confirme sua senha"
                        />
                    </label>

                    <button type="submit" className="submit">Cadastrar</button>
                </form>

                <p className="sign-in">
                    Já tem uma conta?
                    <a href="/login"> Entrar</a>
                </p>
            </main>
        </section>
    );
}
