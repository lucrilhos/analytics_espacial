import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../context/MissaoContext';

/**
 * CabecalhoTela — header padrão usado em todas as telas.
 * Exibe título, subtítulo e o botão de alternância de tema.
 */
export default function CabecalhoTela({ titulo, subtitulo, mostrarTema = true }) {
  const { cores, tema, alternarTema } = useMissao();
  const s = estilos(cores);

  return (
    <View style={s.container}>
      <View style={s.textos}>
        <Text style={s.titulo}>{titulo}</Text>
        {subtitulo ? <Text style={s.subtitulo}>{subtitulo}</Text> : null}
      </View>
      {mostrarTema && (
        <TouchableOpacity onPress={alternarTema} style={s.botaoTema} activeOpacity={0.7}>
          <Ionicons
            name={tema === 'espaco' ? 'planet-outline' : 'earth-outline'}
            size={22}
            color={cores.destaque}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
      backgroundColor: cores.fundoCard,
    },
    textos: { flex: 1 },
    titulo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: cores.texto,
    },
    subtitulo: {
      fontSize: 12,
      color: cores.textoSecundario,
      marginTop: 2,
    },
    botaoTema: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: cores.fundoSecundario,
    },
  });
