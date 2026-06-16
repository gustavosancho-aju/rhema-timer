// timer-sample-data.jsx — shared data for all 5 Timer interfaces

const TIMER_ROOMS = [
  { id: 'abc123', name: 'Culto Dom · 26/abr', timers: 6, status: 'ativa', connections: 4, last: 'agora' },
  { id: 'def456', name: 'Conferência Jovens', timers: 14, status: 'idle', connections: 0, last: '3 dias' },
  { id: 'ghi789', name: 'Ensaio técnico', timers: 4, status: 'idle', connections: 0, last: '1 sem' },
  { id: 'jkl012', name: 'Culto Qua · 29/abr', timers: 5, status: 'rascunho', connections: 0, last: '—' },
];

const TIMERS = [
  { id: 1, title: 'Louvor de abertura', presenter: 'Banda', dur: '00:18:00', type: 'countdown', color: '#2E6A7A', status: 'done', order: 1 },
  { id: 2, title: 'Boas-vindas', presenter: 'Pastor Lucas', dur: '00:05:00', type: 'countdown', color: '#8FD8DC', status: 'done', order: 2 },
  { id: 3, title: 'Palavra', presenter: 'Pastora Ana', dur: '00:42:00', type: 'countdown', color: '#B0F0F0', status: 'active', order: 3, remaining: '00:08:42', elapsed: 2000 },
  { id: 4, title: 'Ministração', presenter: 'Banda', dur: '00:15:00', type: 'countdown', color: '#1B5670', status: 'pending', order: 4 },
  { id: 5, title: 'Oferta', presenter: 'Diáconos', dur: '00:04:00', type: 'countdown', color: '#8FD8DC', status: 'pending', order: 5 },
  { id: 6, title: 'Avisos + Bênção', presenter: 'Pastor Lucas', dur: '00:06:00', type: 'countdown', color: '#ff6b6b', status: 'pending', order: 6 },
];

const MESSAGE_HISTORY = [
  { t: '19:23', color: 'white', text: 'Reduzir volume do retorno' },
  { t: '19:31', color: 'green', text: 'Pode seguir, palco liberado' },
  { t: '19:44', color: 'red', text: 'Últimos 5 minutos' },
];

const CURRENT_MESSAGE = { color: 'red', text: 'Últimos 5 minutos', time: '19:44' };

Object.assign(window, { TIMER_ROOMS, TIMERS, MESSAGE_HISTORY, CURRENT_MESSAGE });
