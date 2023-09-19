import mongoose from "mongoose";

const schema = new mongoose.Schema({
    cartCode: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["started", "processing","pending", "approved", "refused", "finished", "refunded", "chargeback", "error"],
        required: true,
        
    },
    paymentType: {
        type: String,
        enum: ["credit_card", "billet"],
    },
    installments: {
        type: Number,
    },
    total: {
        type: Number,
    },
    transactionId: {
        type: String,
    },
    processorResponse: {
        type: String,
    },
    customerEmail: {
        type: String,
    },
    customerName: {
        type: String,
    },
    customerMobile: {
        type: String,
    },
    customerDocument: {
        type: String,
    },
    billingAddress: {
        type: String,
    },
    billingNumber: {
        type: String,
    },
    billingNeighborhood: {
        type: String,
    },
    billingCity: {
        type: String,
    },
    billingState: {
        type: String,
    },
    billingZipcode: {
        type: String,
    },
    },
    {
        timestamps: true,
    });


export default mongoose.model("Transaction", schema);