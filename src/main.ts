import "./scss/styles.scss";

import { API_URL } from "./utils/constants";
// Импортируем моковые данные для проверки работы модели
import { apiProducts } from "./utils/data";

import { Products } from "./components/Models/Produsts";
import { Basket } from "./components/Models/Basket";
import { Order } from "./components/Models/Order";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/ShopApi";

// Создаём API-слой
const api = new Api(API_URL);
const webApi = new WebLarekApi(api);

// Добавляем модели
const productsModel = new Products();
const basketModel = new Basket();
const orderModel = new Order();

// Проверка моделей на моковых данных

// Сохраняем товары в модель
productsModel.setItems(apiProducts.items);
// Получаем список товаров на странице
console.log("Массив товаров из каталога: ", productsModel.getItems());

const product = apiProducts.items[0];

// Products

// Проверяем работу метода setSelected() - сохранения выбранной карточки товара
productsModel.setSelected(product);
// Проверяем работу метода getSelected() - получения выбранной карточки товара
console.log("Выбранный  товар: ", productsModel.getSelected());
// Проверяем работу метода getItemById() - поиск товара по id
console.log("Товар найден по id: ", productsModel.getItemById(product.id));

// Basket

// Проверяем работу метода hasProduct() - наличия товара в магазине
console.log("Товар добавлен: ", basketModel.hasProduct(product.id));
// Проверяем работу метода getCountProducts() -
// подсчёта количества товаров в корзине
console.log(
  "Количество товаров в корзине: ",
  basketModel.getCountProducts().length,
);
// Проверяем работу метода getTotalPrice() - общаей стоимости товаров в корзине
console.log("Общая стоимость товаров в корзине: ", basketModel.getTotalPrice());
// Проверяем работу метода removeProduct() - удаления товара из корзины
basketModel.removeProduct(product.id);
// Проверяем, что товар был удалён из корзины
console.log("Товар удалён: ", !basketModel.hasProduct(product.id));

// Проверка работу метода clearBasket() - очистки корзины

// Добавляем товары в корзину методом addProduct()
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[1]);

basketModel.clearBasket();
// Проверяем, что корзина очищена
console.log("Корзина очищена: ", basketModel.getCountProducts().length === 0);

// Order

console.log("Начальные данные покупателя:", orderModel.getBuyer());

console.log("Ошибки пустой формы:", orderModel.validateOrder());

// Частичное заполнение
orderModel.setBuyer({
  payment: "card",
});

console.log('После выбора оплаты:',
  orderModel.getBuyer()
);

// Дополняем данные
orderModel.setBuyer({
  email: "test@test.ru",
});

orderModel.setBuyer({
  phone:  '+79999999999',
  address: 'Москва'
});

console.log("Данные после заполнения:", orderModel.getBuyer());

console.log("Ошибки заполненной формы:", orderModel.validateOrder());

// Очищаем форму
orderModel.clearOrder();

console.log("Данные после очистки:", orderModel.getBuyer());

// Проверка загрузки с сервера

webApi
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items);

    console.log(
      "Товары успешно загружены с сервера:",
      productsModel.getItems(),
    );

    console.log(
      "Количество товаров совпадает:",
      productsModel.getItems().length === data.items.length,
    );
  })
  .catch((err) => {
    console.error("Ошибка загрузки:", err);
  });
