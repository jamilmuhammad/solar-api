export class PhoneNumberHelper {

    static replacePrefix(phoneNumber: string) {
        phoneNumber = phoneNumber.replace(/^(\+62|0)/, '62');
        return PhoneNumberHelper.cleanPhoneNumber(phoneNumber);
    }

    static cleanPhoneNumber(phoneNumber: string) {
        return phoneNumber
            .replace(/\u202c/g, '')
            .replace(/\u202d/g, '')
            .replace(/[^0-9]/g, '');
    }

    static getWhatsAppLink(phoneNumber: string) {
        return `https://wa.me/${this.replacePrefix(phoneNumber)}`;
    }
}