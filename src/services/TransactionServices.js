import Cart from '../models/cart';
import Transaction from '../models/Transaction';
import PagarMeProvider from '../providers/PagarMeProvider';

export default class TransactionService {

    paymentProvider;
    constructor(paymentProvider) {
        this.paymentProvider = paymentProvider || new PagarMeProvider();
    }


    async process({
        cartCode,
        paymentType,
        installments,
        customer, // customer {name}
        billing,
        creditCard,
    }) {
        const cart = await Cart.findOne({ code: cartCode });
        if (!cart) {
            throw `cart ${cartCode} not found`;
        }
        const transaction = await Transaction.create({
            cartCode: cart.code,
            code: "1111",
            total: cart.price,
            paymentType,
            installments,
            status: 'started',
            customerName: customer.name,
            customerEmail: customer.email,
            customerMobile: customer.mobile,
            costumerDocument: customer.document,
            billingAddress: billing.address,
            billingNumber: billing.number,
            billingNeighborhood: billing.neighborhood,
            billingCity: billing.city,
            billingState: billing.state,
            billingZipcode: billing.zipcode,
        });

        this.paymentProvider.process({
            transactionCode: transaction.code,
            total: transaction.total,
            paymentType,
            installments,
            customer,
            billing,
            creditCard,
        });
        return transaction;
    }
}
