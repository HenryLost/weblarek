import "./scss/styles.scss";

import { Products } from "./components/Models/Produsts";
import { Basket } from "./components/Models/Basket";
import { Order } from "./components/Models/Order";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/base/ShopApi";

// Создаём API-слой
const api = new Api("https://larek-api.nomoreparties.co/api/weblarek");
const webApi = new WebLarekApi(api);

// Добавляем модели
const productsModel = new Products();
const basketModel = new Basket();
const orderModel = new Order();

// Проверка методов класса Products

webApi
  .getProducts()
  .then((data) => {
    // Сохраняем товары в модель
    productsModel.setItems(data.items);

    // Получаем список товаров на странице
    console.log("Массив товаров из каталога: ", productsModel.getItems());

    // Проверяем, что товары сохранились
    console.log(
      "Количество товаров совпадает: ",
      productsModel.getItems().length === data.items.length,
    );

    // Выбираем первый товар из каталога для тестирования setSelected() и getSelected() -
    // методов для сохранения и получения выбранной карточки товара
    const product = data.items[0];

    // Проверяем работу метода setSelected() - сохранения выбранной карточки товара
    productsModel.setSelected(product);

    // Проверяем работу метода getSelected() - получения выбранной карточки товара
    console.log("Выбранный  товар: ", productsModel.getSelected());

    // Убеждаемся, что getSelected() возвращает тот же объект, что
    // был передан в setSelected(),
    // другими словами: Проверяем, что выбран именно нужный товар
    console.log(
      "Выбранный товар совпадает: ",
      productsModel.getSelected() === product,
    );

    // Проверка методов класса Basket

    // Берём товары из модели
    const basketProduct = product;

    // Проверяем работу метода addProduct() - добавления товара в корзину
    basketModel.addProduct(basketProduct);

    // Проверяем работу метода getCountProducts() -
    // подсчёта количества товаров в корзине
    console.log(
      "Количество товаров в корзине: ",
      basketModel.getCountProducts().length,
    );

    // Проверяем работу метода hasProduct() - наличия товара в магазине
    console.log("Товар добавлен: ", basketModel.hasProduct(basketProduct.id));

    // Проверяем работу метода getTotalPrice() - общаей стоимости товаров в корзине
    console.log(
      "Общая стоимость товаров в корзине: ",
      basketModel.getTotalPrice(),
    );

    // Проверяем работу метода removeProduct() - удаления товара из корзины
    basketModel.removeProduct(basketProduct.id);

    // Проверяем, что товар был удалён из корзины
    console.log("Товар удалён: ", !basketModel.hasProduct(basketProduct.id));

    // Проверка содержимого корзины после удаления товара
    console.log(
      "Товары в корзине после удаления: ",
      basketModel.getCountProducts(),
    );

    // Проверка методов класса Order

    // Получаем данные покупателя
    console.log("Данные покупателя: ", orderModel.getBuyer());

    // Проверяем корректность данных заказа
    console.log(
      "Данные покупателя заполнены корректно: ",
      orderModel.validateOrder(),
    );
  })
  .catch((err) => {
    console.error("Ошибка загрузки:", err);
  });
