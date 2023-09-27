import { cpf  } from "cpf-cnpj-validator";

class PagarMeProvider {
    async process ({
        transactionCode,
        total,
        paymentType,
        installments,
        creditCard,
        customer,
        billing,
        items,
    }) {

        const billetParams = {
            payment_method: 'boleto',
            amount: total * 100,
            installments: 1,


        }

        const creditCardParams = {
            payment_method: 'credit_card',
            amount: total * 100,
            installments,
            card_number: creditCard.number.replace(/[^?0-9]/g, ''),
            card_expiration_date: creditCard.expiration.replace(/[^?0-9]/g, ''),
            card_cvv: creditCard.cvv,
            capture: true,
        }

        let paymentParams;
        switch (paymentType) {
            case 'billet':
                paymentParams = billetParams;
                break;
            case 'credit_card':
                paymentParams = creditCardParams;
                break;
            default:
                throw 'Invalid payment type';
        }

        const customerParams = {
            customer: {
                external_id: customer.email,
                name: customer.name,
                email: customer.email,
                type: cpf.isValid(customer.document) ? 'individual' : 'corporation',
                country: 'br',
                phone_numbers: [customer.mobile],
                documents: [
                    {
                        type: cpf.isValid(customer.document) ? 'cpf' : 'cnpj',
                        number: customer.document.replace(/[^?0-9]/g, ''),
                    }
                ]

            }
        }

        const billingParams = billing?.zipcode ? { 
            billing: {
                name: customer.name,
                address: {
                    country: 'br',
                    state: billing.state,
                    city: billing.city,
                    neighborhood: billing.neighborhood,
                    street: billing.address,
                    street_number: billing.number,
                    zipcode: billing.zipcode.replace(/[^?0-9]/g, ''),
                }
            }
        } : { };

        const itemsParams = items && items.lenght > 0 ?{
            items: items.map(item => ({
                id: item?.id.toString(),
                title: item?.titsle,  
                unit_price: item?.price * 100,
                quantity: item?.quantity ?? 1,
                tangible: false,
            }))
        } : {
            items: [
                {
                    id: '1',
                    title: 'Voucher',
                    unit_price: total * 100,
                    quantity: 1,
                    tangible: false,
                }
            ]
        };

        const metadataParams = {
            metadata: {
                transaction_code: transactionCode,
            }
        }


        const transactionParams = {

            async: false,
            //postback_urL:
            ...paymentParams,
            ...customerParams,
            ...billingParams,
            ...itemsParams,
            ...metadataParams,

        };

        console.debug(transactionParams);

    }
}


export default PagarMeProvider;