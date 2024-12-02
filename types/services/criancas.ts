export interface Crianca {
    id: number;
    nome: string;
    dataNascimento: string;
    responsavel: string;
    dataCriacao: string;
    ativo: boolean;
}

export interface EditarCrianca {
    id: number;
    nome: string;
    dataNascimento: string;
    responsavel: string;    
    ativo: boolean;
}

export interface CriarCrianca {
    nome: string;
    dataNascimento: Date | string;     
    responsavel: string;
}