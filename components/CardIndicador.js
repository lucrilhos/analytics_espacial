import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../context/MissaoContext';

/**
 * CardIndicador — exibe uma métrica com ícone, valor e status colorido.
 * Reutilizado em todas as telas de dashboard.
 */
export default function CardIndicador({ icone, titulo, valor, unidade, status, descricao }) {
  const { cores } = useMissao();

  // Mapeia status para cor
  const corStatus = {
    normal: cores.sucesso,
    aviso: cores.aviso,
    critico: cores.perigo,
    info: cores.destaque,
  }[status] ?? cores.textoSecundario;

  const s = estilos(cores);

  return (
    <View style={[s.card, { borderLeftColor: corStatus }]}>
      <View style={s.cabecalho}>
        <Ionicons name={icone} size={20} color={corStatus} />
        <Text style={s.titulo}>{titulo}</Text>
      </View>
      <Text style={[s.valor, { color: corStatus }]}>
        {valor}
        <Text style={s.unidade}> {unidade}</Text>
      </Text>
      {descricao ? <Text style={s.descricao}>{descricao}</Text> : null}
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    card: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      borderLeftWidth: 4,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    cabecalho: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 6,
    },
    titulo: {
      fontSize: 13,
      color: cores.textoSecundario,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    valor: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    unidade: {
      fontSize: 14,
      fontWeight: 'normal',
      color: cores.textoSecundario,
    },
    descricao: {
      fontSize: 12,
      color: cores.textoSecundario,
      marginTop: 4,
    },
  });
