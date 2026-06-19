import { IBuyer, TErrors } from "../../types";

// Только хранение данных!
export class Order {
  protected readonly initialBuyer: IBuyer = {
  payment: '',
  email: '',
  phone:  '',
  address: ''   
}

// Очистка данных покупателя
clearOrder(): void {
  this.buyer = {...this.initialBuyer}
}

protected buyer: IBuyer = {...this.initialBuyer};

// Сохранение данных покупателя
setBuyer(data: Partial<IBuyer>): void {
  this.buyer = {
    ...this.buyer,
    ...data,
  }
}

// Получение данных покупателя
getBuyer(): IBuyer {
  return this.buyer;
}

// Проверка данных заказа
validateOrder(): TErrors {
  const errors: TErrors = {};
  
  if(!this.buyer.payment){
    errors.payment = 'Обязательно нужно указать тип оплаты!';
  }
  if(!this.buyer.email){
    errors.email = 'Необходимо указать email!';  
  }
  if(!this.buyer.phone){
    errors.phone = 'Необходимо указать номер!';  
  }
  if(!this.buyer.address){
    errors.address = 'Необходимо указать адрес!';  
  }
    
  return errors;
}
}