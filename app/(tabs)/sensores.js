import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import { useDadosSensores } from '../../hooks/useDadosSensores';
import CabecalhoTela from '../../components/CabecalhoTela';
import BarraStatus from '../../components/BarraStatus';

const LARGURA = Dimensions.get('window').width;

const SENSORES = [
  { key: 'temperatura', label: 'Temperatura', unidade: '°C', icone: 'thermometer-outline' },
  { key: 'energia', label: 'Energia', unidade: '%', icone: 'battery-charging-outline' },
  { key: 'sinal', label: 'Sinal', unidade: '%', icone: 'radio-outline' },
  { key: 'estabilidade', label: 'Estabilidade', unidade: '%', icone: 'git-branch-outline' },
];

function GraficoLinha({ dados, cor, largura = LARGURA - 48, altura = 180 }) {
  if (!dados || dados.length < 2) return null;

  const padH = 32;
  const padV = 16;
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
    v,
  }));

  return (
    <Svg width={largura} height={altura}>
      {/* Linhas de grade */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <Line
          key={t}
          x1={padH} y1={padV + h * (1 - t)}
          x2={padH + w} y2={padV + h * (1 - t)}
          stroke="#1e293b" strokeWidth="1"
        />
      ))}
      {}
      <Polyline
        points={pontos.join(' ')}
        fill="none"
        stroke={cor}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {}
      {pontosArr.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r="4" fill={cor} />
      ))}
      {/* Labels min/max */}
      <SvgText x={4} y={padV + 4} fontSize="10" fill="#64748b">{max.toFixed(0)}</SvgText>
      <SvgText x={4} y={padV + h} fontSize="10" fill="#64748b">{min.toFixed(0)}</SvgText>
    </Svg>
  );
}

export default function SensoresScreen() {
  const { cores, limiares } = useMissao();
  const { dados, historico } = useDadosSensores(2500);
  const [sensorAtivo, setSensorAtivo] = useState('temperatura');

  const sensor = SENSORES.find((s) => s.key === sensorAtivo);
  const dadosGrafico = historico[sensorAtivo]?.length > 1 ? historico[sensorAtivo] : [0, 10];

  const s = estilos(cores);

  return (
    <View style={s.tela}>
      <CabecalhoTela titulo="📡 Sensores" subtitulo="Leituras em tempo real simulado" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {}
        <View style={s.seletor}>
          {SENSORES.map((sen) => (
            <TouchableOpacity
              key={sen.key}
              style={[s.botaoSensor, sensorAtivo === sen.key && { backgroundColor: cores.destaque }]}
              onPress={() => setSensorAtivo(sen.key)}
              activeOpacity={0.7}
            >
              <Ionicons name={sen.icone} size={16} color={sensorAtivo === sen.key ? '#fff' : cores.textoSecundario} />
              <Text style={[s.textoBotao, sensorAtivo === sen.key && { color: '#fff' }]}>{sen.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {}
        <View style={s.cardGrafico}>
          <Text style={s.tituloGrafico}>{sensor.label} ({sensor.unidade}) — últimos 10 pontos</Text>
          <GraficoLinha dados={dadosGrafico} cor={cores.destaque} largura={LARGURA - 48} />
          <Text style={s.valorAtual}>
            Valor atual:{' '}
            <Text style={{ color: cores.destaque, fontWeight: 'bold' }}>
              {dados[sensorAtivo]?.toFixed(1)} {sensor.unidade}
            </Text>
          </Text>
        </View>

        {/* Barras */}
        <Text style={s.secao}>Todos os Sensores</Text>
        <View style={s.cardBarras}>
          <BarraStatus label="Temperatura (°C)" valor={dados.temperatura} max={110} />
          <BarraStatus label="Energia (%)" valor={dados.energia} invertido />
          <BarraStatus label="Qualidade do Sinal (%)" valor={dados.sinal} invertido />
          <BarraStatus label="Estabilidade Orbital (%)" valor={dados.estabilidade} invertido />
          <BarraStatus label="Pressão interna (kPa)" valor={dados.pressao} max={120} />
        </View>

        {/* Limiares */}
        <Text style={s.secao}>Limiares Ativos</Text>
        <View style={s.cardLimiares}>
          {Object.entries(limiares).map(([sensor, val]) => (
            <View key={sensor} style={s.linhaLimiar}>
              <Text style={s.labelLimiar}>{sensor.charAt(0).toUpperCase() + sensor.slice(1)}</Text>
              <Text style={[s.limiarAviso, { color: cores.aviso }]}>⚠ {val.aviso}</Text>
              <Text style={[s.limiarCritico, { color: cores.perigo }]}>🔴 {val.critico}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    scroll: { padding: 16 },
    seletor: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    botaoSensor: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
      backgroundColor: cores.fundoCard, borderWidth: 1, borderColor: cores.borda,
    },
    textoBotao: { fontSize: 12, color: cores.textoSecundario, fontWeight: '600' },
    cardGrafico: { backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16, marginBottom: 16 },
    tituloGrafico: {
      fontSize: 13, fontWeight: '700', color: cores.textoSecundario,
      textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
    },
    valorAtual: { fontSize: 13, color: cores.textoSecundario, marginTop: 10, textAlign: 'right' },
    secao: {
      fontSize: 13, fontWeight: '700', color: cores.textoSecundario,
      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
    },
    cardBarras: { backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16, marginBottom: 16 },
    cardLimiares: { backgroundColor: cores.fundoCard, borderRadius: 12, padding: 16 },
    linhaLimiar: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: cores.borda,
    },
    labelLimiar: { flex: 1, color: cores.texto, fontSize: 14 },
    limiarAviso: { fontSize: 13, fontWeight: '600', marginRight: 16 },
    limiarCritico: { fontSize: 13, fontWeight: '600' },
  });