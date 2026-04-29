# 🚀 CRUD de Tarefas com FastAPI + React Native

Aplicação de gerenciamento de tarefas com autenticação JWT. O backend é feito em FastAPI e o frontend é um app Expo React Native.

## 🧰 Requisitos

- Docker
- Docker Compose
- Git

## 📁 Estrutura do projeto

```
CRUD/
├── .env                    # Variáveis de ambiente para Docker
├── docker-compose.yml      # Orquestração de containers
├── README.md               # Guia de execução
├── back-end/
│   ├── Dockerfile          # Build da API Python
│   ├── entrypoint.sh       # Inicialização + migrations
│   ├── requirements.txt    # Dependências Python
│   ├── run.py              # Ponto de entrada do servidor
│   └── main/
│       ├── migrations/     # Alembic migrations
│       ├── models/         # SQLAlchemy models
│       ├── routes/         # Rotas da API
│       ├── services/       # Regras de negócio
│       └── server/         # Configuração da app FastAPI
└── front-end/
    ├── Dockerfile          # Build do app Expo
    ├── package.json        # Dependências Node.js
    ├── App.tsx             # Componente raiz
    └── src/
        ├── screens/        # Telas do app
        └── services/       # Consumo de API
```

## ⚡ Instalação e execução

### 1. Abra o terminal na pasta do projeto

```bash
cd /home/joao/Área\ de\ trabalho/projetos/pratica/CRUD
```

### 2. Verifique/configure o `.env`

O arquivo `.env` deve conter os valores usados pelo Docker e pela aplicação.

```bash
cat .env
```

Exemplo mínimo:

```env
POSTGRES_USER=joao
POSTGRES_PASSWORD=123456
POSTGRES_DB=db_gestao_tarefa
DATABASE_URL=postgresql://joao:123456@db:5432/db_gestao_tarefa
SECRET_KEY=senha-super-secreta
ALGORITHM=HS256
EXPO_PUBLIC_API_URL=http://api:8000
ENV=production
```

### 3. Inicie os containers

```bash
docker-compose up --build
```

Esse comando fará:

- ✅ Criar o container PostgreSQL
- ✅ Subir o serviço de banco de dados
- ✅ Criar/atualizar tabelas via Alembic
- ✅ Inicializar o backend FastAPI na porta `8000`
- ✅ Subir o frontend Expo na porta `8081`

### 4. Acesse os serviços

- API: http://localhost:8000
- Swagger / Docs: http://localhost:8000/docs
- Expo Frontend: http://localhost:8081

> Caso o frontend não abra automaticamente no navegador, acesse `http://localhost:8081` manualmente.

## 🛑 Parar a aplicação

```bash
docker-compose down
```

Para remover volumes e dados do banco:

```bash
docker-compose down -v
```

## 🔧 Executando testes

No diretório `CRUD`:

```bash
pytest
```

## 🔐 Endpoints principais

### Registrar usuário

```bash
curl -X POST http://localhost:8000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","senha":"senha123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","senha":"senha123"}'
```

### Listar tarefas (autenticado)

```bash
curl -X GET http://localhost:8000/api/tarefas \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

## 🧩 Configurações importantes

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — credentials do banco
- `DATABASE_URL` — URL usada pelo backend dentro do Docker
- `EXPO_PUBLIC_API_URL` — URL que o app Expo usa para se conectar ao backend

## 🛠️ Problemas comuns

### Erro: "No 'script_location' key found in configuration"

Significa que o Alembic não encontrou o arquivo `alembic.ini`. O `entrypoint.sh` já foi configurado para usar `alembic -c main/migrations/alembic.ini`.

### Erro: "relation 't_status' does not exist"

Esse erro indica que as migrations não foram aplicadas. Use:

```bash
docker-compose restart api
```

### Erro Expo não interativo

Se o Expo tentar instalar o `@expo/ngrok` automaticamente, use:

```bash
docker-compose up --build
```

e o comando do frontend já está definido para iniciar em modo `localhost`.

## 📚 Tecnologias usadas

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Python 3.12

### Frontend
- Expo
- React Native
- TypeScript
- Axios

## ✅ Observação

O projeto foi preparado para rodar em Docker com backend + frontend + banco, e o arquivo `.env` deve estar presente na raiz do diretório `CRUD`.
