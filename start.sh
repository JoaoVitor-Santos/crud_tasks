#!/bin/bash
set -e

# Colors for output
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🚀 Gerenciamento de Tarefas - Docker             ║"
echo "║                                                            ║"
echo "║  Iniciando aplicação com Backend + Frontend + PostgreSQL  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${YELLOW}📋 Verificações iniciais...${NC}\n"

# Run validation script
if [ -f "./validate-setup.sh" ]; then
    ./validate-setup.sh
else
    echo -e "${YELLOW}⚠ Script de validação não encontrado.${NC}"
fi

echo -e "\n${BLUE}────────────────────────────────────────────────────────${NC}\n"

# Ask user if they want to proceed
echo -e "${YELLOW}Deseja iniciar os containers? (S/n)${NC}"
read -r response

if [[ ! "$response" =~ ^[Ss]?$ ]]; then
    echo -e "${YELLOW}❌ Operação cancelada pelo usuário.${NC}"
    exit 0
fi

echo -e "\n${CYAN}🐳 Iniciando Docker Compose...${NC}\n"

docker-compose up

echo -e "\n${GREEN}✅ Aplicação encerrada.${NC}"
