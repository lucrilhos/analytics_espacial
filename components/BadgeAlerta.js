import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMissao } from '../context/MissaoContext';

/**
 * BadgeAlerta — exibe contagem de alertas ativos sobre o ícone da aba.
 */
export default function BadgeAlerta({ children }) {
  const { alertas, cores } = useMissao();
  const criticos = alertas.filter((a) => a.nivel === 'critico').length;

  return (
    <View>
      {children}
      {criticos > 0 && (
        <View style={[estilos.badge, { backgroundColor: cores.perigo }]}>
          <Text style={estilos.texto}>{criticos > 9 ? '9+' : criticos}</Text>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  texto: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
