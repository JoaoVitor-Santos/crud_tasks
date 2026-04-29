# Testes Unitários

Este projeto inclui testes unitários para validar as migrations e funcionalidades do backend.

## Estrutura dos Testes

```
tests/
├── conftest.py          # Configuração dos fixtures de teste
├── test_migrations.py   # Testes das migrations do banco
└── test_user_service.py # Testes dos serviços de usuário
```

## Executando os Testes

### Todos os testes
```bash
cd backend
source venv/bin/activate
python -m pytest tests/ -v
```

### Testes específicos
```bash
# Apenas migrations
python -m pytest tests/test_migrations.py -v

# Apenas serviços
python -m pytest tests/test_user_service.py -v
```

### Com cobertura
```bash
pip install pytest-cov
python -m pytest tests/ --cov=main --cov-report=html
```

## Tipos de Testes

### Testes de Migrations
- ✅ Verificação se todas as tabelas existem
- ✅ Validação dos schemas das tabelas
- ✅ Verificação de tipos de dados
- ✅ Validação de constraints (NOT NULL)
- ✅ Verificação de índices

### Testes de Serviços
- ✅ Validação de imports dos módulos
- ✅ Estrutura dos modelos
- ✅ Funcionalidades dos validadores

## Configuração

Os testes usam o banco de dados principal para evitar complexidade. Em produção, considere usar um banco de dados separado para testes.

## Resultado dos Testes

```
============================== 10 passed in 0.46s ==============================
```

Todos os 10 testes passaram com sucesso!