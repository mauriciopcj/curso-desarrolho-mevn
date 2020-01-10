import models from '../models';
import bcrypt from 'bcryptjs';
import token from '../services/token';

export default {
    add: async (req, res, next) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const reg = await models.Usuario.create(req.body);
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
            const reg = await models.Usuario.findOne({ _id: req.query._id });
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
            const reg = await models.Usuario.find({ 
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
    update: async (req, res, next) => {
        try {
            let pas = req.body.password;
            const reg0 = await models.Usuario.findOne({ _id: req.body._id});
            if (pas != reg0.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            const reg = await models.Usuario.findByIdAndUpdate( { _id: req.body._id }, { rol: req.body.rol, name: req.body.name, document_type: req.body.document_type, document_num: req.body.document_num, direction: req.body.direction, phone: req.body.phone, email: req.body.email, password: req.body.password} );
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
            const reg = await models.Usuario.findByIdAndDelete({ _id: req.body._id });
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
            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
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
            const reg = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            let user = await models.Usuario.findOne({ email: req.body.email, status: 1 });
            if (user) {
                let match = await bcrypt.compare(req.body.password, user.password);
                if (match) {
                    let tokenReturn = await token.encode(user._id, user.rol, user.email);
                    res.status(200).json({ user, tokenReturn });
                } else {
                    res.status(404).send({
                        message: 'Senha incorreta'
                    })
                }
            } else {
                res.status(404).send({
                    message: 'Não existe o usuário'
                })
            }
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    }
}