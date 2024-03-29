import Chat from '../models/Chat';

import cloudinary from "cloudinary/lib/cloudinary";
import { REACT_APP_CLOUD_NAME, REACT_APP_API_KEY, REACT_APP_API_SECRET } from '../config';

cloudinary.config({
    cloud_name: REACT_APP_CLOUD_NAME,
    api_key: REACT_APP_API_KEY,
    api_secret: REACT_APP_API_SECRET
});


export const getAllMessagesFromChatByIdCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Buscar el chat por courseId y seleccionar el campo 'messages'
        const chat = await Chat.findOne({ courseId }).populate('messages.sender', '_id url publicId matricula firstName secondName lastName secondSurname typeUser');

        if (!chat) {
            return res.status(404).json({
                message: 'No se encontró el chat con el courseId proporcionado.',
            });
        }

        const messages = chat.messages;

        return res.status(200).json({
            messages,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los mensajes del chat.',
            error,
        });
    }
};

export const addMessageToChat = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { senderId, content, messageType, publicId, url } = req.body;

        // Buscar el chat por courseId
        const chat = await Chat.findOne({ courseId });

        if (!chat) {
            return res.status(404).json({
                message: 'No se encontró el chat con el courseId proporcionado.',
            });
        }

        // Validar si el senderId está en la lista de participantes
        if (!chat.participants.includes(senderId)) {
            return res.status(403).json({
                message: 'No tienes permisos para enviar mensajes a este chat.',
            });
        }

        // Crear un nuevo mensaje
        const newMessage = {
            sender: senderId,
            content,
            messageType,
            url,
            publicId
        };

        // Agregar el mensaje al array de mensajes del chat
        chat.messages.push(newMessage);

        // Guardar los cambios en el chat
        await chat.save();

        // Obtener la lista actualizada de mensajes del chat
        const updatedMessages = await Chat.findById(chat._id, 'messages')
            .populate('messages.sender', '_id url matricula firstName secondName lastName secondSurname typeUser');

        return res.status(201).json({
            message: 'Mensaje agregado con éxito.',
            messages: updatedMessages.messages,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error al agregar el mensaje al chat.',
            error,
        });
    }
};

export const deleteMessageFromChat = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { chatId, userId, messageId, typeMessage, publicId } = req.body;

        // Buscar el chat por courseId y _id proporcionados
        const chat = await Chat.findOne({ courseId, _id: chatId });

        if (!chat) {
            return res.status(404).json({
                message: 'No se encontró el chat con el courseId y chatId proporcionados.',
            });
        }

        // Encontrar el índice del mensaje que se va a eliminar
        const messageIndex = chat.messages.findIndex(message => message._id.toString() === messageId);

        if (messageIndex === -1) {
            return res.status(404).json({
                message: 'No se encontró el mensaje con el messageId proporcionado en el chat.',
            });
        }

        // Verificar si el usuario actual es el mismo que envió el mensaje
        if (chat.messages[messageIndex].sender.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'No tienes permisos para eliminar este mensaje.',
            });
        }

        // Eliminar el mensaje del array de mensajes del chat
        chat.messages.splice(messageIndex, 1);

        // Guardar los cambios en el chat
        await chat.save();

        if (typeMessage === 'file' || typeMessage === 'image') {
            cloudinary.v2.uploader.destroy(`${publicId}`, function (error, result) { })
                .then(resp => { })
                .catch(_err => { });
        }

        // Obtener la lista actualizada de mensajes del chat
        const updatedMessages = await Chat.findById(chat._id, 'messages')
            .populate('messages.sender', '_id url matricula firstName secondName lastName secondSurname typeUser');

        return res.status(200).json({
            message: 'Mensaje borrado con éxito.',
            messages: updatedMessages.messages,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al borrar el mensaje del chat.',
            error,
        });
    }
};
