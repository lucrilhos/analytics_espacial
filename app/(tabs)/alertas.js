import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import CabecalhoTela from '../../components/CabecalhoTela';

// Ícone e cor por nível de alerta
function configuracaoNivel(nivel, cores) {
  if (nivel === 'critico') return { cor: cores.perigo, icone: 'alert-circle', label: 'CRÍTICO' };
  return { cor: cores.aviso, icone: 'warning', label: 'ATENÇÃO' };
}

export default function AlertasScreen() {
  const { cores, alertas, limparAlerta, limparTodosAlertas } = useMissao();

  const criticos = alertas.filter((a) => a.nivel === 'critico');
  const avisos = alertas.filter((a) => a.nivel === 'aviso');

  function confirmarLimparTodos() {
    Alert.alert(
      'Limpar todos os alertas',
      'Tem certeza que deseja remover todos os alertas ativos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: limparTodosAlertas },
      ]
    );
  }

  const s = estilos(cores);

  return (
    <View style={s.tela}>
      <CabecalhoTela titulo="⚠️ Alertas" subtitulo="Alertas gerados automaticamente" />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {}
        <View style={s.resumo}>
          <View style={[s.cardResumo, { borderColor: cores.perigo }]}>
            <Text style={[s.numResumo, { color: cores.perigo }]}>{criticos.length}</Text>
            <Text style={s.labelResumo}>Críticos</Text>
          </View>
          <View style={[s.cardResumo, { borderColor: cores.aviso }]}>
            <Text style={[s.numResumo, { color: cores.aviso }]}>{avisos.length}</Text>
            <Text style={s.labelResumo}>Avisos</Text>
          </View>
          <View style={[s.cardResumo, { borderColor: cores.destaque }]}>
            <Text style={[s.numResumo, { color: cores.destaque }]}>{alertas.length}</Text>
            <Text style={s.labelResumo}>Total</Text>
          </View>
        </View>

        {}
        {alertas.length > 0 && (
          <TouchableOpacity style={s.botaoLimpar} onPress={confirmarLimparTodos} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={cores.perigo} />
            <Text style={[s.textoBotaoLimpar, { color: cores.perigo }]}>Limpar todos os alertas</Text>
          </TouchableOpacity>
        )}

        {}
        {alertas.length === 0 && (
          <View style={s.vazio}>
            <Ionicons name="checkmark-circle-outline" size={56} color={cores.sucesso} />
            <Text style={s.textoVazio}>Nenhum alerta ativo</Text>
            <Text style={s.subVazio}>Todos os sistemas operando normalmente.</Text>
          </View>
        )}

        {}
        {criticos.length > 0 && (
          <>
            <Text style={s.secao}>🔴 Críticos</Text>
            {criticos.map((alerta) => (
              <ItemAlerta key={alerta.id} alerta={alerta} cores={cores} onRemover={limparAlerta} />
            ))}
          </>
        )}

        {}
        {avisos.length > 0 && (
          <>
            <Text style={s.secao}>🟡 Avisos</Text>
            {avisos.map((alerta) => (
              <ItemAlerta key={alerta.id} alerta={alerta} cores={cores} onRemover={limparAlerta} />
            ))}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// cada item da lista de alerta tem um componente interno
function ItemAlerta({ alerta, cores, onRemover }) {
  const { cor, icone, label } = configuracaoNivel(alerta.nivel, cores);
  const s = estilos(cores);

  const horario = alerta.timestamp
    ? new Date(alerta.timestamp).toLocaleTimeString('pt-BR')
    : '--:--:--';

  return (
    <View style={[s.itemAlerta, { borderLeftColor: cor }]}>
      <Ionicons name={icone} size={22} color={cor} style={{ marginTop: 2 }} />
      <View style={s.textoAlerta}>
        <View style={s.linhaLabel}>
          <Text style={[s.nivelLabel, { color: cor }]}>{label}</Text>
          <Text style={s.sensor}>{alerta.sensor?.toUpperCase()}</Text>
        </View>
        <Text style={s.mensagem}>{alerta.mensagem}</Text>
        <Text style={s.horario}>{horario}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemover(alerta.id)} style={s.botaoRemover}>
        <Ionicons name="close-circle" size={20} color={cores.textoSecundario} />
      </TouchableOpacity>
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    scroll: { padding: 16 },
    resumo: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
    },
    cardResumo: {
      flex: 1,
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 14,
      alignItems: 'center',
      borderWidth: 2,
    },
    numResumo: { fontSize: 28, fontWeight: 'bold' },
    labelResumo: { fontSize: 12, color: cores.textoSecundario, marginTop: 2 },
    botaoLimpar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: cores.perigo + '66',
      marginBottom: 16,
      backgroundColor: cores.fundoCard,
    },
    textoBotaoLimpar: { fontSize: 14, fontWeight: '600' },
    vazio: {
      alignItems: 'center',
      paddingVertical: 60,
      gap: 10,
    },
    textoVazio: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
    subVazio: { fontSize: 13, color: cores.textoSecundario },
    secao: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    itemAlerta: {
      flexDirection: 'row',
      backgroundColor: cores.fundoCard,
      borderRadius: 10,
      padding: 14,
      marginBottom: 8,
      borderLeftWidth: 4,
      gap: 10,
    },
    textoAlerta: { flex: 1 },
    linhaLabel: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 3 },
    nivelLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    sensor: {
      fontSize: 11,
      color: cores.textoSecundario,
      backgroundColor: cores.fundoSecundario,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    mensagem: { fontSize: 13, color: cores.texto, marginBottom: 4 },
    horario: { fontSize: 11, color: cores.textoSecundario },
    botaoRemover: { padding: 2 },
  });
