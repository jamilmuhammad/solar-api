export class PriceHelper {

    static calculateDiscountedPrice(price: number, discount?: number): number {
        if (discount && discount > 0) {
            return price - (price * discount) / 100;
        }

        return price;
    }
}