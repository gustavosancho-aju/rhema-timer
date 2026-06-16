/**
 * Tipos compartilhados do domínio RHEMA.
 */

export type TipoDeteccao = "citacao_direta" | "alusao";

export type VersiculoDetectado = {
  livro: string;
  capitulo: number;
  versiculo_inicio: number;
  versiculo_fim: number;
  texto_sugerido: string;
  confianca: number;
  tipo: TipoDeteccao;
  justificativa?: string;
};

export type RespostaDetector =
  | ({ detectou: true } & VersiculoDetectado)
  | { detectou: false; erro?: string };

export type StatusSugestao =
  | "pendente"
  | "enviando"
  | "exibido"
  | "erro"
  | "descartado";

export type SugestaoVersiculo = VersiculoDetectado & {
  id: string;
  detectadoEm: number; // timestamp
  status: StatusSugestao;
  erroMensagem?: string;
};

export type HolyricsConfigLocal = {
  token: string;
  host: string;
  port: string;
};
