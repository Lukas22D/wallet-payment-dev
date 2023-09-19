import * as Yup from 'yup';
import parsePhoneNumber from 'libphonenumber-js';
import { cpf, cnpj } from 'cpf-cnpj-validator';

const validateTransaction = async (req, res, next) => {
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

    const schema = Yup.object({
        cartCode: Yup.string().required(),
        paymentType: Yup.mixed().oneOf(["credit_card", "billet"]).required(),
        installments:
            Yup.number()
                .min(1)
                .when("paymentType", (paymentType, schema) =>
                    paymentType === "credit_card" ? schema.max(12) : schema.max(1)),
        customerName: Yup.string().required().min(3),
        customerEmail: Yup.string().required().email(),
        customerMobile:
            Yup.string()
                .required()
                .test("is-valid-mobile", "${path} is Invalid mobile number",
                    (value) => { parsePhoneNumber(value, "BR").isValid() }),
        customerDocument:
            Yup.string()
                .required()
                .test("is-valid-document", "${path} is Invalid document number",
                    (value) => cpf.isValid(value) || cnpj.isValid(value)),
        billingAddress: Yup.string().required(),
        billingNumber: Yup.string().required(),
        billingNeighborhood: Yup.string().required(),
        billingCity: Yup.string().required(),
        billingState: Yup.string().required(),
        billingZipCode: Yup.string().required(),
        creditCardNumber:
            Yup.string()
                .when("paymentType", (paymentType, schema) =>
                    paymentType === "credit_card" ? schema.required() : schema),
        creditCardExperiration:
            Yup.string()
                .when("paymentType", (paymentType, schema) =>
                    paymentType === "credit_card" ? schema.required() : schema),
        creditCardHolderName:
            Yup.string()
                .when("paymentType", (paymentType, schema) =>
                    paymentType === "credit_card" ? schema.required() : schema),
        creditCardCvv:
            Yup.string()
                .when("paymentType", (paymentType, schema) =>
                    paymentType === "credit_card" ? schema.required() : schema),

    });

    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Validation fails" });
    }

    return next();
}

export default validateTransaction; 
