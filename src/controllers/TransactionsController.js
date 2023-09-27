import Cart from '../models/cart';
import TransactionServices from '../services/TransactionServices';
import parsePhoneNumber from 'libphonenumber-js';

class TransactionsController {

    async create(req, res) {
        try {
            const {
                cartCode,
                paymentType,
                installments,
                customerName,
                customerEmail,
                customerMobile,
                customerDocument,
                billingAddress,
                billingNumber,
                billingNeighborhood,
                billingCity,
                billingState,
                billingZipCode,
                creditCardNumber,
                creditCardExperiration,
                creditCardHolderName,
                creditCardCvv,
            } = req.body;

            const cart = await Cart.findOne({ code: cartCode });

            if(!cart){
                return res.status(404).json({ error: "Cart not found" });
            }

            // Criar a transação(registro)

            const service = new TransactionServices();
            const response = await service.process(
                {
                    cartCode,
                    paymentType,
                    installments,
                    customer:{
                        name: customerName,
                        email: customerEmail,
                        mobile: parsePhoneNumber(customerMobile, "BR").format("E.164"),
                        document: customerDocument,
                    },
                    billing:{
                        address: billingAddress,
                        number: billingNumber,
                        neighborhood: billingNeighborhood,
                        city: billingCity,
                        state: billingState,
                        zipcode: billingZipCode,
                    },
                    creditCard: {
                        number: creditCardNumber,
                        expiration: creditCardExperiration,
                        holderName: creditCardHolderName,
                        cvv: creditCardCvv,
                    }
                }
            );
            // integrar com o gateway de pagamento
            // atualizar o status da transação

            return res.status(201).json(response);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }


};

export default new TransactionsController();