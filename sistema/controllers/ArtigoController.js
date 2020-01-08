import models from '../models';

export default {
    add: async (req, res, next) => {
        try {
            const reg = await models.Artigo.create(req.body);
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
            const reg = await models.Artigo.findOne({ _id: req.query._id })
            .populate('category', { name: 1 });
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
    queryCode: async (req, res, next) => {
        try {
            const reg = await models.Artigo.findOne({ code: req.query.code })
            .populate('category', { name: 1 });
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
            const reg = await models.Artigo.find({ 
                $or: [
                    { 'name': new RegExp( valor, 'i' ) }, 
                    { 'description': new RegExp( valor, 'i')}
                ]}, 
                { createdAt: 0 })
                .populate('category', { name: 1 })
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
            const reg = await models.Artigo.findByIdAndUpdate( 
                { _id: req.body._id }, 
                { 
                    category: req.body.categoria, 
                    code: req.body.code, 
                    name: req.body.name, 
                    description: req.body.description, 
                    price_shell: req.body.price_shell, 
                    stock: req.body.stock 
                } 
            );
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
            const reg = await models.Artigo.findByIdAndDelete({ _id: req.body._id });
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
            const reg = await models.Artigo.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
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
            const reg = await models.Artigo.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    }
}