import { ensureElement } from "../../../utils/utils";
import { Form } from "../Form";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";

interface IPaymentView {
  payment: TPayment;
  address: string;
  valid: boolean;
  errors: string;
}

export class PaymentView extends Form<IPaymentView> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container, ".order__button");

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
}
