export type TipoUsuario = "ALUNO" | "MONITOR" | "PROFESSOR";

export interface UsuarioI {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}

export interface CadastroFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}