import Color from '../models/Color';

export const getAllColors = async (req, res) => {
    try {
        const color = await Color.find();

        return res.status(200).json({ color });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los colores.',
            error
        });
    }
};

export const addColor = async (req, res) => {
    try {
        const { name } = req.body;
        console.log(name)

        // Verificar si el level ya existe
        const existingColor = await Color.findOne({ name });
        if (existingColor) {
            return res.status(400).json({
                message: 'El color ya existe.'
            });
        }
        // Crear un nuevo level

        const colorSet = {
            name,
            clase: `bg-${name}-600`,
            selectedClass: `ring-${name}-600 shadow-${name}-500`
        }

        const newColor = new Color(colorSet);
        await newColor.save();

        return res.status(201).json({
            message: 'Color agregado con éxito.',
            language: newColor
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el color.',
            error
        });
    }
};

export const updateColor = async (req, res) => {
    try {
        const { colorId } = req.params;
        const { name } = req.body;

        // Buscar el color por su ID
        const colorToUpdate = await Color.findByIdAndUpdate(colorId, { name }, { new: true });

        if (!colorToUpdate) {
            return res.status(404).json({
                message: 'Color no encontrado.'
            });
        }

        return res.status(200).json({
            message: 'Color actualizado con éxito.',
            language: colorToUpdate
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el color.',
            error
        });
    }
};

export const deleteColor = async (req, res) => {
    try {
        const { colorId } = req.params;

        // Buscar y eliminar el color por su ID
        const deletedColor = await Color.findByIdAndRemove(colorId);

        if (!deletedColor) {
            return res.status(404).json({
                message: 'Color no encontrado.'
            });
        }

        return res.status(200).json({
            message: 'Color eliminado con éxito.',
            language: deletedColor
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el color.',
            error
        });
    }
};
