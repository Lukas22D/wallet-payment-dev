import Transaction from "../models/Transaction";
import TransactionService from "../services/TransactionServices";

export default new class PostBackController {

    async pagarme(req, res) {
        const {id, object, currrent_status} = req.body;

        try{
            if(object === 'transaction'){
                const transaction = await Transaction.findOne({transactionId: id});

            if(!transaction){
                return res.status(404).json({error: 'Transaction not found'})
            }

            const service = new TransactionService();
            await service.updateStatus({ code: transaction.code, status: currrent_status });

            return res.status(200).json();
        }
        }catch(e){
            console.log(e)
        }
        
    }
}