//Express
import express from "express";

//Session
import session from "express-session";
import MongoStore from "connect-mongo";

//Handlebars
import handlebars from "express-handlebars";

//Routers
import chatRouter from "./router/chat.router.js";
import homeRouter from "./router/home.router.js"
import cartRouter from "./router/carts.router.js"
import realTimeProductsRouter from "./router/realTimeProducts.router.js";
import productRouter from "./router/products.router.js"

//Sessions Routers
import sessionRouter from './router/session.router.js'

//Mongoose
import mongoose from "mongoose";

//Socket.io
import { Server, Socket } from "socket.io";

//Models
import messageModel from "./DAO/model/message.model.js";
import productModel from "./DAO/model/product.model.js";
import cartModel from "./DAO/model/cart.model.js";

//Managers
import CartManager from "./DAO/helpers/CartManager.js";


const server = express();

const uri =
  "mongodb+srv://taromelillo:Hw8C2a43e6CXWHK6@cluster0.4lcw6qm.mongodb.net/";

server.use(session({

  store: MongoStore.create({
    mongoUrl: uri,
    dbName: 'ecommerce',
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    ttl: 1000000,
  }),
  secret: 'c0d3r',
  resave: true,
  saveUninitialized: true
}))



//httpServer and WebsocketIO
const httpServer = server.listen(8080, () => {
  console.log("===========Server up===========");
});
const io = new Server(httpServer);

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//setting handlebars
server.engine("handlebars", handlebars.engine());
server.set("views", "src/views");
server.set("view engine", "handlebars");

//setting routes
server.use("/chat", chatRouter);
server.use("/home", homeRouter);
server.use("/api/carts", cartRouter);
server.use("/api/products", productRouter)
server.use("/realTimeProducts", realTimeProductsRouter)

//sessions router
server.use('/session', sessionRouter)
// server.use('/session', sessionRouter)

//static url is defined
server.use(express.static("src/views"));
server.use('/', (req,res) => { res.redirect('session/login')})

const main = async () => {
  await mongoose.connect(uri, { dbName: "ecommerce" });

  console.log("/======== Database Connected ========/");

  io.on("connection", (socket) => {
    console.log(
      "Time: ",
      new Date().toLocaleString() +
      " Client socket " +
      socket.id +
      " connected..."
    );

    socket.on("productAdded", async (data) => {
      let product = await productModel.create({
        title: data.product.title,
        description: data.product.description,
        code: data.product.code,
        price: data.product.price,
        status: data.product.status,
        stock: data.product.stock,
        category: data.product.category,
        thumbnails: data.product.thumbnails,
      });

      io.emit("logs", product);
    });

    socket.on("delete", async (id) => {
      console.log(id.id);
      await productModel.findByIdAndDelete(id.id);

      console.log("Deleting Product...");
      io.emit("productDeleted", id);
    });
    socket.on("message", async (data) => {
      await messageModel.create({
        user: data.user,
        message: data.message,
      });
      console.log(data);
      //   messages.push(data);
      //console.log(messages)
      io.emit("conversations", data);
    });


    socket.on('addProductToMyCart', async (_id) => {
      console.log('Product added to my cart' + _id._id)
      let cartManager = new CartManager();
      cartManager.addProductToMyCart(_id._id)
    })
  });
};

main();

