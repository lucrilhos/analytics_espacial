import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMissao } from '../context/MissaoContext';

/**
 * BarraStatus — barra de progresso visual para exibir percentuais.
 * A cor muda conforme o valor (verde → amarelo → vermelho).
 */
export default function BarraStatus({ label, valor, max = 100, invertido = false }) {
  const { cores } = useMissao();

  const pct = Math.min(100, Math.max(0, (valor / max) * 100));

  // Se invertido=true, valores baixos são críticos (ex: energia, sinal)
  const corBarra = () => {
    const ref = invertido ? 100 - pct : pct;
    if (ref < 30) return cores.perigo;
    if (ref < 60) return cores.aviso;
    return cores.sucesso;
  };

  const s = estilos(cores);

  return (
    <View style={s.container}>
      <View style={s.linha}>
        <Text style={s.label}>{label}</Text>
        <Text style={[s.valor, { color: corBarra() }]}>
          {valor.toFixed(1)}{max !== 100 ? '' : '%'}
        </Text>
      </View>
      <View style={s.trilho}>
        <View style={[s.preenchimento, { width: `${pct}%`, backgroundColor: corBarra() }]} />
      </View>
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    container: { marginBottom: 14 },
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    label: { fontSize: 13, color: cores.textoSecundario },
    valor: { fontSize: 13, fontWeight: 'bold' },
    trilho: {
      height: 8,
      backgroundColor: cores.borda,
      borderRadius: 4,
      overflow: 'hidden',
    },
    preenchimento: {
      height: '100%',
      borderRadius: 4,
    },
  });
