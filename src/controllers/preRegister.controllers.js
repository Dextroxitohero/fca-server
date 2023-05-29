import PreRegister from '../models/PreRegister';

export const createPreRegister = async (req, res) => {

    try {
        const { firstName, lastName, email, phone, age, location, education } = req.body;

        // Creamos una nueva instancia del modelo PreRegister con los datos proporcionados
        const newPreRegister = new PreRegister({
            firstName,
            lastName,
            email,
            phone,
            age,
            location,
            education,
        });

        console.log(newPreRegister)

        // Guardamos el nuevo usuario en la base de datos
        const savedPreRegister = await newPreRegister.save();

        return res.status(201).json({
            message: 'User created successfully',
            data: savedPreRegister
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al agregar el usuario'
        })
    }
}

export const updatePreRegisterById = async (req, res) => {
    // try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(req.body)

        // Actualizamos el estado del usuario por su ID
        // const updatedUser = await PreRegister.findByIdAndUpdate(id, { status }, { new: true });

        // if (!updatedUser) {
        //     return res.status(404).json({ message: 'Usuario no encontrado' });
        // }

        // res.status(200).json(updatedUser);
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
    // }
}