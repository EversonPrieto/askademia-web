export interface RespostaI {
  id: number;
  descricao: string;
  createdAt: string;
  usuario: {
    id: number;
    nome: string;
    tipo: "ALUNO" | "MONITOR" | "PROFESSOR";
  };
}