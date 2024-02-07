import HeaderImage from '../models/HeaderImage';


export const getAllHeaderImage = async (req, res) => {
    try {
        const headerImages = await HeaderImage.find();

        return res.status(200).json({ data: headerImages });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los emcabezados de imagenes.',
            error
        });
    }
};

export const addheaderImage = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        const existingHeaderImage = await HeaderImage.findOne({ name });
        if (existingHeaderImage) {
            return res.status(400).json({
                message: 'El emcabezado ya existe.'
            });
        }
        // Crear un nuevo level
        const newHeaderImage = new HeaderImage({
            name,
            fileName: file.filename
        });
        await newHeaderImage.save();

        return res.status(201).json({
            message: 'El emcabezado de imagen se ha agregado con éxito.',
            data: newHeaderImage
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error al obtener los emcabezados de imagenes.',
            error
        });
    }
};

export const updateHeaderImage = async (req, res) => {
    try {
        const { headerImageId } = req.params;
        const { name } = req.body;

        const headerImageToUpdate = await HeaderImage.findByIdAndUpdate(headerImageId, { name }, { new: true });

        if (!headerImageToUpdate) {
            return res.status(404).json({
                message: 'No se ha encontrado el emcabezado.'
            });
        }

        return res.status(200).json({
            message: 'Se actualizado con éxito el emcabezado de imagen.',
            data: headerImageToUpdate
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los emcabezados de imagenes.',
            error
        });
    }
};

export const deleteHeaderImage = async (req, res) => {
    try {
        const { headerImageId } = req.params;

        const deletedHeaderImagen = await HeaderImage.findByIdAndRemove(headerImageId);

        if (!deletedHeaderImagen) {
            return res.status(404).json({
                message: 'No se ha encontrado el emcabezado.'
            });
        }

        return res.status(200).json({
            message: 'Se ha eliminado con éxito el emcabezado de imagen.',
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los emcabezados de imagenes.',
            error
        });
    }
};
