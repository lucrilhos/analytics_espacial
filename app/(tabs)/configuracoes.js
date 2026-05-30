import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TextInput, TouchableOpacity, Alert, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMissao } from '../../context/MissaoContext';
import CabecalhoTela from '../../components/CabecalhoTela';

export default function ConfiguracoesScreen() {
  const { cores, tema, alternarTema, missao, salvarMissao, limiares, atualizarLimiares, historicoMissoes } = useMissao();

  // Formulário 
  const [nomeMissao, setNomeMissao] = useState('');
  const [operador, setOperador] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});

  // Limiares 
  const [limiaresForm, setLimiaresForm] = useState({
    temperaturaAviso: String(limiares.temperatura.aviso),
    temperaturaCritico: String(limiares.temperatura.critico),
    energiaAviso: String(limiares.energia.aviso),
    energiaCritico: String(limiares.energia.critico),
    sinalAviso: String(limiares.sinal.aviso),
    sinalCritico: String(limiares.sinal.critico),
  });

  // completa o formulário se já tiver com uma missão salva
  useEffect(() => {
    if (missao) {
      setNomeMissao(missao.nome || '');
      setOperador(missao.operador || '');
      setDescricao(missao.descricao || '');
    }
  }, [missao]);

  // Validação do formulário 
  function validar() {
    const novosErros = {};
    if (!nomeMissao.trim()) novosErros.nomeMissao = 'Nome da missão é obrigatório.';
    else if (nomeMissao.trim().length < 3) novosErros.nomeMissao = 'Nome deve ter ao menos 3 caracteres.';

    if (!operador.trim()) novosErros.operador = 'Nome do operador é obrigatório.';

    if (!descricao.trim()) novosErros.descricao = 'Descrição é obrigatória.';
    else if (descricao.trim().length < 10) novosErros.descricao = 'Descrição muito curta (mín. 10 caracteres).';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function salvar() {
    if (!validar()) return;

    salvarMissao({
      nome: nomeMissao.trim(),
      operador: operador.trim(),
      descricao: descricao.trim(),
      dataInicio: new Date().toISOString(),
    });

    Alert.alert('✅ Missão salva!', `"${nomeMissao}" foi registrada com sucesso.`);
  }

  // Salva os limiares editados
  function salvarLimiares() {
    const t = (val) => parseFloat(val);
    if (
      isNaN(t(limiaresForm.temperaturaAviso)) ||
      isNaN(t(limiaresForm.temperaturaCritico)) ||
      isNaN(t(limiaresForm.energiaAviso)) ||
      isNaN(t(limiaresForm.energiaCritico)) ||
      isNaN(t(limiaresForm.sinalAviso)) ||
      isNaN(t(limiaresForm.sinalCritico))
    ) {
      Alert.alert('Erro', 'Todos os limiares devem ser números válidos.');
      return;
    }

    atualizarLimiares({
      temperatura: { aviso: t(limiaresForm.temperaturaAviso), critico: t(limiaresForm.temperaturaCritico) },
      energia: { aviso: t(limiaresForm.energiaAviso), critico: t(limiaresForm.energiaCritico) },
      sinal: { aviso: t(limiaresForm.sinalAviso), critico: t(limiaresForm.sinalCritico) },
    });

    Alert.alert('✅ Limiares atualizados!', 'Os novos limiares entrarão em vigor imediatamente.');
  }

  const s = estilos(cores);

  return (
    <View style={s.tela}>
      <CabecalhoTela titulo="⚙️ Configurações" subtitulo="Missão, limiares e preferências" />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {}
        <Text style={s.secao}>Aparência</Text>
        <View style={s.card}>
          <View style={s.linhaSwitch}>
            <Ionicons
              name={tema === 'espaco' ? 'planet-outline' : 'earth-outline'}
              size={22}
              color={cores.destaque}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.labelSwitch}>
                {tema === 'espaco' ? '🚀 Modo Espaço' : '🌍 Modo Terra'}
              </Text>
              <Text style={s.subSwitch}>
                {tema === 'espaco' ? 'Tema escuro côsmico' : 'Tema claro diurno'}
              </Text>
            </View>
            <Switch
              value={tema === 'espaco'}
              onValueChange={alternarTema}
              trackColor={{ false: cores.borda, true: cores.destaque + '88' }}
              thumbColor={tema === 'espaco' ? cores.destaque : cores.textoSecundario}
            />
          </View>
        </View>

        {}
        <Text style={s.secao}>Cadastro de Missão:</Text>
        <View style={s.card}>

          <Text style={s.label}>Nome da Missão:</Text>
          <TextInput
            style={[s.input, erros.nomeMissao && s.inputErro]}
            placeholder="Ex: OPeração Mickey Mei"
            placeholderTextColor={cores.textoSecundario}
            value={nomeMissao}
            onChangeText={(v) => { setNomeMissao(v); setErros((e) => ({ ...e, nomeMissao: null })); }}
          />
          {erros.nomeMissao && <Text style={s.erro}>{erros.nomeMissao}</Text>}

          <Text style={s.label}>Nome do Operador:</Text>
          <TextInput
            style={[s.input, erros.operador && s.inputErro]}
            placeholder="Nome do operador"
            placeholderTextColor={cores.textoSecundario}
            value={operador}
            onChangeText={(v) => { setOperador(v); setErros((e) => ({ ...e, operador: null })); }}
          />
          {erros.operador && <Text style={s.erro}>{erros.operador}</Text>}

          <Text style={s.label}>Descrição da Missão:</Text>
          <TextInput
            style={[s.input, s.inputMultiline, erros.descricao && s.inputErro]}
            placeholder="Descreva o objetivo da missão"
            placeholderTextColor={cores.textoSecundario}
            value={descricao}
            onChangeText={(v) => { setDescricao(v); setErros((e) => ({ ...e, descricao: null })); }}
            multiline
            numberOfLines={3}
          />
          {erros.descricao && <Text style={s.erro}>{erros.descricao}</Text>}

          <TouchableOpacity style={s.botaoSalvar} onPress={salvar} activeOpacity={0.8}>
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={s.textoBotao}>Salvar Missão</Text>
          </TouchableOpacity>
        </View>

        {/* Configuração de limiares */}
        <Text style={s.secao}>Limiares de Alerta</Text>
        <View style={s.card}>
          {[
            { key: 'temperatura', label: 'Temperatura (°C)', avisoKey: 'temperaturaAviso', criticoKey: 'temperaturaCritico' },
            { key: 'energia', label: 'Energia (%)', avisoKey: 'energiaAviso', criticoKey: 'energiaCritico' },
            { key: 'sinal', label: 'Qualidade do Sinal (%)', avisoKey: 'sinalAviso', criticoKey: 'sinalCritico' },
          ].map((item) => (
            <View key={item.key} style={s.grupoLimiar}>
              <Text style={s.labelLimiar}>{item.label}</Text>
              <View style={s.linhaInputs}>
                <View style={s.inputLimiarWrap}>
                  <Text style={[s.labelMini, { color: cores.aviso }]}>⚠ Aviso</Text>
                  <TextInput
                    style={[s.input, s.inputLimiar]}
                    keyboardType="numeric"
                    value={limiaresForm[item.avisoKey]}
                    onChangeText={(v) => setLimiaresForm((f) => ({ ...f, [item.avisoKey]: v }))}
                    placeholderTextColor={cores.textoSecundario}
                  />
                </View>
                <View style={s.inputLimiarWrap}>
                  <Text style={[s.labelMini, { color: cores.perigo }]}>🔴 Crítico</Text>
                  <TextInput
                    style={[s.input, s.inputLimiar]}
                    keyboardType="numeric"
                    value={limiaresForm[item.criticoKey]}
                    onChangeText={(v) => setLimiaresForm((f) => ({ ...f, [item.criticoKey]: v }))}
                    placeholderTextColor={cores.textoSecundario}
                  />
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={[s.botaoSalvar, { backgroundColor: cores.destaqueSecundario }]} onPress={salvarLimiares} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={18} color="#fff" />
            <Text style={s.textoBotao}>Atualizar Limiares</Text>
          </TouchableOpacity>
        </View>

        {}
        {historicoMissoes.length > 0 && (
          <>
            <Text style={s.secao}>Histórico de Missões</Text>
            <View style={s.card}>
              {historicoMissoes.slice(0, 5).map((m, i) => (
                <View key={i} style={[s.itemHistorico, i < historicoMissoes.length - 1 && { borderBottomWidth: 1, borderBottomColor: cores.borda }]}>
                  <Ionicons name="rocket-outline" size={16} color={cores.destaque} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={s.nomeHistorico}>{m.nome}</Text>
                    <Text style={s.dataHistorico}>
                      {new Date(m.dataInicio).toLocaleDateString('pt-BR')} · {m.operador}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const estilos = (cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    scroll: { padding: 16 },
    secao: {
      fontSize: 13,
      fontWeight: '700',
      color: cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
      marginTop: 4,
    },
    card: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    linhaSwitch: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    labelSwitch: { fontSize: 15, fontWeight: '600', color: cores.texto },
    subSwitch: { fontSize: 12, color: cores.textoSecundario, marginTop: 2 },
    label: {
      fontSize: 13,
      color: cores.textoSecundario,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 6,
    },
    input: {
      backgroundColor: cores.fundoSecundario,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: cores.texto,
      borderWidth: 1,
      borderColor: cores.borda,
    },
    inputErro: {
      borderColor: cores.perigo,
    },
    inputMultiline: {
      height: 80,
      textAlignVertical: 'top',
    },
    erro: {
      fontSize: 12,
      color: cores.perigo,
      marginTop: 4,
    },
    botaoSalvar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: cores.destaque,
      borderRadius: 10,
      padding: 14,
      marginTop: 16,
    },
    textoBotao: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },
    grupoLimiar: {
      marginBottom: 14,
    },
    labelLimiar: {
      fontSize: 14,
      fontWeight: '600',
      color: cores.texto,
      marginBottom: 6,
    },
    linhaInputs: {
      flexDirection: 'row',
      gap: 12,
    },
    inputLimiarWrap: { flex: 1 },
    labelMini: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
    },
    inputLimiar: {
      textAlign: 'center',
    },
    itemHistorico: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    nomeHistorico: {
      fontSize: 14,
      fontWeight: '600',
      color: cores.texto,
    },
    dataHistorico: {
      fontSize: 12,
      color: cores.textoSecundario,
      marginTop: 2,
    },
  });
