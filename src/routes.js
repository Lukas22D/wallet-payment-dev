import { Router } from "express";
import CartsController from "./controllers/CartsController";
import TransactionsController from "./controllers/TransactionsController";
import validateTransaction from "./middlewares/transactionValid";
import PostBackController from "./controllers/PostBackController";

const routes = new Router();

routes.get("/carts", CartsController.index);
routes.post("/carts", CartsController.create);
routes.put("/carts/:id", CartsController.update);
routes.delete("/carts/:id", CartsController.destroy);


routes.post("/transactions", validateTransaction, TransactionsController.create);

routes.post("/postback/pagarme", PostBackController.pagarme);



export default routes;