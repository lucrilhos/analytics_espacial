import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import { useDadosSensores } from '../../hooks/useDadosSensores';
import CabecalhoTela from '../../components/CabecalhoTela';
import CardIndicador from '../../components/CardIndicador';
import BarraStatus from '../../components/BarraStatus';

// Determina o status de um valor baseado nos limiares 
function statusInvertido(valor, limiar) {
  if (valor <= limiar.critico) return 'critico';
  if (valor <= limiar.aviso) return 'aviso';
  return 'normal';
}

function statusDireto(valor, limiar) {
  if (valor >= limiar.critico) return 'critico';
  if (valor >= limiar.aviso) return 'aviso';
  return 'normal';
}

export default function HomeScreen() {
  const { cores, missao, alertas, limiares, tema } = useMissao();
  const { dados } = useDadosSensores(2500);

  const alertasCriticos = alertas.filter((a) => a.nivel === 'critico').length;
  const alertasAviso = alertas.filter((a) => a.nivel === 'aviso').length;

  const s = estilos(cores);

  return (
    <View style={s.tela}>
      <CabecalhoTela
        titulo="♇ Monitoramento Pluto"
        subtitulo={tema === 'espaco' ? 'Modo Espaço ativo' : 'Modo Terra ativo'}
      />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {}
        <View style={s.bannerMissao}>
          <Ionicons name="planet" size={32} color={cores.destaque} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.bannerTitulo}>
              {missao ? missao.nome : 'Nenhuma missão ativa'}
            </Text>
            <Text style={s.bannerSub}>
              {missao
                ? `Operador: ${missao.operador} · Iniciada em ${new Date(missao.dataInicio).toLocaleDateString('pt-BR')}`
                : 'Vá em Configurações para cadastrar uma missão'}
            </Text>
          </View>
        </View>

        {}
        {(alertasCriticos > 0 || alertasAviso > 0) && (
          <View style={[s.resumoAlertas, { borderColor: alertasCriticos > 0 ? cores.perigo : cores.aviso }]}>
            <Ionicons
              name="warning"
              size={18}
              color={alertasCriticos > 0 ? cores.perigo : cores.aviso}
            />
            <Text style={[s.textoAlerta, { color: alertasCriticos > 0 ? cores.perigo : cores.aviso }]}>
              {alertasCriticos > 0
                ? `${alertasCriticos} alerta(s) crítico(s) ativo(s)`
                : `${alertasAviso} aviso(s) de atenção`}
            </Text>
          </View>
        )}

        {}
        <Text style={s.secao}>Indicadores Principais</Text>

        <CardIndicador
          icone="thermometer-outline"
          titulo="Temperatura"
          valor={dados.temperatura}
          unidade="°C"
          status={statusDireto(dados.temperatura, limiares.temperatura)}
          descricao="Temperatura do núcleo do sistema"
        />
        <CardIndicador
          icone="battery-charging-outline"
          titulo="Energia"
          valor={dados.energia}
          unidade="%"
          status={statusInvertido(dados.energia, limiares.energia)}
          descricao="Nível de carga dos painéis solares"
        />
        <CardIndicador
          icone="radio-outline"
          titulo="Qualidade do Sinal"
          valor={dados.sinal}
          unidade="%"
          status={statusInvertido(dados.sinal, limiares.sinal)}
          descricao="Link de telemetria com a Terra"
        />
        <CardIndicador
          icone="git-branch-outline"
          titulo="Estabilidade Orbital"
          valor={dados.estabilidade}
          unidade="%"
          status={statusInvertido(dados.estabilidade, limiares.estabilidade)}
          descricao="Estabilidade da órbita atual"
        />

        {}
        <Text style={s.secao}>Dados Orbitais</Text>
        <View style={s.cardSecundario}>
          <BarraStatus label="Pressão interna (kPa)" valor={dados.pressao} max={120} />
          <BarraStatus label="Estabilidade orbital (%)" valor={dados.estabilidade} invertido />
          <View style={s.linhaOrbital}>
            <View style={s.itemOrbital}>
              <Text style={s.labelOrbital}>Altitude</Text>
              <Text style={s.valorOrbital}>{dados.altitude.toFixed(0)} km</Text>
            </View>
            <View style={s.itemOrbital}>
              <Text style={s.labelOrbital}>Velocidade</Text>
              <Text style={s.valorOrbital}>{dados.velocidade.toFixed(0)} km/h</Text>
            </View>
          </View>
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
    bannerMissao: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: cores.destaque + '44',
    },
    bannerTitulo: {
      fontSize: 16,
      fontWeight: 'bold',
      color: cores.texto,
    },
    bannerSub: {
      fontSize: 12,
      color: cores.textoSecundario,
      marginTop: 3,
    },
    resumoAlertas: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
      backgroundColor: cores.fundoCard,
    },
    textoAlerta: {
      fontSize: 13,
      fontWeight: '600',
    },
    secao: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
      marginTop: 4,
    },
    cardSecundario: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
    },
    linhaOrbital: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
    },
    itemOrbital: { alignItems: 'center' },
    labelOrbital: { fontSize: 12, color: cores.textoSecundario },
    valorOrbital: {
      fontSize: 18,
      fontWeight: 'bold',
      color: cores.destaque,
      marginTop: 2,
    },
  });
