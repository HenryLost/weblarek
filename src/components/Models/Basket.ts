import { IProduct } from "../../types";

// Только хранение данных!
export class Basket {
  protected items: IProduct[] = [];

  // Добавление продукта в корзину
  addProduct(product: IProduct): void {
    this.items.push(product);
  }

  // Удаление продукта из корзины
  removeProduct(id: string): void {
    this.items = this.items.filter(
    item => item.id !== id
  )}

  // Подсчёт количества продуктов в корзине
  getCountProducts(): IProduct[] {
    return this.items;
  }

  // Подсчёт стоимости товаров в корзине
  getTotalPrice(): number {
    return this.items.reduce(
      (sum, item) => sum + (item.price ?? 0),
      0
    )  
  }

  // Проверка наличия продукта в магазине
  hasProduct(id: string): boolean {
    return this.items.some(
      item => item.id === id
    )  
  }
}