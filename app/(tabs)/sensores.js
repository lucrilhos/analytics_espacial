import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import { useDadosSensores } from '../../hooks/useDadosSensores';
import CabecalhoTela from '../../components/CabecalhoTela';
import BarraStatus from '../../components/BarraStatus';

const LARGURA = Dimensions.get('window').width;

// Sensores disponíveis para seleção no gráfico
const SENSORES = [
  { key: 'temperatura', label: 'Temperatura', unidade: '°C', icone: 'thermometer-outline' },
  { key: 'energia', label: 'Energia', unidade: '%', icone: 'battery-charging-outline' },
  { key: 'sinal', label: 'Sinal', unidade: '%', icone: 'radio-outline' },
  { key: 'estabilidade', label: 'Estabilidade', unidade: '%', icone: 'git-branch-outline' },
];

export default function SensoresScreen() {
  const { cores, limiares } = useMissao();
  const { dados, historico } = useDadosSensores(2500);
  const [sensorAtivo, setSensorAtivo] = useState('temperatura');

  const sensor = SENSORES.find((s) => s.key === sensorAtivo);
  const dadosGrafico = historico[sensorAtivo]?.length > 1 ? historico[sensorAtivo] : [0, 0];
  const labels = historico.labels?.length > 1 ? historico.labels : ['--', '--'];

  const s = estilos(cores);

  return (
    <View style={s.tela}>
      <CabecalhoTela titulo="📡 Sensores" subtitulo="Leituras em tempo real" />

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
              <Ionicons
                name={sen.icone}
                size={16}
                color={sensorAtivo === sen.key ? '#fff' : cores.textoSecundario}
              />
              <Text style={[s.textoBotao, sensorAtivo === sen.key && { color: '#fff' }]}>
                {sen.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {}
        <View style={s.cardGrafico}>
          <Text style={s.tituloGrafico}>
            {sensor.label} ({sensor.unidade}) — últimos 10 pontos
          </Text>
          <LineChart
            data={{
              labels: labels.map((l, i) => (i % 3 === 0 ? l.slice(3) : '')), // só mostra algumas labels
              datasets: [{ data: dadosGrafico }],
            }}
            width={LARGURA - 48}
            height={180}
            chartConfig={{
              backgroundGradientFrom: cores.fundoCard,
              backgroundGradientTo: cores.fundoCard,
              decimalPlaces: 1,
              color: () => cores.destaque,
              labelColor: () => cores.textoSecundario,
              propsForDots: { r: '4', strokeWidth: '2', stroke: cores.destaqueSecundario },
              propsForBackgroundLines: { stroke: cores.borda },
            }}
            bezier
            style={{ borderRadius: 8, marginTop: 8 }}
            withInnerLines
            withOuterLines={false}
          />
          <Text style={s.valorAtual}>
            Valor atual:{' '}
            <Text style={{ color: cores.destaque, fontWeight: 'bold' }}>
              {dados[sensorAtivo]?.toFixed(1)} {sensor.unidade}
            </Text>
          </Text>
        </View>

        {}
        <Text style={s.secao}>Todos os Sensores</Text>
        <View style={s.cardBarras}>
          <BarraStatus label="Temperatura (°C)" valor={dados.temperatura} max={110} />
          <BarraStatus label="Energia (%)" valor={dados.energia} invertido />
          <BarraStatus label="Qualidade do Sinal (%)" valor={dados.sinal} invertido />
          <BarraStatus label="Estabilidade Orbital (%)" valor={dados.estabilidade} invertido />
          <BarraStatus label="Pressão interna (kPa)" valor={dados.pressao} max={120} />
        </View>

        {}
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
    seletor: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    botaoSensor: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: cores.fundoCard,
      borderWidth: 1,
      borderColor: cores.borda,
    },
    textoBotao: {
      fontSize: 12,
      color: cores.textoSecundario,
      fontWeight: '600',
    },
    cardGrafico: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    tituloGrafico: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    valorAtual: {
      fontSize: 13,
      color: cores.textoSecundario,
      marginTop: 10,
      textAlign: 'right',
    },
    secao: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
    },
    cardBarras: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    cardLimiares: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
    },
    linhaLimiar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
    },
    labelLimiar: { flex: 1, color: cores.texto, fontSize: 14 },
    limiarAviso: { fontSize: 13, fontWeight: '600', marginRight: 16 },
    limiarCritico: { fontSize: 13, fontWeight: '600' },
  });
