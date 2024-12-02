export interface UsuarioDto {
    id: number;
    nome: string;
    email: string;
    cargo: string;
    dataCriacao: string;
    ativo: boolean;
  }
  
  export interface CriarUsuarioDto {
    nome: string;
    email: string;
    cargo: string;
    senha: string;
  }

  export interface AtualizarUsuarioDto {
    id: number;
    nome: string;
    email: string;
    cargo: string;
    ativo: boolean;
  }
  