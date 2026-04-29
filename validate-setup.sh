#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Validando configuração do Docker Compose...${NC}\n"

# Check required files
echo "Verificando arquivos necessários..."
required_files=(
    "docker-compose.yml"
    ".env"
    "back-end/Dockerfile"
    "back-end/entrypoint.sh"
    "back-end/requirements.txt"
    "back-end/run.py"
    "back-end/main/migrations/alembic.ini"
    "back-end/main/migrations/alembic/env.py"
    "front-end/Dockerfile"
    "front-end/package.json"
)

errors=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (FALTANDO)"
        errors=$((errors + 1))
    fi
done

if [ $errors -gt 0 ]; then
    echo -e "\n${RED}❌ Faltam $errors arquivo(s). Não é possível iniciar.${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Todos os arquivos necessários existem!${NC}\n"

# Check .env variables
echo "Verificando variáveis de ambiente..."
env_vars=(
    "POSTGRES_USER"
    "POSTGRES_PASSWORD"
    "POSTGRES_DB"
    "SECRET_KEY"
    "DATABASE_URL"
)

for var in "${env_vars[@]}"; do
    if grep -q "^${var}=" .env; then
        value=$(grep "^${var}=" .env | cut -d'=' -f2)
        echo -e "${GREEN}✓${NC} $var=$value"
    else
        echo -e "${RED}✗${NC} $var (FALTANDO NO .env)"
        errors=$((errors + 1))
    fi
done

if [ $errors -gt 0 ]; then
    echo -e "\n${RED}❌ Faltam variáveis no .env${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Todas as variáveis estão configuradas!${NC}\n"

# Check if docker and docker-compose are installed
echo "Verificando dependências..."
if command -v docker &> /dev/null; then
    docker_version=$(docker --version)
    echo -e "${GREEN}✓${NC} Docker instalado: $docker_version"
else
    echo -e "${RED}✗${NC} Docker não está instalado"
    errors=$((errors + 1))
fi

if command -v docker-compose &> /dev/null; then
    compose_version=$(docker-compose --version)
    echo -e "${GREEN}✓${NC} Docker Compose instalado: $compose_version"
else
    echo -e "${YELLOW}⚠${NC} docker-compose não encontrado, verificando plugin docker compose..."
    if docker compose version &> /dev/null; then
        echo -e "${GREEN}✓${NC} Plugin Docker Compose disponível"
    else
        echo -e "${RED}✗${NC} Docker Compose não está instalado"
        errors=$((errors + 1))
    fi
fi

if [ $errors -gt 0 ]; then
    echo -e "\n${RED}❌ Faltam dependências. Instale Docker e Docker Compose.${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Todas as dependências estão instaladas!${NC}\n"

# Summary
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Validação completa! Tudo pronto para iniciar.${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}\n"

echo "Para iniciar a aplicação, execute:"
echo -e "${YELLOW}docker-compose up${NC}\n"

echo "Serviços que serão iniciados:"
echo "  • PostgreSQL: localhost:5432"
echo "  • Backend (FastAPI): http://localhost:8000"
echo "  • API Docs (Swagger): http://localhost:8000/docs"
echo "  • Frontend (Expo): http://localhost:8081\n"

echo "Para parar a aplicação:"
echo -e "${YELLOW}docker-compose down${NC}\n"
