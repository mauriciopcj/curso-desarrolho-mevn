import models from '../models';

async function aumentarStock(idartigo, quantidade) {
    let { stock } = await models.Artigo.findOne({ _id: idartigo });
    let nStock = parseInt(stock) + parseInt(quantidade);
    const reg = await models.Artigo.findByIdAndUpdate({ _id: idartigo }, { stock: nStock });
}

async function diminuirStock(idartigo, quantidade) {
    let { stock } = await models.Artigo.findOne({ _id: idartigo });
    let nStock = parseInt(stock) - parseInt(quantidade);
    const reg = await models.Artigo.findByIdAndUpdate({ _id: idartigo }, { stock: nStock });
}

export default {
    add: async (req, res, next) => {
        try {
            const reg = await models.Compra.create(req.body);
            //Atualizar stock
            let details = req.body.details;
            details.map(function(x){
                aumentarStock(x._id, x.quantity);
            });
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
            const reg = await models.Compra.findOne({ _id: req.query._id })
            .populate('usuario', { name: 1 })
            .populate('pessoa', { name: 1 });
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
            const reg = await models.Compra.find({ 
                $or: [
                    { 'receipt_num': new RegExp( valor, 'i' ) }, 
                    { 'receipt_serie': new RegExp( valor, 'i')}
                ]})
                .populate('usuario', { name: 1 })
                .populate('pessoa', { name: 1 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    /*
    update: async (req, res, next) => {
        try {
            const reg = await models.Compra.findByIdAndUpdate( { _id: req.body._id }, { name: req.body.name, description: req.body.description } );
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
            const reg = await models.Compra.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    */
    activate: async (req, res, next) => {
        try {
            const reg = await models.Compra.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            // Atualizar stock
            let details = reg.details;
            details.map(function(x){
                aumentarStock(x._id, x.quantity);
            });
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
            const reg = await models.Compra.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            // Atualizar stock
            let details = reg.details;
            details.map(function(x){
                diminuirStock(x._id, x.quantity);
            });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    grafico12Meses: async (req, res, next) => {
        try {
            const reg = await models.Compra.aggregate(
                [
                    {
                        $group: {
                            _id: {
                                month: { $month: "$createdAt"},
                                year: { $year: "$createdAt"}
                            },
                            total: { $sum: "$total"},
                            number: { $sum: 1}
                        }
                    },
                    {
                        $sort: {
                            "_id.year": -1, "_id.month": -1
                        }
                    }
                ]
            ).limit(12);
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    },
    consultaDatas: async ( req, res, next ) => {
        try {
            let start = req.query.start;
            let end = req.query.end;
            const reg = await models.Compra.find({ "createdAt": { "$gte": start, "$lt": end }})
            .populate('usuario', { name: 1 })
            .populate('pessoa', { name: 1 })
            .sort({ 'createdAt': -1 });
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: 'Ocorreu um erro!'
            });
            next(error);
        }
    }
}