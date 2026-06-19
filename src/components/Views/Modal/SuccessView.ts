import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface ISuccessView {
  total: number;
}

export class SuccessView extends Component<ISuccessView> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.descriptionElement = ensureElement(
      ".order-success__description",
      container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    // Обработчики событий
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close')
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
