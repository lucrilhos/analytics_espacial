import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import { useDadosSensores } from '../../hooks/useDadosSensores';
import CabecalhoTela from '../../components/CabecalhoTela';
import BarraStatus from '../../components/BarraStatus';

const LARGURA = Dimensions.get('window').width;

export default function EnergiaScreen() {
  const { cores } = useMissao();
  const { dados, historico } = useDadosSensores(2500);

  // Simula distribuição de consumo por subsistema
  const consumo = {
    Propulsão: parseFloat((dados.energia * 0.35).toFixed(1)),
    Comunicação: parseFloat((dados.energia * 0.20).toFixed(1)),
    Suporte: parseFloat((dados.energia * 0.25).toFixed(1)),
    Sensores: parseFloat((dados.energia * 0.12).toFixed(1)),
    Reserva: parseFloat((dados.energia * 0.08).toFixed(1)),
  };

  const corEnergia =
    dados.energia <= 15 ? cores.perigo : dados.energia <= 30 ? cores.aviso : cores.sucesso;

  const s = estilos(cores);

  return (
    <View style={s.tela}>
      <CabecalhoTela titulo="⚡ Energia" subtitulo="Painéis solares e consumo dos sistemas" />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {}
        <View style={s.cardPrincipal}>
          <View style={[s.circulo, { borderColor: corEnergia }]}>
            <Text style={[s.pctGrande, { color: corEnergia }]}>
              {dados.energia.toFixed(0)}%
            </Text>
            <Text style={s.labelCirculo}>Energia</Text>
          </View>
          <View style={s.infoLateral}>
            <View style={s.itemInfo}>
              <Ionicons name="sunny-outline" size={20} color={cores.aviso} />
              <Text style={s.labelInfo}>Geração Solar</Text>
              <Text style={[s.valorInfo, { color: cores.aviso }]}>
                {(dados.energia * 1.2).toFixed(1)} W
              </Text>
            </View>
            <View style={s.itemInfo}>
              <Ionicons name="flash-outline" size={20} color={cores.perigo} />
              <Text style={s.labelInfo}>Consumo Total</Text>
              <Text style={[s.valorInfo, { color: cores.perigo }]}>
                {(dados.energia * 0.95).toFixed(1)} W
              </Text>
            </View>
            <View style={s.itemInfo}>
              <Ionicons name="time-outline" size={20} color={cores.destaque} />
              <Text style={s.labelInfo}>Autonomia Est.</Text>
              <Text style={[s.valorInfo, { color: cores.destaque }]}>
                {(dados.energia / 3.5).toFixed(1)} h
              </Text>
            </View>
          </View>
        </View>

        {}
        <View style={s.card}>
          <Text style={s.tituloCard}>Nível de Carga da Bateria</Text>
          <BarraStatus label="Bateria Principal" valor={dados.energia} invertido />
          <BarraStatus label="Bateria Reserva" valor={Math.min(100, dados.energia + 12)} invertido />
          <BarraStatus label="Capacitor de Emergência" valor={Math.min(100, dados.energia + 20)} invertido />
        </View>

        {}
        <View style={s.card}>
          <Text style={s.tituloCard}>Consumo por Subsistema (W)</Text>
          <BarChart
            data={{
              labels: Object.keys(consumo),
              datasets: [{ data: Object.values(consumo) }],
            }}
            width={LARGURA - 48}
            height={200}
            chartConfig={{
              backgroundGradientFrom: cores.fundoCard,
              backgroundGradientTo: cores.fundoCard,
              decimalPlaces: 1,
              color: () => cores.destaqueSecundario,
              labelColor: () => cores.textoSecundario,
              propsForBackgroundLines: { stroke: cores.borda },
            }}
            style={{ borderRadius: 8, marginTop: 8 }}
            showValuesOnTopOfBars
            withInnerLines
          />
        </View>

        {}
        <Text style={s.secao}>Status dos Painéis Solares</Text>
        {['Painel Norte', 'Painel Sul', 'Painel Leste', 'Painel Oeste'].map((painel, i) => {
          const eficiencia = Math.min(100, dados.energia + (i % 2 === 0 ? 5 : -5));
          return (
            <View key={painel} style={s.linhaPainel}>
              <Ionicons name="sunny" size={16} color={cores.aviso} />
              <Text style={s.labelPainel}>{painel}</Text>
              <Text style={[s.valorPainel, { color: eficiencia > 50 ? cores.sucesso : cores.aviso }]}>
                {eficiencia.toFixed(1)}%
              </Text>
            </View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    scroll: { padding: 16 },
    cardPrincipal: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    circulo: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    pctGrande: { fontSize: 26, fontWeight: 'bold' },
    labelCirculo: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    infoLateral: { flex: 1, gap: 10 },
    itemInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    labelInfo: { flex: 1, fontSize: 12, color: cores.textoSecundario },
    valorInfo: { fontSize: 14, fontWeight: 'bold' },
    card: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    tituloCard: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    secao: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    linhaPainel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: cores.fundoCard,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    labelPainel: { flex: 1, color: cores.texto, fontSize: 14 },
    valorPainel: { fontSize: 14, fontWeight: 'bold' },
  });
