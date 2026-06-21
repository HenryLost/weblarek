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

  constructor(
    container: HTMLElement,
    onDelete: () => void,
  ) {
    super(container);

    this.indexElement = ensureElement(".basket__item-index", container);

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this.deleteButton.addEventListener("click", onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
