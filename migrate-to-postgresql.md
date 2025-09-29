# Migração de MySQL para PostgreSQL

## Passos para completar a migração:

### 1. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/projeto_final?schema=public"

# JWT Secret
JWT_SECRET="seu_jwt_secret_aqui"
```

**Substitua os valores:**
- `usuario`: seu usuário do PostgreSQL
- `senha`: sua senha do PostgreSQL
- `localhost:5432`: host e porta do seu PostgreSQL
- `projeto_final`: nome do banco de dados
- `seu_jwt_secret_aqui`: uma string secreta para JWT

### 2. Instalar PostgreSQL (se ainda não tiver)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS com Homebrew
brew install postgresql
brew services start postgresql

# Windows
# Baixe do site oficial: https://www.postgresql.org/download/windows/
```

### 3. Criar o banco de dados
```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Criar banco de dados
CREATE DATABASE projeto_final;

# Criar usuário (opcional)
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE projeto_final TO seu_usuario;

# Sair
\q
```

### 4. Executar a migração
```bash
# Gerar nova migração
npx prisma migrate dev --name init_postgresql

# Ou se preferir resetar completamente
npx prisma migrate reset
```

### 5. Gerar o cliente Prisma
```bash
npx prisma generate
```

### 6. Testar a conexão
```bash
npx prisma db push
```

## Arquivos modificados:
- ✅ `package.json` - Removido mysql2, adicionado pg
- ✅ `prisma/schema.prisma` - Alterado provider para postgresql
- ✅ `prisma/migrations/migration_lock.toml` - Atualizado provider

## Código que usa Prisma:
- ✅ `src/config/database.js` - Já usa Prisma Client (compatível)
- ✅ `src/repositories/menu.repository.js` - Já usa Prisma (compatível)
- ✅ `src/controllers/` - Já usa Prisma (compatível)

## Arquivo antigo com MySQL:
- ⚠️ `src/old/principal.js` - Contém código MySQL antigo (não afeta a API atual)
