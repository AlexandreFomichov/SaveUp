# SaveUp - Gestão de Despesas Pessoais

Aplicação web para gestão e controlo de despesas, orçamento e depósitos pessoais.

## 🚀 Funcionalidades

- **Autenticação**: Login e registo de utilizadores com encriptação de passwords
- **Dashboard**: Visão geral do saldo e despesas
- **Gestão de Despesas**: Adicionar, visualizar e categorizar despesas
- **Orçamento**: Definir e monitorizar orçamento mensal com barras de progresso
- **Simulador de Depósitos**: Simular crescimento de poupanças
- **Sincronização em Tempo Real**: Atualização automática de dados entre abas

## 🛠️ Stack Tecnológico

**Frontend:**
- React 19
- Vite (build tool)
- React Router DOM (routing)
- CSS3 (estilos)

**Backend:**
- Node.js + Express
- MySQL 2
- JWT (autenticação)
- bcryptjs (encriptação)

## 📋 Instalação

```bash
# Instalar dependências
npm install

# Variáveis de ambiente
# Criar ficheiro .env com:
DB_HOST=seu_host
DB_PORT=3306
DB_USER=seu_utilizador
DB_NAME=saveup
DB_PASSWORD=sua_password
JWT_SECRET=sua_chave_secreta
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## 🏃 Execução

```bash
# Desenvolvimento (Frontend + Backend simultaneamente)
npm run dev:all

# Apenas Frontend
npm run dev

# Apenas Backend
npm run server

# Build para produção
npm run build

# Produção
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── componentes/      # Componentes reutilizáveis (CartaoSaldo, PopupNotificacao, etc.)
├── paginas/         # Páginas principais (Login, Dashboard, Despesas, etc.)
├── context/         # React Context (Autenticação)
├── ganchos/         # Custom Hooks (useDashboardData, useSincronizacaoDados)
├── servicos/        # Serviços de API e mock de dados
├── utilitarios/     # Funções utilitárias (formatadores)
├── configuracao/    # Configurações da aplicação
└── routes/          # Proteção de rotas autenticadas
```

## 🌐 Deployment

A aplicação está deployed no Railway com:
- Frontend em produção
- Backend (Node.js) com base de dados MySQL
- Variáveis de ambiente configuradas

## 📝 Notas

- A aplicação utiliza autenticação JWT para segurança
- Sincronização em tempo real entre abas via WebSocket
- Base de dados MySQL em ambiente Railway

## 👨‍💻 Desenvolvido em 2026
