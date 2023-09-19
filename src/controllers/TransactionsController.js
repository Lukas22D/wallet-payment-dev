import Cart from '../models/cart';


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

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }


};

export default new TransactionsController();