import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface IGalleryCard {
  title: string;
  image: string;
  price: number | null;
  category: string;
}

export class GalleryCard extends Card<IGalleryCard> {
  protected imageElement: HTMLImageElement;
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

  set image(value: string) {
    this.setImage(
      this.imageElement,
      `${CDN_URL}${value}`,
      this.titleElement.textContent ?? "",
    );
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
