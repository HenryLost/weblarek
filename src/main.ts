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
const productsModel = new Products();
const basketModel = new Basket();
const orderModel = new Order();

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
// State
// ======================
let currentCardView: CardView | null = null;
let currentPaymentView: PaymentView | null = null;
let currentContactsView: ContactsView | null = null;
let currentItem: IProduct | null = null;
let basketOpened = false;

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

function renderPaymentForm() {
  if (!currentPaymentView) return;

  const { buyer, errors } = getOrderState();

  currentPaymentView.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || "",
  });
}

function renderContactsForm() {
  if (!currentContactsView) return;

  const { buyer, errors } = getOrderState();

  currentContactsView.render({
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
  const card = new GalleryCard(cardElement);

  cardElement.addEventListener("click", () => {
    events.emit("card:select", item);
  });

  return card.render({
    title: item.title,
    image: item.image,
    price: item.price,
    category: item.category,
  });
}

// ======================
// Basket helpers
// ======================

function createBasketCard(item: IProduct, index: number): HTMLElement {
  const cardElement = cloneTemplate(templates.basketCard);
  const card = new BasketCard(cardElement);

  card.onDelete = () => {
    events.emit("basket:remove", item);
  };

  return card.render({
    index: index + 1,
    title: item.title,
    price: item.price,
  });
}

function renderBasket() {
  const items = basketModel.getItems();
  const basketCards = items.map(createBasketCard);
  const basketElement = cloneTemplate(templates.basket);
  const basketView = new BasketView(events, basketElement);

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

events.on("card:select", (item: IProduct) => {
  modal.size = "card";

  const previewElement = cloneTemplate(templates.preview);
  const cardView = new CardView(previewElement, events);

  currentCardView = cardView;
  currentItem = item;

  const inBasket = basketModel.hasProduct(item.id);

  modal.render({
    content: cardView.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
      description: item.description,
      buttonText: inBasket ? "Удалить из корзины" : "Купить",
      data: item,
    }),
  });

  modal.open();
});

// ======================
// Basket events
// ======================

events.on("basket:open", () => {
  basketOpened = true;

  modal.size = "basket";

  renderBasket();

  modal.open();
});

events.on("basket:toggle", (item: IProduct) => {
  if (basketModel.hasProduct(item.id)) {
    basketModel.removeProduct(item.id);
  } else {
    basketModel.addProduct(item);
  }

  events.emit("basket:changed");
});

events.on("basket:remove", (item: IProduct) => {
  basketModel.removeProduct(item.id);

  events.emit("basket:changed");
});

events.on("basket:changed", () => {
  header.render({
    counter: basketModel.getItems().length,
  });

  if (basketOpened) {
    renderBasket();
  }

  if (!currentCardView || !currentItem) {
    return;
  }

  const inBasket = basketModel.hasProduct(currentItem.id);

  currentCardView.buttonText = inBasket ? "Удалить из корзины" : "Купить";
});

events.on("modal:close", () => {
  basketOpened = false;
});

// ======================
// Order events
// ======================

events.on("order:start", () => {
  modal.size = "form";

  const paymentElement = cloneTemplate(templates.payment);
  const paymentView = new PaymentView(events, paymentElement);

  currentPaymentView = paymentView;

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

  renderPaymentForm();
});

events.on("address:change", (data: { address: string }) => {
  orderModel.setBuyer({
    address: data.address,
  });

  renderPaymentForm();
});

events.on("order:submit", () => {
  const { buyer, errors } = getOrderState();

  if (errors.payment || errors.address) {
    renderPaymentForm();
    return;
  }

  const contactsElement = cloneTemplate(templates.contacts);
  const contactsView = new ContactsView(events, contactsElement);

  currentContactsView = contactsView;

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

  renderContactsForm();
});

events.on("contacts.phone:change", (data: { phone: string }) => {
  orderModel.setBuyer({
    phone: data.phone,
  });

  renderContactsForm();
});

events.on("contacts:submit", () => {
  const { buyer, errors } = getOrderState();

  if (errors.payment || errors.address || errors.email || errors.phone) {
    renderContactsForm();
    return;
  }

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
  const successElement = cloneTemplate(templates.success);
  const successView = new SuccessView(events, successElement);

  modal.render({
    content: successView.render({
      total: result.total,
    }),
  });

  basketModel.clearBasket();
  orderModel.clearOrder();

  basketOpened = false;

  header.render({
    counter: 0,
  });
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

    const cards = productsModel.getItems().map(createCatalogCard);

    gallery.render({
      items: cards,
    });
  })
  .catch((err) => {
    console.error("Ошибка загрузки:", err);
  });
