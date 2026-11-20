# Biblioteca de livros e jogos

Aplicação de console em TypeScript para consultar um acervo, emprestar e devolver itens e reservar livros. O acervo começa com um livro e um jogo. Os dados ficam em memória durante a execução.

## Executar

Com Node.js 20 ou superior, execute na raiz do projeto.

```sh
npm ci
npm run build
npm start
```

O compilador lê `src/` com `strict: true` e gera o JavaScript em `dist/`.

## Usar o console

Digite `1` para consultar os IDs e a disponibilidade. Use `2` para emprestar, `3` para devolver, `4` para reservar um livro, `5` para cancelar a reserva e `0` para sair. Empréstimos de livros reservados exigem o nome usado na reserva. Na devolução, informe quantos dias de atraso houve. Livros cobram R$ 2 por dia e jogos cobram R$ 5 por dia.

## Estrutura

- `src/acervo.ts` contém a classe abstrata, as subclasses, o contrato de reserva e a exceção de domínio. O estado é privado, o ID é somente leitura e a disponibilidade é calculada por um acessor.
- `src/repositorio.ts` contém o repositório genérico, que armazena objetos em um array, e a projeção de leitura definida com `Readonly` e `Pick`.
- `src/index.ts` inicializa o acervo e trata as operações e os erros de domínio no menu.
