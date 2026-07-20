# FC Monolito — Sistemas Monolíticos: API e Testes End-to-End

Monólito modular (DDD) com os módulos `client-adm`, `product-adm`, `store-catalog`, `payment`, `invoice` e `checkout`, expostos através de uma API REST em Express.

## Tecnologias

- TypeScript
- Express
- Sequelize + sequelize-typescript (SQLite)
- Umzug (migrations)
- Jest + Supertest (testes unitários, de integração e E2E)

## Instalação

```bash
npm install
```

## Executando os testes

O comando abaixo roda a checagem de tipos (`tsc --noEmit`) seguida de toda a suíte Jest — testes unitários de use case, testes de integração de repositório/facade (via migrations) e os testes E2E das rotas HTTP (via Supertest):

```bash
npm test
```

## Executando a API localmente

```bash
npm run dev
```

O servidor sobe na porta `3000` (configurável via `PORT`) e usa um arquivo SQLite local (`./db.sqlite3` por padrão, configurável via `DB_STORAGE`). As migrations rodam automaticamente na inicialização, criando as tabelas `client`, `products`, `transactions` e `invoices`.

Para build de produção:

```bash
npm run build
npm start
```

## Observação sobre a tabela `products`

Os módulos `product-adm` e `store-catalog` possuem cada um seu próprio model Sequelize, mas ambos apontam para a mesma tabela física `products` (um mantém `purchasePrice`/`stock`, o outro `salesPrice`). Para evitar o erro de criação de tabela duplicada/colunas ausentes, o schema do banco é gerido por **migrations (Umzug)** em vez de `sequelize.sync()`, com uma única migration que cria a tabela `products` já contendo todas as colunas usadas pelos dois módulos.

Os testes de integração/facade que antes usavam `sequelize.sync({ force: true })` foram atualizados para usar `migrator(sequelize).up()` / `.down()`, seguindo o padrão de [`product-migrations.spec.ts`](https://github.com/devfullcycle/fc-monolito/blob/386b5a5a4ea1d20a8ba1de56b9babcefab469759/src/test-migrations/product-migrations.spec.ts#L29-L39).

Como o endpoint `POST /products` cadastra apenas dados de `product-adm`, o `salesPrice` (usado por `store-catalog`/checkout) é informado opcionalmente no mesmo request e persistido na mesma linha da tabela; se omitido, assume o valor de `purchasePrice`.

## Endpoints

### Products

`POST /products`

```json
{
  "name": "Notebook",
  "description": "Notebook Gamer",
  "purchasePrice": 2000,
  "stock": 5,
  "salesPrice": 2500
}
```

→ `201 Created` com o produto criado (`id`, `name`, `description`, `purchasePrice`, `stock`, `salesPrice`).

### Clients

`POST /clients`

```json
{
  "name": "Alice",
  "email": "alice@test.com",
  "document": "111222333",
  "address": {
    "street": "Rua A",
    "number": "1",
    "complement": "",
    "city": "Florianópolis",
    "state": "SC",
    "zipCode": "88000-000"
  }
}
```

→ `201 Created` com o cliente criado.

### Checkout

`POST /checkout`

```json
{
  "clientId": "<id retornado por POST /clients>",
  "products": [{ "productId": "<id retornado por POST /products>" }]
}
```

Fluxo executado pelo módulo `checkout`: busca o cliente, valida estoque de cada produto, calcula o total (soma do `salesPrice` no catálogo), processa o pagamento (aprovado se `total >= 100`) e, se aprovado, gera a nota fiscal.

→ `201 Created`:

```json
{
  "id": "order-id",
  "invoiceId": "invoice-id",
  "status": "approved",
  "total": 2500,
  "products": [{ "productId": "..." }]
}
```

> Pedidos não são persistidos em banco — o módulo `checkout` mantém as orders apenas em memória durante a execução do processo.

### Invoice

`GET /invoice/{id}`

→ `200 OK` com os dados da nota fiscal, ou `404 Not Found` se não existir.

## Fluxo completo de compra (exemplo com curl)

```bash
# 1. Cadastrar cliente
curl -X POST http://localhost:3000/clients -H 'Content-Type: application/json' -d '{...}'

# 2. Cadastrar produto
curl -X POST http://localhost:3000/products -H 'Content-Type: application/json' -d '{...}'

# 3. Realizar checkout
curl -X POST http://localhost:3000/checkout -H 'Content-Type: application/json' -d '{"clientId":"...","products":[{"productId":"..."}]}'

# 4. Consultar a nota fiscal gerada
curl http://localhost:3000/invoice/<invoiceId>
```
