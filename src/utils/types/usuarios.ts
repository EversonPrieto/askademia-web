export type TipoUsuario = "ALUNO" | "MONITOR" | "PROFESSOR";

export interface UsuarioI {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}