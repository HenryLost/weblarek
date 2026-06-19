import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";

interface IPaymentView {
  payment: TPayment;
  address: string;
  valid: boolean;
  errors: string;
}

export class PaymentView extends Component<IPaymentView> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container,
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    this.submitButton = ensureElement<HTMLButtonElement>(
      ".order__button",
      container,
    );

    this.errorsElement = ensureElement(".form__errors", container);

    // Обработчики событий
    this.cardButton.addEventListener("click", () => {
      this.events.emit("payment:change", {
        payment: "card",
      });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit("payment:change", {
        payment: "cash",
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("address:change", {
        address: this.addressInput.value,
      });
    });

    this.container.addEventListener("submit", (evt) => {
      evt.preventDefault();

      this.events.emit("order:submit");
    });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");

    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
