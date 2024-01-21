import AccountBank from '../models/accountBank';


export const getAllAccountsBank = async (req, res) => {
    try {
        const accountBanks = await AccountBank.find();

        return res.status(200).json({ accountBanks });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los numero de cuenta.',
            error
        });
    }
};

export const addAccountBank = async (req, res) => {
    try {
        const { nameAccount, numberAccount } = req.body;

        const existingAccount = await AccountBank.findOne({ nameAccount });

        if (existingAccount) {
            return res.status(400).json({
                message: 'El numero de cuenta ya existe.'
            });
        }
        
        const newAccount = new AccountBank({ nameAccount, numberAccount });
        await newAccount.save();

        return res.status(201).json({
            message: 'Numero de cuenta agregado con éxito.',
            AccountBank: newAccount
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el numero de cuenta.',
            error
        });
    }
};

export const updateAccountBank = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { nameAccount, numberAccount } = req.body;
        console.log(accountId)
        console.log(nameAccount)
        console.log(numberAccount)

        const accountBankToUpdate = await AccountBank.findByIdAndUpdate(accountId, 
            { nameAccount, numberAccount }, { new: true });

        if (!accountBankToUpdate) {
            return res.status(404).json({
                message: 'El numero de cuenta no se ha encontrado.'
            });
        }

        return res.status(200).json({
            message: 'El numero de cuenta actualizado con éxito.',
            language: accountBankToUpdate
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el numero de cuenta.',
            error
        });
    }
};

export const deleteAccountBank = async (req, res) => {
    try {
        const { accountId } = req.params;

        const deletedAccount = await AccountBank.findByIdAndRemove(accountId);

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
