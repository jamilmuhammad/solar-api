import { DateHelper } from "../date/date.helper";

export class InvoiceHelper {
    static generateInvoiceNumber(date: Date = new Date()) {
        const jakartaDate = DateHelper.getJakartaMoment(date.toISOString());
        const randomDigit = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV/${jakartaDate.format('yyyy/MM/DD/HHmmss')}${randomDigit}`;
    }
}