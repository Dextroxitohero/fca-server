import Level from '../models/Level';


export const getAllLevels = async (req, res) => {
  try {
    const level = await Level.find();

    return res.status(200).json({ level });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los niveles.',
      error
    });
  }
};

export const addLevel = async (req, res) => {
  try {
    const { name } = req.body;

    // Verificar si el level ya existe
    const existingLevel = await Level.findOne({ name });
    if (existingLevel) {
      return res.status(400).json({
        message: 'El nivel ya existe.'
      });
    }
    // Crear un nuevo level
    const newLevel = new Level({ name });
    await newLevel.save();

    return res.status(201).json({
      message: 'Nivel agregado con éxito.',
      language: newLevel
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al agregar el nivel.',
      error
    });
  }
};

export const updateLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const { name } = req.body;

    // Buscar el nivel por su ID
    const levelToUpdate = await Level.findByIdAndUpdate(levelId, { name }, { new: true });

    if (!levelToUpdate) {
      return res.status(404).json({
        message: 'Nivel no encontrado.'
      });
    }

    return res.status(200).json({
      message: 'Nivel actualizado con éxito.',
      language: levelToUpdate
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el nivel.',
      error
    });
  }
};

export const deleteLevel = async (req, res) => {
  try {
    const { levelId } = req.params;

    // Buscar y eliminar el nivel por su ID
    const deletedLevel = await Level.findByIdAndRemove(levelId);

    if (!deletedLevel) {
      return res.status(404).json({
        message: 'Nivel no encontrado.'
      });
    }

    return res.status(200).json({
      message: 'Nivel eliminado con éxito.',
      language: deletedLevel
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el nivel.',
      error
    });
  }
};
