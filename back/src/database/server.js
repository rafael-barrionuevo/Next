require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./index");
const fileUpload = require("express-fileupload");
const ConteudoRoutes = require("../routes/ConteudoRoutes");
const UsuarioRoutes = require("../routes/UsuarioRoutes");
const AvaliacaoRoutes = require("../routes/AvaliacaoRoutes");
connectDB();

const app = express();

app.use("uploads", express.static("../../uploads"));
app.use(cors());
app.use(express.json()); 
app.use(fileUpload()); 
app.use(ConteudoRoutes);
app.use(UsuarioRoutes);
app.use(AvaliacaoRoutes);

const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;

app.listen(PORT, HOST, () => {
  console.log(`Servidor aberto: http://${HOST}:${PORT}`);
});