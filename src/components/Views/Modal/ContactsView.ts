import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IContactsView {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
}

export class ContactsView extends Component<IContactsView> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );

    this.errorsElement = ensureElement(".form__errors", container);
    
    // Обработчики событий
    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts.email:change", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts.phone:change", {
        phone: this.phoneInput.value,
      });
    });

    this.container.addEventListener("submit", (evt) => {
      evt.preventDefault();

      this.events.emit("contacts:submit");
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
