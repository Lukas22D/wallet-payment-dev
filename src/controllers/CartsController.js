import Cart from "../models/cart.js";

export default new class CartsController {

    async index(req, res) {
       try{
        const carts = await Cart.find();
        return res.json(carts);
       }catch(err){
        return res.status(400).json({error: err.message});
           
       }
    }

    async create(req, res) {
        try{
            const {code , price } = req.body;
            const cart = await Cart.create({code, price});
            return res.status(201).json(cart);
        }catch(err){
            return res.status(400).json({error: err.message});
        }
    }

    async update(req, res) {
        try{
            const { id } = req.params;
            const {code , price } = req.body;
            const cart = await Cart.findById(id);
            if(!cart){
                return res.status(404).json({error: "Cart not found"});
            }

            await cart.updateOne({code, price});
            return res.status(200).json();
            
        } catch(err){
            return res.status(400).json({error: err.message});
        }
    }

    async destroy(req, res) {
        try{
            const { id } = req.params;
            const cart = await Cart.findById(id);
            if(!cart){
                return res.status(404).json({error: "Cart not found"});
            }
            await cart.deleteOne();
            return res.status(204).json();
        }catch(err){
            return res.status(400).json({error: err.message});
        }
    }

};