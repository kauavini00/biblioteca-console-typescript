export interface Reservavel {
  reservar(nome: string): void;
  cancelarReserva(): void;
}

export class ErroAcervo extends Error {}

export abstract class ItemAcervo {
  private static _contadorId = 0;
  private readonly identificador = ++ItemAcervo._contadorId;
  private emprestado = false;

  constructor(private readonly titulo: string) {}

  get id(): number {
    return this.identificador;
  }

  get nome(): string {
    return this.titulo;
  }

  get statusDisponibilidade(): string {
    return this.emprestado ? "Emprestado" : "Disponível";
  }

  emprestar(): void {
    if (this.emprestado) throw new ErroAcervo("O item já está emprestado.");
    this.emprestado = true;
  }

  devolver(diasAtraso: number): number {
    if (!this.emprestado) throw new ErroAcervo("O item não está emprestado.");
    const multa = this.calcularMulta(diasAtraso);
    this.emprestado = false;
    return multa;
  }

  protected validarDias(diasAtraso: number): void {
    if (!Number.isSafeInteger(diasAtraso) || diasAtraso < 0) {
      throw new ErroAcervo("Informe um número inteiro de dias maior ou igual a zero.");
    }
  }

  abstract calcularMulta(diasAtraso: number): number;
}

export class Livro extends ItemAcervo implements Reservavel {
  private reserva: string | undefined;

  constructor(titulo: string, private readonly autor: string) {
    super(titulo);
  }

  get autoria(): string {
    return this.autor;
  }

  override get statusDisponibilidade(): string {
    return this.reserva === undefined ? super.statusDisponibilidade : "Reservado";
  }

  reservar(nome: string): void {
    const pessoa = nome.trim();
    if (!pessoa) throw new ErroAcervo("Informe o nome para a reserva.");
    if (this.statusDisponibilidade !== "Disponível") {
      throw new ErroAcervo("Apenas livros disponíveis podem ser reservados.");
    }
    this.reserva = pessoa;
  }

  cancelarReserva(): void {
    if (this.reserva === undefined) throw new ErroAcervo("O livro não tem reserva.");
    this.reserva = undefined;
  }

  override emprestar(nome = ""): void {
    if (this.reserva !== undefined && this.reserva !== nome.trim()) {
      throw new ErroAcervo("O livro está reservado para outra pessoa.");
    }
    super.emprestar();
    this.reserva = undefined;
  }

  override calcularMulta(diasAtraso: number): number {
    this.validarDias(diasAtraso);
    return diasAtraso * 2;
  }
}

export class JogoEletronico extends ItemAcervo {
  constructor(titulo: string, private readonly plataforma: string) {
    super(titulo);
  }

  get sistema(): string {
    return this.plataforma;
  }

  override calcularMulta(diasAtraso: number): number {
    this.validarDias(diasAtraso);
    return diasAtraso * 5;
  }
}
