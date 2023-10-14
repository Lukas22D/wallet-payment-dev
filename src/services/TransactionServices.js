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

        const response = await this.paymentProvider.process({
            transactionCode: transaction.code,
            total: transaction.total,
            paymentType,
            installments,
            customer,
            billing,
            creditCard,
        });


        await transaction.updateOne({
            transactionId: response.transactionId,
            status: response.status,
            processorResponse: response.processorResponse,
        });

        return response; 
    }

    async updateStatus({code, providerStatus}){
        const transaction = transaction.findOne({code});
        if(!transaction){
            throw `transaction ${code} not found`
        }

        const status = this.paymentProvider.translateStatus(providerStatus);

        if(!status){
            throw `status ${providerStatus} not found`
        }

        await transaction.updateOne({status});
    }
}
