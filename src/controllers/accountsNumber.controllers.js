import AccountNumber from '../models/AccountNumber';


export const getAllAccountsNumber = async (req, res) => {
    try {
        const accountNumber = await AccountNumber.find();

        return res.status(200).json({ accountNumber });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los numero de cuenta.',
            error
        });
    }
};

export const addAccountNumber = async (req, res) => {
    try {
        const { nameAccount, namePerson, numberAccount } = req.body;

        const existingAccount = await AccountNumber.findOne({ nameAccount });

        if (existingAccount) {
            return res.status(400).json({
                message: 'El numero de cuenta ya existe.'
            });
        }
        
        const newAccount = new AccountNumber({ nameAccount, namePerson, numberAccount });
        await newAccount.save();

        return res.status(201).json({
            message: 'Numero de cuenta agregado con éxito.',
            data: newAccount
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error al agregar el numero de cuenta.',
            error
        });
    }
};

export const updateAccountNumber = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { nameAccount, numberAccount } = req.body;

        const accountNumberToUpdate = await AccountNumber.findByIdAndUpdate(accountId, 
            { nameAccount, numberAccount }, { new: true });

        if (!accountNumberToUpdate) {
            return res.status(404).json({
                message: 'El numero de cuenta no se ha encontrado.'
            });
        }

        return res.status(200).json({
            message: 'El numero de cuenta actualizado con éxito.',
            data: accountNumberToUpdate
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el numero de cuenta.',
            error
        });
    }
};

export const deleteAccountNumber = async (req, res) => {
    try {
        const { accountId } = req.params;

        const deletedAccount = await AccountNumber.findByIdAndRemove(accountId);

        if (!deletedAccount) {
            return res.status(404).json({
                message: 'El numero de cuenta no se ha encontrado.'
            });
        }

        return res.status(200).json({
            message: 'El numero de cuenta se ha eliminado con éxito.',
            language: deletedAccount
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el numero de cuenta.',
            error
        });
    }
};
