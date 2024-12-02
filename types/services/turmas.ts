export interface CriarTurma {
    nome: string;
    capacidadeMaxima: number;
    idadeMinima: number;
    idadeMaxima: number;
}

export interface AtualizarTurmaDTO {
    id: number;
    nome: string;
    capacidadeMaxima: number;
    idadeMinima: number;
    idadeMaxima: number;
    ativo: boolean;
    criancasIds?: number[];
    agendamentosIds?: number[];
}

export interface TurmaDTO {
    id: number;
    nome: string;
    capacidadeMaxima: number;
    idadeMinima: number;
    idadeMaxima: number;
    dataCriacao: string;
    ativo: boolean;
}

