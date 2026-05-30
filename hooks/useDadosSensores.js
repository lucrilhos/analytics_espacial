import { useState, useEffect, useRef, useCallback } from 'react';
import { useMissao } from '../context/MissaoContext';

// Gera um valor aleatório oscilando em torno de um ponto central
function oscilar(base, amplitude, min, max) {
  const novo = base + (Math.random() - 0.5) * amplitude;
  return Math.min(max, Math.max(min, parseFloat(novo.toFixed(1))));
}

// Formata timestamp para exibição no gráfico
function horaAtual() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export function useDadosSensores(intervaloMs = 2000) {
  const { limiares, adicionarAlerta } = useMissao();

  const [dados, setDados] = useState({
    temperatura: 52,
    energia: 78,
    sinal: 85,
    estabilidade: 92,
    pressao: 62,
    velocidade: 27600,
    altitude: 408,
  });

  // Histórico para os gráficos (últimos 10 pontos)
  const [historico, setHistorico] = useState({
    temperatura: [],
    energia: [],
    sinal: [],
    estabilidade: [],
    labels: [],
  });

  // Referência para os valores atuais sem re-criar o interval
  const dadosRef = useRef(dados);
  dadosRef.current = dados;

  const gerarAlertaSeNecessario = useCallback(
    (sensor, valor) => {
      const limiar = limiares[sensor];
      if (!limiar) return;

      // Verifica se valor ultrapassou limiar crítico ou de aviso
      const critico =
        sensor === 'energia' || sensor === 'sinal' || sensor === 'estabilidade'
          ? valor <= limiar.critico
          : valor >= limiar.critico;

      const aviso =
        sensor === 'energia' || sensor === 'sinal' || sensor === 'estabilidade'
          ? valor <= limiar.aviso
          : valor >= limiar.aviso;

      if (critico) {
        adicionarAlerta({
          id: `${sensor}-critico-${Date.now()}`,
          sensor,
          nivel: 'critico',
          mensagem: `⚠️ ${sensor.toUpperCase()} em nível CRÍTICO: ${valor}`,
          timestamp: new Date().toISOString(),
        });
      } else if (aviso) {
        adicionarAlerta({
          id: `${sensor}-aviso-${Date.now()}`,
          sensor,
          nivel: 'aviso',
          mensagem: `🔶 ${sensor.toUpperCase()} em nível de ATENÇÃO: ${valor}`,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [limiares, adicionarAlerta]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const atual = dadosRef.current;
      const novos = {
        temperatura: oscilar(atual.temperatura, 8, 10, 110),
        energia: oscilar(atual.energia, 5, 5, 100),
        sinal: oscilar(atual.sinal, 10, 0, 100),
        estabilidade: oscilar(atual.estabilidade, 6, 20, 100),
        pressao: oscilar(atual.pressao, 5, 10, 120),
        velocidade: oscilar(atual.velocidade, 200, 25000, 30000),
        altitude: oscilar(atual.altitude, 5, 380, 450),
      };

      setDados(novos);

      // Verifica alertas para os sensores monitorados
      ['temperatura', 'energia', 'sinal', 'estabilidade'].forEach((s) =>
        gerarAlertaSeNecessario(s, novos[s])
      );

      // Atualiza histórico mantendo os últimos 10 pontos
      setHistorico((prev) => {
        const label = horaAtual();
        const limite = 10;
        return {
          temperatura: [...prev.temperatura, novos.temperatura].slice(-limite),
          energia: [...prev.energia, novos.energia].slice(-limite),
          sinal: [...prev.sinal, novos.sinal].slice(-limite),
          estabilidade: [...prev.estabilidade, novos.estabilidade].slice(-limite),
          labels: [...prev.labels, label].slice(-limite),
        };
      });
    }, intervaloMs);

    return () => clearInterval(timer);
  }, [intervaloMs, gerarAlertaSeNecessario]);

  return { dados, historico };
}
