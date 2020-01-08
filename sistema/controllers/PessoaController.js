import models from '../models';

export default {
    add: async (req, res, next) => {
        try {
            const reg = await models.Pessoa.create(req.body);
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
            const reg = await models.Pessoa.findOne({ _id: req.query._id });
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
            const reg = await models.Pessoa.find({ 
                $or: [
                    { 'name': new RegExp( valor, 'i' ) }, 
                    { 'email': new RegExp( valor, 'i')}
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
    listClientes: async ( req, res, next ) => {
        try {
            let valor = req.query.valor;
            const reg = await models.Pessoa.find({ 
                $or: [
                    { 'name': new RegExp( valor, 'i' ) }, 
                    { 'email': new RegExp( valor, 'i')}
                ], 'person_type': 'Cliente'}, 
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
    listFornecedores: async ( req, res, next ) => {
        try {
            let valor = req.query.valor;
            const reg = await models.Pessoa.find({ 
                $or: [
                    { 'name': new RegExp( valor, 'i' ) }, 
                    { 'email': new RegExp( valor, 'i')}
                ], 
                'person_type': 'Fornecedor'}, 
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
            const reg = await models.Pessoa.findByIdAndUpdate( { _id: req.body._id }, { person_type: req.body.person_type, name: req.body.name, document_type: req.body.document_type, document_num: req.body.document_num, direction: req.body.direction, phone: req.body.phone, email: req.body.email } );
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
            const reg = await models.Pessoa.findByIdAndDelete({ _id: req.body._id });
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
            const reg = await models.Pessoa.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
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
            const reg = await models.Pessoa.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    }
}