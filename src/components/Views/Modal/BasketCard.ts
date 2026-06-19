import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

interface IBasketCard {
  index: number,
  title: string,
  price: number | null
}

export class BasketCard extends Component<IBasketCard> {
  protected indexElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.indexElement = ensureElement(
      '.basket__item-index',
      container
    );

    this.titleElement = ensureElement(
      '.card__title',
      container
    );

    this.priceElement = ensureElement(
      '.card__price',
      container
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      container
    );
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value !== null ?  
      `${value} синапсов`
      : "-";
  }

  set onDelete(handler: () => void) {
    this.deleteButton.addEventListener('click', handler);
  }
}