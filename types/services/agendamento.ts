import { Crianca } from "./criancas";
import { TurmaDTO } from "./turmas";

export interface CriarAgendamentoDTO {
    idCrianca: number;
    idTurma: number;
    dataInicial: string | Date;
    dataFinal: string | Date;
    observacao?: string;
}

export interface AtualizarAgendamentoDTO {
    id: number;
    idCrianca: number;
    idTurma: number;
    dataInicial: string | Date;
    dataFinal: string | Date;
    observacoes: string;
}


export interface AgendamentoDTO {
    id: number;
    dataInicial: string | Date;
    dataFinal: string | Date;
    observacao?: string;
    crianca: Crianca;
    turma: TurmaDTO;
    dataCriacao: string;
    ativo: boolean;
}
