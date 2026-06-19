import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected innerContainer: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this.contentElement = ensureElement(".modal__content", container);

    this.innerContainer = ensureElement(".modal__container", container);

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (evt) => {
      if (evt.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  set size(value: "basket" | "card" | "form") {
    this.innerContainer.classList.remove(
      "modal__container_basket",
      "modal__container_card",
      "modal__container_form",
    );

    this.innerContainer.classList.add(`modal__container_${value}`);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();

    this.events.emit("modal:close");
  }
}
