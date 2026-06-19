import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

interface IBasketView {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export class BasketView extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.listElement = ensureElement(".basket__list", container);
    this.totalElement = ensureElement(".basket__price", container);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("order:start");
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);

    this.buttonElement.disabled = items.length === 0;
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
