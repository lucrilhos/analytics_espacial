// Paleta de cores para os dois temas do app
// "Modo Espaço" = tema escuro inspirado no cosmos
// "Modo Terra"  = tema claro inspirado no planeta azul

export const Temas = {
  espaco: {
    nome: 'espaco',
    nomeLegivel: 'Modo Espaço 🚀',
    fundo: '#0a0e1a',
    fundoCard: '#111827',
    fundoSecundario: '#1a2235',
    texto: '#e2e8f0',
    textoSecundario: '#94a3b8',
    destaque: '#38bdf8',
    destaqueSecundario: '#818cf8',
    sucesso: '#4ade80',
    aviso: '#facc15',
    perigo: '#f87171',
    borda: '#1e293b',
    tabBar: '#0d1424',
    tabBarAtivo: '#38bdf8',
    tabBarInativo: '#475569',
    gradiente: ['#0a0e1a', '#111827'],
  },
  terra: {
    nome: 'terra',
    nomeLegivel: 'Modo Terra 🌍',
    fundo: '#f0f4f8',
    fundoCard: '#ffffff',
    fundoSecundario: '#e2e8f0',
    texto: '#1e293b',
    textoSecundario: '#64748b',
    destaque: '#0284c7',
    destaqueSecundario: '#6366f1',
    sucesso: '#16a34a',
    aviso: '#d97706',
    perigo: '#dc2626',
    borda: '#cbd5e1',
    tabBar: '#ffffff',
    tabBarAtivo: '#0284c7',
    tabBarInativo: '#94a3b8',
    gradiente: ['#f0f4f8', '#e2e8f0'],
  },
};

// Limiares padrão para geração de alertas automáticos
export const LIMIARES_PADRAO = {
  temperatura: { aviso: 70, critico: 90 },     // em °C
  energia: { aviso: 30, critico: 15 },          // em % da capacidade
  sinal: { aviso: 40, critico: 20 },            // em % de qualidade
  estabilidade: { aviso: 60, critico: 40 },     // em % de estabilidade orbital
  pressao: { aviso: 80, critico: 95 },          // em kPa
};
