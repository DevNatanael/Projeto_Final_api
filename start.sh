#!/bin/bash

# Script de inicialização do projeto
# Este script instala dependências, configura o Prisma e inicia o servidor

set -e  # Para o script se algum comando falhar

echo "🚀 Iniciando configuração do projeto..."

# Instala as dependências do npm
echo ""
echo "📦 Instalando dependências do npm..."
npm install

# Gera o cliente Prisma
echo ""
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Executa as migrações do banco de dados
echo ""
echo "🗄️  Executando migrações do banco de dados..."
if npx prisma migrate deploy; then
    echo "✅ Migrações aplicadas com sucesso"
elif npx prisma migrate dev --name init; then
    echo "✅ Migrações de desenvolvimento criadas e aplicadas"
else
    echo "⚠️  Erro ao aplicar migrações. Tentando sincronizar o schema..."
    if npx prisma db push --skip-generate --accept-data-loss; then
        echo "✅ Schema sincronizado com o banco de dados"
    else
        echo "❌ Erro ao sincronizar o banco de dados"
        echo "💡 Verifique sua conexão e configuração do banco de dados"
        exit 1
    fi
fi

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🌐 Iniciando servidor..."
echo ""


