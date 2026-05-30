import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Temas, LIMIARES_PADRAO } from '../constants/temas';

// ---------------------------------------------------------------------------
// Estado inicial da missão
// ---------------------------------------------------------------------------
const estadoInicial = {
  tema: 'espaco',               // 'espaco' | 'terra'
  missao: null,                 // dados da missão cadastrada
  alertas: [],                  // lista de alertas ativos
  limiares: LIMIARES_PADRAO,    // limiares configuráveis pelo usuário
  historicoMissoes: [],         // missões anteriores persistidas
  carregando: true,
};

// ---------------------------------------------------------------------------
// Reducer — toda mutação de estado passa por aqui
// ---------------------------------------------------------------------------
function reducer(state, action) {
  switch (action.type) {
    case 'CARREGAR_DADOS':
      return { ...state, ...action.payload, carregando: false };

    case 'ALTERNAR_TEMA':
      return { ...state, tema: state.tema === 'espaco' ? 'terra' : 'espaco' };

    case 'SALVAR_MISSAO':
      return {
        ...state,
        missao: action.payload,
        historicoMissoes: [action.payload, ...state.historicoMissoes].slice(0, 10),
      };

    case 'ATUALIZAR_LIMIARES':
      return { ...state, limiares: { ...state.limiares, ...action.payload } };

    case 'ADICIONAR_ALERTA':
      // Evita duplicatas do mesmo tipo+sensor
      const jaExiste = state.alertas.some(
        (a) => a.sensor === action.payload.sensor && a.nivel === action.payload.nivel
      );
      if (jaExiste) return state;
      return { ...state, alertas: [action.payload, ...state.alertas].slice(0, 50) };

    case 'LIMPAR_ALERTA':
      return { ...state, alertas: state.alertas.filter((a) => a.id !== action.payload) };

    case 'LIMPAR_TODOS_ALERTAS':
      return { ...state, alertas: [] };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Criação do contexto
// ---------------------------------------------------------------------------
const MissaoContext = createContext(null);

export function MissaoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);

  // Carrega dados persistidos ao iniciar o app
  useEffect(() => {
    async function carregarDados() {
      try {
        const [temaStr, missaoStr, limiaresStr, historicoStr] = await Promise.all([
          AsyncStorage.getItem('@spa:tema'),
          AsyncStorage.getItem('@spa:missao'),
          AsyncStorage.getItem('@spa:limiares'),
          AsyncStorage.getItem('@spa:historico'),
        ]);

        dispatch({
          type: 'CARREGAR_DADOS',
          payload: {
            tema: temaStr ?? 'espaco',
            missao: missaoStr ? JSON.parse(missaoStr) : null,
            limiares: limiaresStr ? JSON.parse(limiaresStr) : LIMIARES_PADRAO,
            historicoMissoes: historicoStr ? JSON.parse(historicoStr) : [],
          },
        });
      } catch (e) {
        dispatch({ type: 'CARREGAR_DADOS', payload: {} });
      }
    }
    carregarDados();
  }, []);

  // Persiste tema sempre que mudar
  useEffect(() => {
    if (!state.carregando) {
      AsyncStorage.setItem('@spa:tema', state.tema);
    }
  }, [state.tema, state.carregando]);

  // Persiste missão e histórico quando mudam
  useEffect(() => {
    if (!state.carregando && state.missao) {
      AsyncStorage.setItem('@spa:missao', JSON.stringify(state.missao));
      AsyncStorage.setItem('@spa:historico', JSON.stringify(state.historicoMissoes));
    }
  }, [state.missao, state.historicoMissoes]);

  // Persiste limiares quando mudam
  useEffect(() => {
    if (!state.carregando) {
      AsyncStorage.setItem('@spa:limiares', JSON.stringify(state.limiares));
    }
  }, [state.limiares]);

  // Ações expostas para os componentes
  const acoes = {
    alternarTema: () => dispatch({ type: 'ALTERNAR_TEMA' }),
    salvarMissao: (missao) => dispatch({ type: 'SALVAR_MISSAO', payload: missao }),
    atualizarLimiares: (limiares) => dispatch({ type: 'ATUALIZAR_LIMIARES', payload: limiares }),
    adicionarAlerta: (alerta) => dispatch({ type: 'ADICIONAR_ALERTA', payload: alerta }),
    limparAlerta: (id) => dispatch({ type: 'LIMPAR_ALERTA', payload: id }),
    limparTodosAlertas: () => dispatch({ type: 'LIMPAR_TODOS_ALERTAS' }),
  };

  const cores = Temas[state.tema];

  return (
    <MissaoContext.Provider value={{ ...state, cores, ...acoes }}>
      {children}
    </MissaoContext.Provider>
  );
}

// Hook de atalho — uso: const { cores, tema, alertas } = useMissao()
export function useMissao() {
  const ctx = useContext(MissaoContext);
  if (!ctx) throw new Error('useMissao deve ser usado dentro de MissaoProvider');
  return ctx;
}
