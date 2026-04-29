#!/bin/bash
set -e

# Variáveis padrão
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-${POSTGRES_USER}}
DB_NAME=${DB_NAME:-${POSTGRES_DB}}

echo "Waiting for database to be ready at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null || PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "select 1" > /dev/null 2>&1; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Database is up - running migrations..."
alembic -c main/migrations/alembic.ini upgrade head

echo "Starting server..."
python run.py
