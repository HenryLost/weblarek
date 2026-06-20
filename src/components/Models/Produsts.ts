import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  // Сохраняем список товаров
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("products:changed");
  }

  // Получаем список товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Сохраняем выбранную карточку
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit("product:selected", item);
  }

  // Получаем выбранную карточку
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }

  // Получаем товар по его id
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }
}
