import { ensureElement } from "../../../utils/utils";
import { Card } from "../Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { EventEmitter } from "../../base/Events";

interface ICardView {
  title: string;
  image: string;
  price: number | null;
  category: string;
  description: string;
  buttonText: string;
}

export class CardView extends Card<ICardView> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: EventEmitter,
  ) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    this.categoryElement = ensureElement(".card__category", container);

    this.descriptionElement = ensureElement(".card__text", container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("basket:toggle");
    });
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      `${CDN_URL}${value}`,
      this.titleElement.textContent ?? "",
    );
  }

  set price(value: number | null) {
    super.price = value;

    this.buttonElement.disabled = value === null;

    if (value === null) {
      this.buttonElement.textContent = "Недоступно";
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement.classList.remove(className);
    });

    const categoryClass = categoryMap[value as keyof typeof categoryMap];

    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    if (!this.buttonElement.disabled) {
      this.buttonElement.textContent = value;
    }
  }
}
