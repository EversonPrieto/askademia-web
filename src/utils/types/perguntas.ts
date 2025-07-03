import type { RespostaI } from './respostas';
import { TipoUsuario } from './usuarios';

export interface PerguntaI {
  id: number;
  titulo: string;
  descricao: string;
  createdAt: string;
  usuario: {
    tipo: TipoUsuario;
    id: number;
    nome: string;
  };
  respostas: RespostaI[]; 
}