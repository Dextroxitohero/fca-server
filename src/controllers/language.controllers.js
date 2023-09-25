import Language from '../models/Language';


export const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find();

    return res.status(200).json({ languages });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los idiomas.',
      error
    });
  }
};

export const addLanguage = async (req, res) => {
  try {
    const { name, path } = req.body;

    // Verificar si el idioma ya existe
    const existingLanguage = await Language.findOne({ name });
    if (existingLanguage) {
      return res.status(400).json({
        message: 'El idioma ya existe.'
      });
    }
    // Crear un nuevo idioma
    const newLanguage = new Language({ name, path });
    await newLanguage.save();

    return res.status(201).json({
      message: 'Idioma agregado con éxito.',
      language: newLanguage
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al agregar el idioma.',
      error
    });
  }
};

export const updateLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;
    const { name, path } = req.body;

    // Buscar el idioma por su ID
    const languageToUpdate = await Language.findByIdAndUpdate(languageId, { name, path }, { new: true });

    if (!languageToUpdate) {
      return res.status(404).json({
        message: 'Idioma no encontrado.'
      });
    }

    return res.status(200).json({
      message: 'Idioma actualizado con éxito.',
      language: languageToUpdate
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el idioma.',
      error
    });
  }
};

export const deleteLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;

    // Buscar y eliminar el idioma por su ID
    const deletedLanguage = await Language.findByIdAndRemove(languageId);

    if (!deletedLanguage) {
      return res.status(404).json({
        message: 'Idioma no encontrado.'
      });
    }

    return res.status(200).json({
      message: 'Idioma eliminado con éxito.',
      language: deletedLanguage
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el idioma.',
      error
    });
  }
};
