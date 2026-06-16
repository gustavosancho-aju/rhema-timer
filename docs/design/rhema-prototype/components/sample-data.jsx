// sample-data.jsx — shared placeholder content for all variations

const SAMPLE_TRANSCRIPT = [
  { t: '19:42:08', text: 'E a fé que te trouxe até aqui não é a mesma que vai te levar adiante.', speaker: 'Pastora' },
  { t: '19:42:21', text: 'Deus não está interessado no que você construiu para ser visto.', speaker: 'Pastora' },
  { t: '19:42:34', text: 'Ele está interessado no que você é quando ninguém está olhando.', speaker: 'Pastora' },
  { t: '19:42:49', text: 'Porque a intimidade com o Pai nasce no secreto, não no palco.', speaker: 'Pastora' },
  { t: '19:43:05', text: 'E é no secreto que Ele recompensa.', speaker: 'Pastora' },
  { t: '19:43:18', text: 'Você não precisa ser visto. Você precisa ser encontrado por Ele.', speaker: 'Pastora' },
];

// Words appearing now, building a live paragraph
const LIVE_PARAGRAPH = 'A promessa que Deus fez a você não depende do tempo que você levou para acreditar. Ela já está escrita. E o que está escrito,';
const LIVE_STREAMING_WORDS = ['ninguém', 'apaga.'];

const SAMPLE_CAPTIONS = [
  {
    direcionamento: 'emotiva',
    icon: 'heart',
    color: '#8FD8DC',
    texto:
`Você não precisa ser visto.
Precisa ser encontrado por Ele.

A intimidade com o Pai nasce no secreto, longe do palco — e é ali, onde ninguém aplaude, que Ele recompensa.

✨ Culto de quarta · Pastora Ana`,
    stats: { chars: 198, words: 34, hashtags: 0 },
  },
  {
    direcionamento: 'reflexiva',
    icon: 'brain',
    color: '#1B5670',
    texto:
`A fé que te trouxe até aqui não é a mesma que vai te levar adiante.

Deus não olha para o que você construiu para ser visto — Ele olha para o que você é quando ninguém está olhando.

— Palavra da Pastora Ana`,
    stats: { chars: 221, words: 40, hashtags: 0 },
  },
];

const SAMPLE_HISTORY = [
  { date: '23 abr', title: 'Culto de quarta · "O Secreto"', duration: '1h 42m', words: 8421, status: 'posted' },
  { date: '20 abr', title: 'Domingo · "A Promessa"', duration: '2h 08m', words: 11204, status: 'posted' },
  { date: '16 abr', title: 'Culto de quarta · "Consagração"', duration: '1h 38m', words: 7980, status: 'draft' },
  { date: '13 abr', title: 'Domingo · "Tempo de Colher"', duration: '2h 14m', words: 11890, status: 'posted' },
  { date: '09 abr', title: 'Culto de quarta · "Aliança"', duration: '1h 29m', words: 7204, status: 'posted' },
];

const AGENT_STEPS = [
  { label: 'Lendo a transcrição', status: 'done', detail: '8 421 palavras · 1h 42m' },
  { label: 'Identificando temas centrais', status: 'done', detail: 'secreto · intimidade · recompensa' },
  { label: 'Cruzando com referências', status: 'done', detail: '@cnaracaju · @cnfortaleza · Bethel' },
  { label: 'Gerando 2 direcionamentos', status: 'active', detail: 'emotiva · reflexiva' },
];

Object.assign(window, {
  SAMPLE_TRANSCRIPT, LIVE_PARAGRAPH, LIVE_STREAMING_WORDS,
  SAMPLE_CAPTIONS, SAMPLE_HISTORY, AGENT_STEPS,
});
