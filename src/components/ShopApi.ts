import {
  IApi,
  IProductsResponse,
  IOrderRequest,
  IOrderResponse,
} from "../types";

export class WebLarekApi {
  constructor(private api: IApi) {}

  // Получение каталога товаров
  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product')
  }
  // Отправка заказа
  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', order)
  }
}