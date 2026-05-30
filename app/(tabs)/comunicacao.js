import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Line, Circle, Text as SvgText } from 'react-native-svg'; // tivemos que importar o react native svg por problemas ao depurar na web
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import { useDadosSensores } from '../../hooks/useDadosSensores';
import CabecalhoTela from '../../components/CabecalhoTela';
import BarraStatus from '../../components/BarraStatus';

const LARGURA = Dimensions.get('window').width;

function GraficoLinha({ dados, cor, largura = LARGURA - 48, altura = 180 }) {
  if (!dados || dados.length < 2) return null;
  const padH = 32, padV = 16;
  const w = largura - padH * 2;
  const h = altura - padV * 2;
  const min = Math.min(...dados);
  const max = Math.max(...dados) || 1;
  const range = max - min || 1;

  const pontos = dados.map((v, i) => {
    const x = padH + (i / (dados.length - 1)) * w;
    const y = padV + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const pontosArr = dados.map((v, i) => ({
    x: padH + (i / (dados.length - 1)) * w,
    y: padV + h - ((v - min) / range) * h,
  }));

  return (
    <Svg width={largura} height={altura}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <Line key={t} x1={padH} y1={padV + h * (1 - t)} x2={padH + w} y2={padV + h * (1 - t)} stroke="#1e293b" strokeWidth="1" />
      ))}
      <Polyline points={pontos.join(' ')} fill="none" stroke={cor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pontosArr.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r="4" fill={cor} />)}
      <SvgText x={4} y={padV + 4} fontSize="10" fill="#64748b">{max.toFixed(0)}</SvgText>
      <SvgText x={4} y={padV + h} fontSize="10" fill="#64748b">{min.toFixed(0)}</SvgText>
    </Svg>
  );
}

export default function ComunicacaoScreen() {
  const { cores } = useMissao();
  const { dados, historico } = useDadosSensores(2500);

  const latencia = parseFloat((300 - dados.sinal * 2).toFixed(0));
  const taxaErros = parseFloat((100 - dados.sinal) * 0.05).toFixed(2);
  const larguraBanda = parseFloat((dados.sinal * 0.85).toFixed(1));

  const corSinal = dados.sinal <= 20 ? cores.perigo : dados.sinal <= 40 ? cores.aviso : cores.sucesso;
  const dadosGrafico = historico.sinal?.length > 1 ? historico.sinal : [0, 10];

  const s = estilos(cores);

  return (
    <View style={s.tela}>
      <CabecalhoTela titulo="📻 Comunicação" subtitulo="Telemetria e link de dados" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {}
        <View style={[s.cardStatus, { borderColor: corSinal }]}>
          <View style={s.linhaStatus}>
            <View style={[s.indicadorOnline, { backgroundColor: corSinal }]} />
            <Text style={[s.textoStatus, { color: corSinal }]}>
              {dados.sinal > 40 ? 'LINK ATIVO' : dados.sinal > 20 ? 'SINAL FRACO' : 'SINAL CRÍTICO'}
            </Text>
          </View>
          <Text style={s.qualidadeSinal}>{dados.sinal.toFixed(1)}%</Text>
          <Text style={s.labelQualidade}>Qualidade do sinal</Text>
        </View>

        {}
        <View style={s.gridMetricas}>
          <View style={s.cardMetrica}>
            <Ionicons name="timer-outline" size={22} color={cores.destaqueSecundario} />
            <Text style={s.valorMetrica}>{latencia} ms</Text>
            <Text style={s.labelMetrica}>Latência</Text>
          </View>
          <View style={s.cardMetrica}>
            <Ionicons name="git-compare-outline" size={22} color={cores.destaque} />
            <Text style={s.valorMetrica}>{larguraBanda} Mbps</Text>
            <Text style={s.labelMetrica}>Banda Disponível</Text>
          </View>
          <View style={s.cardMetrica}>
            <Ionicons name="close-circle-outline" size={22} color={cores.perigo} />
            <Text style={s.valorMetrica}>{taxaErros}%</Text>
            <Text style={s.labelMetrica}>Taxa de Erros</Text>
          </View>
        </View>

        {}
        <View style={s.card}>
          <Text style={s.tituloCard}>Histórico de Qualidade do Sinal</Text>
          <GraficoLinha dados={dadosGrafico} cor={corSinal} largura={LARGURA - 48} />
        </View>

        {/* Barras */}
        <View style={s.card}>
          <Text style={s.tituloCard}>Parâmetros de Comunicação</Text>
          <BarraStatus label="Qualidade do Sinal (%)" valor={dados.sinal} invertido />
          <BarraStatus label="Largura de Banda (%)" valor={larguraBanda} invertido />
          <BarraStatus label="Latência (ms)" valor={latencia} max={300} />
        </View>

        {/* Canais */}
        <Text style={s.secao}>Canais Ativos</Text>
        {[
          { nome: 'Canal Primário (Tv Pluto)', ativo: dados.sinal > 30 },
          { nome: 'Canal Secundário (Disney Channel)', ativo: dados.sinal > 50 },
          { nome: 'Canal de Emergência (Protocolo Plutão)', ativo: true },
          { nome: 'Relay via Satélite', ativo: dados.sinal > 20 },
        ].map((canal) => (
          <View key={canal.nome} style={s.linhaCanal}>
            <View style={[s.dot, { backgroundColor: canal.ativo ? cores.sucesso : cores.perigo }]} />
            <Text style={s.nomeCanal}>{canal.nome}</Text>
            <Text style={[s.statusCanal, { color: canal.ativo ? cores.sucesso : cores.perigo }]}>
              {canal.ativo ? 'ATIVO' : 'OFFLINE'}
            </Text>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    scroll: { padding: 16 },
    cardStatus: {
      backgroundColor: cores.fundoCard, borderRadius: 12, padding: 20,
      marginBottom: 12, alignItems: 'center', borderWidth: 2,
    },
    linhaStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    indicadorOnline: { width: 10, height: 10, borderRadius: 5 },
    textoStatus: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
    qualidadeSinal: { fontSize: 48, fontWeight: 'bold', color: cores.texto },
    labelQualidade: { fontSize: 13, color: cores.textoSecundario, marginTop: 4 },
    gridMetricas: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    cardMetrica: {
      flex: 1, backgroundColor: cores.fundoCard, borderRadius: 12,
      padding: 14, alignItems: 'center', gap: 6,
    },
    valorMetrica: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
    labelMetrica: { fontSize: 10, color: cores.textoSecundario, textAlign: 'center' },
    card: { backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16, marginBottom: 12 },
    tituloCard: {
      fontSize: 13, fontWeight: '700', color: cores.textoSecundario,
      textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
    },
    secao: {
      fontSize: 13, fontWeight: '700', color: cores.textoSecundario,
      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
    },
    linhaCanal: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: cores.fundoCard, borderRadius: 8, padding: 12, marginBottom: 8,
    },
    dot: { width: 8, height: 8, borderRadius: 4 },
    nomeCanal: { flex: 1, color: cores.texto, fontSize: 14 },
    statusCanal: { fontSize: 12, fontWeight: '700' },
  });