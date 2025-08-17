// const jwt = require("jsonwebtoken");
// const Usuario = require("../models/Usuario"); // Importar el modelo de Usuario

// const authMiddleware = async (req, res, next) => {
//     // 1. extraer el token de Headers, cookies o body 
//     const token = req.header("Authorization")?.replace("Bearer ", "") || 
//                 req.cookies.token ||
//                 req.body.token;
    
//     if (!token) {
//         return res.status(401).json({ 
//             success: false,
//             message: 'Error: No se proporcionó token de autenticación' 
//         });
//     }

//     try {
//         // 2. Verificar el token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token con la clave secreta

//         // 3. Buscar al usuario en la base de datos
//         const usuario = await Usuario.findById(decoded.id).select("-password"); // Buscar el usuario por ID y excluir la contraseña

//         if (!usuario) {
//             return res.status(401).json({ 
//                 success: false,
//                 message: 'Error: Usuario no encontrado' 
//             });
//         }

//         req.usuario = usuario; // Agregar el usuario al objeto de solicitud
//         next(); // Llamar al siguiente middleware o controlador
//     } catch (error) {
//         console.error("Error en authMiddleware:", error);
//         return res.status(401).json({ 
//             success: false,
//             message: 'Error: Token inválido o expirado' 
//         });
//     }

// };

// module.exports = authMiddleware; // Exportar el middleware para usarlo en las rutas