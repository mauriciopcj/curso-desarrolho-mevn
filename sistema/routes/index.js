import routerx from 'express-promise-router';
import categoriaRouter from './categoria';
import artigoRouter from './artigo';
import usuarioRouter from './usuario';
import pessoaRouter from './pessoa';
import compraRouter from './compra';
import vendaRouter from './venda';

const router = routerx();

router.use('/categoria', categoriaRouter);
router.use('/artigo', artigoRouter);
router.use('/usuario', usuarioRouter);
router.use('/pessoa', pessoaRouter);
router.use('/compra', compraRouter);
router.use('/venda', vendaRouter);

export default router;