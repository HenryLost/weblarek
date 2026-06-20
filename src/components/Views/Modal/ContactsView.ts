import { ensureElement } from "../../../utils/utils";
import { Form } from "../Form";
import { IEvents } from "../../base/Events";

interface IContactsView {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
}

export class ContactsView extends Form<IContactsView> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container, 'button[type="submit"]');

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );
    
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
}
