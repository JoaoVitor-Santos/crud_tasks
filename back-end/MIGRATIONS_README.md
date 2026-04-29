# Database Migrations

Este projeto usa Alembic para gerenciar migrations do banco de dados.

## Comandos Úteis

### Criar uma nova migration
```bash
cd /path/to/backend
source venv/bin/activate
alembic -c main/migrations/alembic.ini revision --autogenerate -m "Descrição da migration"
```

### Aplicar migrations
```bash
alembic -c main/migrations/alembic.ini upgrade head
```

### Reverter migration
```bash
alembic -c main/migrations/alembic.ini downgrade -1
```

### Ver status das migrations
```bash
alembic -c main/migrations/alembic.ini current
alembic -c main/migrations/alembic.ini history
```

## Estrutura

- `main/migrations/alembic.ini`: Configuração do Alembic
- `main/migrations/alembic/env.py`: Configuração do ambiente
- `main/migrations/alembic/versions/`: Arquivos de migration

## Notas

- As tabelas são criadas via migrations em vez de `create_all()`
- O seeding de status ainda é feito automaticamente no startup
- Sempre crie migrations para mudanças no schema do banco