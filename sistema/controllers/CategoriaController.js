import models from '../models';

export default {
    add: async (req, res, next) => {
        try {
            const reg = await models.Categoria.create(req.body);
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    query: async (req, res, next) => {
        try {
            const reg = await models.Categoria.findOne({ _id: req.query._id });
            if(!reg) {
                res.status(404).send({
                    message: 'Este registro não existe!'
                })
            } else {
                res.status(200).json(reg);
            }
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    list: async ( req, res, next ) => {
        try {
            let valor = req.query.valor;
            const reg = await models.Categoria.find({ 
                $or: [
                    { 'name': new RegExp( valor, 'i' ) }, 
                    { 'description': new RegExp( valor, 'i')}
                ]}, 
                { createdAt: 0 })
                .sort({ 'name': -1 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const reg = await models.Categoria.findByIdAndUpdate( { _id: req.body._id }, { name: req.body.name, description: req.body.description } );
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const reg = await models.Categoria.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    activate: async (req, res, next) => {
        try {
            const reg = await models.Categoria.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Categoria.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    }
}