import tokenService from '../services/token';
export default {
    verifyUsuario: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Não tem token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.rol == 'Administrador' || response.rol == 'Vendedor' || response.rol == 'Armazenador') {
            next();
        } else {
            return res.status(403).send({
                message: 'Não autorizado'
            });
        }
    },
    verifyAdministrador: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Não tem token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.rol == 'Administrador') {
            next();
        } else {
            return res.status(403).send({
                message: 'Não autorizado'
            });
        }
    },
    verifyArmazenador: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Não tem token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.rol == 'Administrador' || response.rol == 'Armazenador') {
            next();
        } else {
            return res.status(403).send({
                message: 'Não autorizado'
            });
        }
    },
    verifyVendedor: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Não tem token'
            });
        }
        const response = await tokenService.decode(req.headers.token);
        if (response.rol == 'Administrador' || response.rol == 'Vendedor') {
            next();
        } else {
            return res.status(403).send({
                message: 'Não autorizado'
            });
        }
    }
}