const Anuncio = require('../models/Anuncios');

// Crear anuncio
exports.crearAnuncio = async (req, res) => {

    console.log("==== CREAR ANUNCIO ====");
    console.log("Body recibido:", req.body);         // ← Verifica que Postman envía bien titulo, descripcion, categoria, imagenes
    console.log("req.user:", req.user); // ← Verifica que el usuario autenticado se está pasando correctamente

    try {
        const { titulo, descripcion, imagenes, categoria } = req.body;
        const nuevoAnuncio = new Anuncio({ titulo, descripcion, imagenes, categoria, autor: req.user.id }); // Asignar el ID del usuario autenticado como autor
        console.log(req.user.id); // ← Verifica que el ID del usuario autenticado se está pasando correctamente
        await nuevoAnuncio.save();
        res.status(201).json({ msg: 'Anuncio creado', anuncio: nuevoAnuncio });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear anuncio', error });
    }
};

// Obtener todos los anuncios
exports.obtenerAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.find().populate('autor', 'nombre email'); 
        res.json(anuncios);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener anuncios', error });
    }
};


// Obtener anuncio por ID
exports.obtenerAnuncio = async (req, res) => {
    try {
        const anuncio = await Anuncio.findById(req.params.id);
        if (!anuncio) return res.status(404).json({ msg: 'Anuncio no encontrado' });
        res.json(anuncio);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener anuncio', error });
    }
};

// Actualizar anuncio
exports.actualizarAnuncio = async (req, res) => {
    try {
        const { titulo, descripcion, imagenes, estado, categoria} = req.body;
        const anuncio = await Anuncio.findByIdAndUpdate(
            req.params.id,
            { titulo, descripcion, imagenes, estado, categoria },
            { new: true, runValidators: true }
        );
        if (!anuncio) return res.status(404).json({ msg: 'Anuncio no encontrado' });
        res.json({ msg: 'Anuncio actualizado', anuncio });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar anuncio', error });
    }
};

// Eliminar anuncio
exports.eliminarAnuncio = async (req, res) => {
    try {
        const anuncio = await Anuncio.findByIdAndDelete(req.params.id);
        if (!anuncio) return res.status(404).json({ msg: 'Anuncio no encontrado' });
        res.json({ msg: 'Anuncio eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar anuncio', error });
    }
};
