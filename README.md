# 🚀 Dashboard de análise de dados espaciais preditivos ou **Dashboard de Monitoramento Pluto ♇**
### Global Solution 2026.1 — Cross-Platform Application Development | FIAP

---

## 📖 Descrição

O **Monitoramento Pluto* é a simulação de um aplicativo mobile desenvolvido em React Native de monitoramento inteligente para missões espaciais simuladas e/ou mocadas. A solução coleta e processa dados de sensores em tempo real (simulado), gerando alertas automáticos quando valores ultrapassam limiares críticos. O diferencial está na interface temática com dois modos visuais exclusivos — **Modo Espaço** (escuro, com temática do espaço) e **Modo Terra** (light, com temática clara e limpinha) — além de um sistema de análise preditiva que auxilia operadores na tomada de decisão em ambientes críticos.

---

## 👥 Equipe

| Nome | RM |
|------|----|
| Lucas Mendes | RM563667 |
| Gustavo Schimith | RM564800 |
| Antonio Lucas  | RM565516 |

---

## 📱 Telas do Aplicativo

### Home — Dashboard Principal
![Home]:<img width="1911" height="866" alt="print_layout" src="https://github.com/user-attachments/assets/fc96a746-cf5b-4ae8-8c9e-ea169012083c" />
Visão geral da missão ativa com indicadores de temperatura, energia, sinal e estabilidade orbital em tempo real simulado.

### Dashboard de Sensores
![Sensores]:<img width="1911" height="866" alt="print_sensores" src="https://github.com/user-attachments/assets/a2952fb9-f319-4362-9a1d-ba261953894f" />
Gráfico de linha histórico por sensor com seletor interativo e barras de status para todos os parâmetros monitorados.

### Dashboard de Energia
![Energia]:<img width="1911" height="866" alt="print-energia" src="https://github.com/user-attachments/assets/30ae1b44-233b-4229-a0b5-afee03cd44a0" />
Indicador circular de carga, gráfico de barras de consumo por subsistema e status individual dos painéis solares.

### Dashboard de Comunicação
![Comunicação]:<img width="1911" height="866" alt="print-comunics" src="https://github.com/user-attachments/assets/d6475cf2-9fa7-470a-a9a1-9d77fec4179a" />
Status do link de telemetria, latência, largura de banda, taxa de erros e estado dos canais de comunicação.

### Alertas
![Alertas]:<img width="1911" height="866" alt="print-alertas" src="https://github.com/user-attachments/assets/fbcf65cf-727b-4e00-9da2-9584ef87a6ad" />
Lista de alertas ativos gerados automaticamente com nível de criticidade (crítico / atenção), horário e opção de descarte.

### Configurações / Formulário
![Config]:<img width="1911" height="866" alt="print-configs" src="https://github.com/user-attachments/assets/43744e09-a0d3-4867-8c9e-34160ff64b80" />
Formulário de cadastro de missão com validação, configuração de limiares de alerta, alternância de tema e histórico de missões.

---

## ✅ Funcionalidades

- [x] Navegação com Expo Router (Tabs com 6 rotas)
- [x] Dashboard principal com indicadores em tempo real (simulado)
- [x] Dashboard de Sensores com gráfico de linha interativo
- [x] Dashboard de Energia com gráfico de barras e painéis solares
- [x] Dashboard de Comunicação com status de canais e telemetria
- [x] Sistema de alertas automáticos com lógica baseada em limiares configuráveis
- [x] Context API para estado global da missão (consumida em todas as 6 telas)
- [x] Persistência com AsyncStorage (tema, missão, histórico e limiares)
- [x] Formulário de cadastro de missão com validação e feedback de erro
- [x] Formulário de configuração de limiares com validação numérica
- [x] Alternância de tema: **Modo Espaço 🚀** (dark) e **Modo Terra 🌍** (light)
- [x] Badge de alertas críticos na tab bar
- [x] Histórico das últimas missões persistido

---

## 🛠 Tecnologias Utilizadas

- React Native + Expo (~51)
- Expo Router (~3.5)
- @react-native-async-storage/async-storage
- Context API + useReducer
- react-native-chart-kit
- react-native-svg
- @expo/vector-icons (Ionicons)

---

## ▶️ Como Executar

### Pré-requisitos
- Node.js instalado (v18+)
- Expo Go instalado no celular (iOS ou Android)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/space-predictive-analytics.git

# Acesse a pasta
cd space-predictive-analytics

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

Escaneie o QR Code com o Expo Go para rodar no dispositivo físico.

---

## 🎥 Vídeo de Demonstração

[á terminar]

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos — FIAP 2026.
