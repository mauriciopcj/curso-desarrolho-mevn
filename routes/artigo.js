import routerx from 'express-promise-router';
import artigoController from '../controllers/ArtigoController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyArmazenador, artigoController.add);
router.get('/query', auth.verifyArmazenador, artigoController.query);
router.get('/queryCode', auth.verifyUsuario, artigoController.queryCode);
router.get('/list', auth.verifyArmazenador, artigoController.list);
router.put('/update', auth.verifyArmazenador, artigoController.update);
router.delete('/remove', auth.verifyArmazenador, artigoController.remove);
router.put('/activate', auth.verifyArmazenador, artigoController.activate);
router.put('/deactivate', auth.verifyArmazenador, artigoController.deactivate);

export default router;