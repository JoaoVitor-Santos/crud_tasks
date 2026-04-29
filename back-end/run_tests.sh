#!/bin/bash

# Script para executar testes
# Uso: ./run_tests.sh [opções]

cd "$(dirname "$0")"

# Ativar ambiente virtual
source venv/bin/activate

# Executar testes
if [ "$1" = "--coverage" ]; then
    echo "Executando testes com cobertura..."
    python -m pytest tests/ --cov=main --cov-report=html -v
else
    echo "Executando testes..."
    python -m pytest tests/ -v
fi