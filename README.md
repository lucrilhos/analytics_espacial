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
![Home](./assets/screenshots/print_layout.png)
Visão geral da missão ativa com indicadores de temperatura, energia, sinal e estabilidade orbital em tempo real simulado.

### Dashboard de Sensores
![Sensores](./assets/screenshots/print_sensores.png)
Gráfico de linha histórico por sensor com seletor interativo e barras de status para todos os parâmetros monitorados.

### Dashboard de Energia
![Energia](./assets/screenshots/print-energia.png)
Indicador circular de carga, gráfico de barras de consumo por subsistema e status individual dos painéis solares.

### Dashboard de Comunicação
![Comunicação](./assets/screenshots/print-comunics.png)
Status do link de telemetria, latência, largura de banda, taxa de erros e estado dos canais de comunicação.

### Alertas
![Alertas](./assets/screenshots/print-alertas.png)
Lista de alertas ativos gerados automaticamente com nível de criticidade (crítico / atenção), horário e opção de descarte.

### Configurações / Formulário
![Config](./assets/screenshots/print-configs.png)
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
