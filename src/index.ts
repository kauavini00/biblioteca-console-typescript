import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { ErroAcervo, ItemAcervo, JogoEletronico, Livro } from "./acervo";
import { RepositorioMemoria, ResumoItem } from "./repositorio";

async function executar(): Promise<void> {
  const repositorio = new RepositorioMemoria<ItemAcervo>();
  repositorio.adicionar(new Livro("Dom Casmurro", "Machado de Assis"));
  repositorio.adicionar(new JogoEletronico("Celeste", "PC"));
  const consoleEntrada = createInterface({ input: stdin, output: stdout });
  const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const menu = "1. Listar | 2. Emprestar | 3. Devolver | 4. Reservar | 5. Cancelar reserva | 0. Sair";

  console.log("Biblioteca de livros e jogos");
  console.log(menu);
  const linhas = consoleEntrada[Symbol.asyncIterator]();

  async function ler(pergunta: string): Promise<string | undefined> {
    stdout.write(pergunta);
    const linha = await linhas.next();
    return linha.done ? undefined : linha.value.trim();
  }

  try {
    while (true) {
      const opcao = await ler("> ");
      if (opcao === undefined || opcao === "0") break;
      try {
        if (opcao === "1") {
          const resumos: ResumoItem[] = repositorio.listar().map(
            ({ id, nome, statusDisponibilidade }) => ({ id, nome, statusDisponibilidade }),
          );
          for (const { id, nome, statusDisponibilidade } of resumos) {
            console.log(`${id}. ${nome} — ${statusDisponibilidade}`);
          }
          continue;
        }
        if (!["2", "3", "4", "5"].includes(opcao)) {
          throw new ErroAcervo("Opção inválida.");
        }
        const entradaId = await ler("ID do item: ");
        if (entradaId === undefined) break;
        if (!/^\d+$/.test(entradaId)) throw new ErroAcervo("Informe um ID numérico.");
        const item = repositorio.buscarPorId(Number(entradaId));

        if (opcao === "2") {
          if (item instanceof Livro && item.statusDisponibilidade === "Reservado") {
            const nome = await ler("Nome usado na reserva: ");
            if (nome === undefined) break;
            item.emprestar(nome);
          } else {
            item.emprestar();
          }
          console.log("Empréstimo registrado.");
        } else if (opcao === "3") {
          const entradaDias = await ler("Dias de atraso (0 se devolvido no prazo): ");
          if (entradaDias === undefined) break;
          if (!/^\d+$/.test(entradaDias)) throw new ErroAcervo("Informe dias inteiros e não negativos.");
          const multa = item.devolver(Number(entradaDias));
          console.log(`Devolução registrada. Multa: ${moeda.format(multa)}.`);
        } else {
          if (!(item instanceof Livro)) throw new ErroAcervo("Somente livros aceitam reservas.");
          if (opcao === "4") {
            const nome = await ler("Nome para a reserva: ");
            if (nome === undefined) break;
            item.reservar(nome);
            console.log("Reserva registrada.");
          } else {
            item.cancelarReserva();
            console.log("Reserva cancelada.");
          }
        }
      } catch (erro) {
        if (!(erro instanceof ErroAcervo)) throw erro;
        console.log(erro.message);
      }
    }
  } finally {
    consoleEntrada.close();
  }
}

executar().catch((erro: unknown) => {
  console.error("Falha ao executar a aplicação.", erro);
  process.exitCode = 1;
});
