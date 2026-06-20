import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected items: IProduct[] = [];

   constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление продукта в корзину
  addProduct(product: IProduct): void {
    this.items.push(product);
    this.events.emit("basket:changed");
  }

  // Удаление продукта из корзины
  removeProduct(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit("basket:changed");
  }

  clearBasket(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  // Подсчёт стоимости товаров в корзине
  getTotalPrice(): number {
    return this.items.reduce(
      (sum, item) => sum + (item.price ?? 0),
      0
    )  
  }

  // Проверка наличия продукта в корзине
  hasProduct(id: string): boolean {
    return this.items.some(
      item => item.id === id
    )  
  }
}