import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'
import Categoria from '../components/Categoria.vue'
import Login from '../components/Login.vue'
import Usuario from '../components/Usuario.vue'
import Artigo from '../components/Artigo.vue'
import Cliente from '../components/Cliente.vue'
import Fornecedor from '../components/Fornecedor.vue'
import Compra from '../components/Compra.vue'
import Venda from '../components/Venda.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      armazenador: true,
      vendedor: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      livre: true
    }
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: Categoria,
    meta: {
      administrador: true,
      armazenador: true
    }
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: Usuario,
    meta: {
      administrador: true
    }
  },
  {
    path: '/cliente',
    name: 'cliente',
    component: Cliente,
    meta: {
      administrador: true,
      vendedor: true
    }
  },
  {
    path: '/venda',
    name: 'venda',
    component: Venda,
    meta: {
      administrador: true,
      vendedor: true
    }
  },
  {
    path: '/fornecedor',
    name: 'fornecedor',
    component: Fornecedor,
    meta: {
      administrador: true,
      fornecedor: true
    }
  },
  {
    path: '/artigo',
    name: 'artigo',
    component: Artigo,
    meta: {
      administrador: true,
      armazenador: true
    }
  },
  {
    path: '/compra',
    name: 'compra',
    component: Compra,
    meta: {
      administrador: true,
      armazenador: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.livre)) {
    next();
  } else if ( store.state.usuario && store.state.usuario.rol == 'Administrador') {
    if (to.matched.some(record => record.meta.administrador)) {
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Vendedor') {
    if (to.matched.some(record => record.meta.vendedor)) {
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Armazenador') {
    if (to.matched.some(record => record.meta.armazenador)) {
      next();
    }
  } else {
    next({name: 'login'});
  }
});

export default router
