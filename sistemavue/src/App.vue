<template>
  <v-app id="app">
    
    <v-navigation-drawer v-model="drawer" app v-if="logado"
      :clipped="$vuetify.breakpoint.lgAndUp"
    >
      <v-list dense>

        <template v-if="ehAdministrador || ehArmazenador || ehVendedor">
          <v-list-item :to="{name: 'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>

            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-if="ehAdministrador || ehArmazenador">
          <v-list-group>

            <v-list-item slot="activator">
              <v-list-item-content>
                Armazém
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'categoria'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Categorias
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'artigo'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Artigos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>

        <template v-if="ehAdministrador || ehArmazenador">
          <v-list-group>

            <v-list-item slot="activator">
              <v-list-item-content>
                Compras
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'compra'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'fornecedor'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Fornecedores
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>

        <template v-if="ehAdministrador || ehVendedor">
          <v-list-group>

            <v-list-item slot="activator">
              <v-list-item-content>
                Vendas
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'venda'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Vendas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'cliente'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Clientes
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>

        <template v-if="ehAdministrador">
          <v-list-group>

            <v-list-item slot="activator">
              <v-list-item-content>
                Acessos
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'usuario'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Usuários
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>

        <template v-if="ehAdministrador || ehArmazenador || ehVendedor">
          <v-list-group>

            <v-list-item slot="activator">
              <v-list-item-content>
                Consultas
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Consulta Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'home'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  Consulta Vendas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark >

      <v-toolbar-title style="width: 300px" class="ml-0 pl-3" >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="sair()" v-if="logado">
        <v-icon>logout</v-icon> Sair
      </v-btn>

      <v-btn :to="{name: 'login'}" icon v-else>
        <v-icon>apps</v-icon> Login
      </v-btn>

    </v-app-bar>

    <v-content>
      <v-container fluid fill-height >
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-footer height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              Mauricio PC Junior &copy; 2019
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>

  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  data: () => ({
    drawer: true
  }),
  computed: {
    logado(){
      return this.$store.state.usuario;
    },
    ehAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador';
    },
    ehArmazenador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Armazenador';
    },
    ehVendedor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Vendedor';
    }
  },
  created(){
    this.$store.dispatch('autoLogin');
  },
  methods: {
    sair(){
      this.$store.dispatch('sair');
    }
  }
};
</script>
