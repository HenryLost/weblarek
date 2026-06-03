import { IBuyer } from "../../types";

// Только хранение данных!
export class Order {
  protected buyer: IBuyer = {
  payment:  '',
  email: '',
  phone:  '',
  address: ''   
}

// Сохранение данных покупателя
setBuyer(data: IBuyer): void {
  this.buyer = data
}

// Получение данных покупателя
getBuyer(): IBuyer {
  return this.buyer;
}  

// Проверка заполнения способа оплаты
validatePayment(): boolean {
  return this.buyer.payment !== '';
}

// Проверка заполнения email
validateEmail(): boolean {
  return /^\S+@\S+\.\S+$/.test(this.buyer.email);
}

// Проверка заполнения телефона
validatePhone(): boolean {
  return this.buyer.phone.trim() !== '';
}

// Проверка заполнения адреса
validateAddress(): boolean {
  return this.buyer.address.trim() !== ''; 
}

// Общая проверка данных заказа
validateOrder(): boolean {
  return (
    this.validatePayment() &&
    this.validateEmail() &&
    this.validatePhone() &&
    this.validateAddress()
  );
}
}