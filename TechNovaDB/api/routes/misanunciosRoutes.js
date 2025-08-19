// // api/routes/anuncios.js
// const express = require("express");
// const router = express.Router();
// const Anuncio = require("../models/Anuncio");
// const authMiddleware = require("../middlewares/auth"); // para validar el token

// // Obtener solo los anuncios del usuario logueado con categoría "anuncio"
// router.get("/mis-anuncios", authMiddleware, async (req, res) => {
//   try {
//     const anuncios = await Anuncio.find({
//       usuario: req.user.id,        // usuario logueado
//       categoria: "anuncio"         // solo categoría "anuncio"
//     });
//     res.json(anuncios);
//   } catch (err) {
//     res.status(500).json({ msg: "Error al obtener anuncios", error: err });
//   }
// });

// module.exports = router;
