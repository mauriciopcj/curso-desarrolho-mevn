import routerx from 'express-promise-router';
import compraController from '../controllers/CompraController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyArmazenador, compraController.add);
router.get('/query', auth.verifyArmazenador, compraController.query);
router.get('/list', auth.verifyArmazenador, compraController.list);
router.get('/grafico12Meses', auth.verifyUsuario, compraController.grafico12Meses);
router.get('/consultaDatas', auth.verifyUsuario, compraController.consultaDatas);
/*
router.put('/update', auth.verifyArmazenador, compraController.update);
router.delete('/remove', auth.verifyArmazenador, compraController.remove);
*/
router.put('/activate', auth.verifyArmazenador, compraController.activate);
router.put('/deactivate', auth.verifyArmazenador, compraController.deactivate);

export default router;