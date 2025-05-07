## Rotas da API

### Cardápio

#### Criar Cardápio
- **Método**: POST
- **URL**: `http://localhost:3000/menu/cardapio`
- **Body** (JSON):
```json
{
  "nome": "Cardápio Principal",
  "descricao": "Cardápio do restaurante",
  "ativo": true
}
```

#### Listar Cardápios
- **Método**: GET
- **URL**: `http://localhost:3000/menu/cardapio`

#### Buscar Cardápio por ID
- **Método**: GET
- **URL**: `http://localhost:3000/menu/cardapio/{id}`

#### Atualizar Cardápio
- **Método**: PUT
- **URL**: `http://localhost:3000/menu/cardapio/{id}`
- **Body** (JSON):
```json
{
  "nome": "Novo Nome",
  "descricao": "Nova descrição",
  "ativo": true
}
```

#### Deletar Cardápio
- **Método**: DELETE
- **URL**: `http://localhost:3000/menu/cardapio/{id}`

### Menu Item

#### Criar Item do Menu
- **Método**: POST
- **URL**: `http://localhost:3000/menu`
- **Body** (JSON):
```json
{
  "tipo": "PRATO",
  "nome": "X-Burger",
  "descricao": "Hambúrguer com queijo",
  "valor": 25.90,
  "valorPromocional": 19.90,
  "tipoComplemento": "BEBIDA",
  "qtdMinima": 1,
  "qtdMaxima": 3,
  "cardapioId": 1
}
```

#### Listar Itens do Menu
- **Método**: GET
- **URL**: `http://localhost:3000/menu`

#### Buscar Item do Menu por ID
- **Método**: GET
- **URL**: `http://localhost:3000/menu/{id}`

#### Atualizar Item do Menu
- **Método**: PUT
- **URL**: `http://localhost:3000/menu/{id}`
- **Body** (JSON):
```json
{
  "tipo": "PRATO",
  "nome": "X-Burger Especial",
  "descricao": "Hambúrguer com queijo e bacon",
  "valor": 29.90,
  "valorPromocional": 24.90,
  "tipoComplemento": "BEBIDA",
  "qtdMinima": 1,
  "qtdMaxima": 3,
  "cardapioId": 1
}
```

#### Deletar Item do Menu
- **Método**: DELETE
- **URL**: `http://localhost:3000/menu/{id}`

### Observações
- Substitua `{id}` pelo ID real do recurso que você deseja acessar
- Todas as rotas retornam respostas em formato JSON
- Em caso de erro, a API retornará um objeto com a mensagem de erro e o status code apropriado


## Em caso de erro de migrations seguir os passos:

- rm -r prisma/migrations

- npx prisma migrate dev --name init

- npx prisma db push --force-reset

- npx prisma migrate reset --force

- npx prisma db push
