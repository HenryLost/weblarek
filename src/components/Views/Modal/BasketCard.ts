import { ensureElement } from "../../../utils/utils";
import { Card } from "../Card";

interface IBasketCard {
  index: number;
  title: string;
  price: number | null;
}

export class BasketCard extends Card<IBasketCard> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.indexElement = ensureElement(".basket__item-index", container);

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value !== null ? `${value} синапсов` : "-";
  }

  set onDelete(handler: () => void) {
    this.deleteButton.addEventListener("click", handler);
  }
}
