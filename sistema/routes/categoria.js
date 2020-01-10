import routerx from 'express-promise-router';
import categoriaController from '../controllers/CategoriaController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyArmazenador, categoriaController.add);
router.get('/query', auth.verifyArmazenador, categoriaController.query);
router.get('/list', auth.verifyArmazenador, categoriaController.list);
router.put('/update', auth.verifyArmazenador, categoriaController.update);
router.delete('/remove', auth.verifyArmazenador, categoriaController.remove);
router.put('/activate', auth.verifyArmazenador, categoriaController.activate);
router.put('/deactivate', auth.verifyArmazenador, categoriaController.deactivate);

export default router;