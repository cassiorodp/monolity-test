# Invoice Module

## Como executar os testes

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute os testes do módulo Invoice:
   ```bash
   npx jest --runInBand src/modules/invoice/usecase/generate-invoice/generate-invoice.usecase.spec.ts src/modules/invoice/usecase/find-invoice/find-invoice.usecase.spec.ts src/modules/invoice/facade/invoice.facade.spec.ts
   ```
3. Para validar a compilação do TypeScript:
   ```bash
   npm run tsc -- --noEmit
   ```
