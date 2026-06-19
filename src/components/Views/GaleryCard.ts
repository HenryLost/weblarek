import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface ICard {
  title: string;
  image: string;
  price: number | null;
  category: string;
}

export class GalleryCard extends Component<ICard> {
  protected titleElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement(".card__title", container);
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.priceElement = ensureElement(".card__price", container);
    this.categoryElement = ensureElement(".card__category", container);
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
    this.priceElement.textContent =
      value === null ? 
      "Бесценно" : 
      `${value} синапсов`;
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
}
