import { IProduct } from "../../types";

// Только хранение данных!
export class Products {
  protected items: IProduct[] = [];
  protected selected: IProduct | null = null;

  // Получаем список товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Сохраняем список товаров
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  // Получаем товар по его id
  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  // Сохраняем выбранную карточку
  setSelected(product: IProduct): void {
    this.selected = product;
  }

  // Получаем выбранную карточку
  getSelected(): IProduct | null {
    return this.selected;
  }
}

