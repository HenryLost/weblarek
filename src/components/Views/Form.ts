import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IForm {
  valid: boolean;
  errors: string;
}

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement, submitSelector: string) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      submitSelector, 
      container
    );

    this.errorsElement = ensureElement(".form__errors", container);
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}