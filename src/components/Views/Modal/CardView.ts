import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { EventEmitter } from "../../base/Events";

interface ICardView {
  title: string;
  image: string;
  price: number | null;
  category: string;
  description: string;
  buttonText: string;
  data: IProduct;
}

export class CardView extends Component<ICardView> {
  protected titleElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected currentPrice: number | null = null;
  protected item!: IProduct;

  constructor(
    container: HTMLElement,
    protected events: EventEmitter,
  ) {
    super(container);

    this.titleElement = ensureElement(".card__title", container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    this.priceElement = ensureElement(".card__price", container);

    this.categoryElement = ensureElement(".card__category", container);

    this.descriptionElement = ensureElement(".card__text", container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("basket:toggle", this.item);
    });
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      `${CDN_URL}${value}`,
      this.titleElement.textContent ?? "",
    );
  }

  set price(value: number | null) {
    this.currentPrice = value;

    this.priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;

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
    this.buttonElement.textContent = value;
  }

  set data(value: IProduct) {
    this.item = value;
  }
}
