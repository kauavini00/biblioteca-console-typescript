import { ErroAcervo, ItemAcervo } from "./acervo";

export class RepositorioMemoria<T extends { readonly id: number }> {
  private readonly itens: T[] = [];

  adicionar(item: T): void {
    if (this.itens.some((existente) => existente.id === item.id)) {
      throw new ErroAcervo("Já existe um item com esse ID.");
    }
    this.itens.push(item);
  }

  buscarPorId(id: number): T {
    const item = this.itens.find((existente) => existente.id === id);
    if (!item) throw new ErroAcervo("Item não encontrado.");
    return item;
  }

  listar(): ReadonlyArray<T> {
    return [...this.itens];
  }
}

export type ResumoItem = Readonly<Pick<ItemAcervo, "id" | "nome" | "statusDisponibilidade">>;
