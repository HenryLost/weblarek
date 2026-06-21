import "./scss/styles.scss";

import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/ShopApi";

import { IOrderResponse, IProduct, TPayment } from "./types";
import { Products } from "./components/Models/Produsts";
import { Basket } from "./components/Models/Basket";
import { Order } from "./components/Models/Order";

import { EventEmitter } from "./components/base/Events";

import { Header } from "./components/Views/Header";
import { Gallery } from "./components/Views/Gallery";
import { GalleryCard } from "./components/Views/GaleryCard";

import { Modal } from "./components/Views/Modal/Modal";
import { BasketCard } from "./components/Views/Modal/BasketCard";
import { CardView } from "./components/Views/Modal/CardView";
import { BasketView } from "./components/Views/Modal/BasketView";
import { PaymentView } from "./components/Views/Modal/PaymentView";
import { ContactsView } from "./components/Views/Modal/ContactsView";
import { SuccessView } from "./components/Views/Modal/SuccessView";

// ======================
// Events
// ======================
const events = new EventEmitter();

// ======================
// API
// ======================
const api = new Api(API_URL);
const webApi = new WebLarekApi(api);

// ======================
// Models
// ======================
const productsModel = new Products(events);
const basketModel = new Basket(events);
const orderModel = new Order(events);

// ======================
// Templates
// ======================
const templates = {
  catalog: document.querySelector("#card-catalog") as HTMLTemplateElement,
  preview: document.querySelector("#card-preview") as HTMLTemplateElement,
  basket: document.querySelector("#basket") as HTMLTemplateElement,
  basketCard: document.querySelector("#card-basket") as HTMLTemplateElement,

  payment: document.querySelector("#order") as HTMLTemplateElement,
  contacts: document.querySelector("#contacts") as HTMLTemplateElement,
  success: document.querySelector("#success") as HTMLTemplateElement,
};

// ======================
// Views
// ======================
const header = new Header(
  events,
  document.querySelector(".header") as HTMLElement,
);
const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);
const modal = new Modal(
  events,
  document.querySelector("#modal-container") as HTMLElement,
);

const basketView = new BasketView(events, cloneTemplate(templates.basket));
const cardView = new CardView(cloneTemplate(templates.preview), events);
const paymentView = new PaymentView(events, cloneTemplate(templates.payment));
const contactsView = new ContactsView(
  events,
  cloneTemplate(templates.contacts),
);
const successView = new SuccessView(events, cloneTemplate(templates.success));

// ======================
// Common helpers
// ======================

function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

function getOrderState() {
  return {
    buyer: orderModel.getBuyer(),
    errors: orderModel.validateOrder(),
  };
}

// ======================
// Form helpers
// ======================

function renderPaymentForm(): void {
  const { buyer, errors } = getOrderState();

  paymentView.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || "",
  });
}

function renderContactsForm(): void {
  const { buyer, errors } = getOrderState();

  contactsView.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || "",
  });
}

// ======================
// Catalog helpers
// ======================

function createCatalogCard(item: IProduct): HTMLElement {
  const cardElement = cloneTemplate(templates.catalog);
  const card = new GalleryCard(cardElement, () => {
    events.emit("product:select", item);
  });

  return card.render({
    title: item.title,
    image: item.image,
    price: item.price,
    category: item.category,
  });
}

events.on("products:changed", () => {
  const cards = productsModel.getItems().map(createCatalogCard);

  gallery.render({
    items: cards,
  });
});

// ======================
// Basket helpers
// ======================

function createBasketCard(item: IProduct, index: number): HTMLElement {
  const cardElement = cloneTemplate(templates.basketCard);
  const card = new BasketCard(cardElement, () => {
    events.emit("basket:remove", item);
  });

  return card.render({
    index: index + 1,
    title: item.title,
    price: item.price,
  });
}

function renderBasket(): void {
  const items = basketModel.getItems();
  const basketCards = items.map(createBasketCard);

  modal.render({
    content: basketView.render({
      items: basketCards,
      total: basketModel.getTotalPrice(),
      disabled: items.length === 0,
    }),
  });
}

// ======================
// Catalog events
// ======================

events.on("product:select", (item: IProduct) => {
  productsModel.setSelectedItem(item);
});

events.on("product:selected", (item: IProduct) => {
  const inBasket = basketModel.hasProduct(item.id);

  modal.render({
    content: cardView.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
      description: item.description,
      buttonText: inBasket ? "Удалить из корзины" : "Купить",
    }),
  });

  modal.open();
});

// ======================
// Basket events
// ======================

events.on("basket:open", () => {
  renderBasket();

  modal.open();
});

events.on("basket:toggle", () => {
  const item = productsModel.getSelectedItem();

  if (!item) return;

  if (basketModel.hasProduct(item.id)) {
    basketModel.removeProduct(item.id);
  } else {
    basketModel.addProduct(item);
  }

  modal.close();
});

events.on("basket:remove", (item: IProduct) => {
  basketModel.removeProduct(item.id);
  renderBasket();
});

events.on("basket:changed", () => {
  header.render({
    counter: basketModel.getItems().length,
  });

  const selectedItem = productsModel.getSelectedItem();

  if (!selectedItem) return;

  const inBasket = basketModel.hasProduct(selectedItem.id);

  cardView.buttonText = inBasket ? "Удалить из корзины" : "Купить";
});

events.on("order:changed", () => {
  renderPaymentForm();
  renderContactsForm();
});

// ======================
// Order events
// ======================

events.on("order:start", () => {
  const buyer = orderModel.getBuyer();

  modal.render({
    content: paymentView.render({
      payment: buyer.payment,
      address: buyer.address,
      valid: false,
      errors: "",
    }),
  });

  modal.open();
});

events.on("payment:change", (data: { payment: TPayment }) => {
  orderModel.setBuyer({
    payment: data.payment,
  });
});

events.on("address:change", (data: { address: string }) => {
  orderModel.setBuyer({
    address: data.address,
  });
});

events.on("order:submit", () => {
  const buyer = orderModel.getBuyer();

  modal.render({
    content: contactsView.render({
      email: buyer.email,
      phone: buyer.phone,
      valid: false,
      errors: "",
    }),
  });
});

// ======================
// Contacts events
// ======================

events.on("contacts.email:change", (data: { email: string }) => {
  orderModel.setBuyer({
    email: data.email,
  });
});

events.on("contacts.phone:change", (data: { phone: string }) => {
  orderModel.setBuyer({
    phone: data.phone,
  });
});

events.on("contacts:submit", () => {
  const buyer = orderModel.getBuyer();

  webApi
    .createOrder({
      ...buyer,
      items: basketModel.getItems().map((item) => item.id),
      total: basketModel.getTotalPrice(),
    })
    .then((result) => {
      events.emit("order:success", result);
    })
    .catch((err) => {
      console.error("Ошибка заказа:", err);
    });
});

events.on("order:success", (result: IOrderResponse) => {
  modal.render({
    content: successView.render({
      total: result.total,
    }),
  });

  basketModel.clearBasket();
  orderModel.clearOrder();
});

events.on("success:close", () => {
  modal.close();
});

// ======================
// API bootstrap
// ======================

webApi
  .getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
  })
  .catch((err) => {
    console.error("Ошибка загрузки:", err);
  });
