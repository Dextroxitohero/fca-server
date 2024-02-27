import HeaderImage from '../models/HeaderImage';
import cloudinary from "cloudinary/lib/cloudinary";
import { REACT_APP_CLOUD_NAME, REACT_APP_API_KEY, REACT_APP_API_SECRET } from '../config';

cloudinary.config({
    cloud_name: REACT_APP_CLOUD_NAME,
    api_key: REACT_APP_API_KEY,
    api_secret: REACT_APP_API_SECRET
});


export const getAllHeaderImage = async (req, res) => {
    try {
        const headerImages = await HeaderImage.find({ status: true });

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
        const { name, urlName, publicId, createdBy, updatedBy } = req.body;

        const newHeaderImage = new HeaderImage({
            name,
            urlName,
            publicId,
            createdBy,
            updatedBy
        });

        await newHeaderImage.save();

        return res.status(201).json({
            message: 'El emcabezado de imagen se ha agregado con éxito.',
            data: newHeaderImage
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los emcabezados de imagenes.',
            error
        });
    }
};

export const updateHeaderImage = async (req, res) => {
    try {
        const { headerImageId } = req.params;
        const { name, urlName, publicId, updatedBy } = req.body;
        let updateData = {};

        if (publicId) {
            updateData = { name, urlName, publicId, status: true, updatedBy };
        } else {
            updateData = { name, updatedBy };
        }
        const headerImageToUpdate = await HeaderImage.findByIdAndUpdate(headerImageId, updateData, { new: true });

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
        const { headerImageId, publicId } = req.params;

        const updatedHeaderImage = await HeaderImage.findByIdAndUpdate(
            headerImageId,
            { $set: { status: false } },
            { new: true }
        );

        if (!updatedHeaderImage) {
            return res.status(404).json({
                message: 'No se ha encontrado el emcabezado.'
            });
        }

        cloudinary.v2.uploader.destroy(`uploads/${publicId}`, function (error, result) {})
            .then(resp => {})
            .catch(_err => {});

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
