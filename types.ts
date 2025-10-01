export enum LoadStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
}

export interface Carga {
  id: string;
  cargaId: string;
  lojaId: string;
  dateTime: Date;
  status: LoadStatus;
}

export type Setor = 'Câmara Fria' | 'Mezanino' | 'Carga Seca';

export interface Corte {
  id: string;
  codigo: string;
  descricao: string;
  setor: Setor;
}