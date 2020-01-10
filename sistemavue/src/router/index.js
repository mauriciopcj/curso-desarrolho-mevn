import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'
import Categoria from '../components/Categoria.vue'
import Login from '../components/Login.vue'
import Usuario from '../components/Usuario.vue'
import Artigo from '../components/Artigo.vue'

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
    path: '/artigo',
    name: 'artigo',
    component: Artigo,
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
