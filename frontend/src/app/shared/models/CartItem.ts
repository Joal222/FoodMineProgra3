import { Food } from "./Food";

export class CartItem {
  public quantity: number = 1;
  public price: number;

  constructor(public food: Food) {
    if (!food) {
      throw new Error("Food item cannot be null or undefined.");
    }
    if (food.price === undefined) {
      throw new Error("Food item must have a price.");
    }
    this.price = food.price; // Inicializar el precio aquí después de la comprobación
  }
}

