const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const logger = require("morgan");
const cors = require("cors");

const multer = require("multer");
const admin = require("firebase-admin");
import { serviceAccount } from "./firebaseConfig.js";

const passport = require("passport");
const session = require("express-session");
const io = require("socket.io")(server);
/*
 * SOCKETS
 */
const orderDeliverySocket = require("./sockets/orders_delivery_socket");

/*
 * INICIALIZAR FIREBASE ADMIN
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const upload = multer({
  storage: multer.memoryStorage(),
});

/*
 *RUTAS
 */
const users = require("./routes/usersRoutes");
const categories = require("./routes/categoriesRoutes");
const products = require("./routes/productsRoutes");
const address = require("./routes/addressRoutes");
const orders = require("./routes/ordersRoutes");

const port = process.env.PORT || 3000;
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
// Configuración de express-session
app.use(
  session({
    secret: "39dk3id93kd9d93kld9dk",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Cambiar a `true` en producción si usas HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
app.disable("x-powered-by");
app.set("port", port);
//LLAMAR A LOS SOCKETS
orderDeliverySocket(io);
/*
 *LLAMANDO A LAS RUTAS
 */
users(app, upload);
categories(app);
products(app, upload);
address(app);
orders(app);

server.listen(3000, "*" || "localhost", function () {
  console.log("Aplicacion de NodeJS " + port + " Iniciada ...");
});

//ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});
module.exports = {
  app: app,
  server: server,
};

//200 - RESPUESTA EXITOSA
//404 - URL NO EXISTE
//500 - ERROR INTERNO DEL SERVIDOR
