<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="categorias"
        :search="search"
        class="elevation-1"
      >    
        

        <template v-slot:top>
          <v-toolbar flat color="white">

            <v-toolbar-title>Categorias</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            
            <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Pesquisa" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" max-width="500px">

              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Novo</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
    
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="name" label="Nome"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="description" label="Descrição"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4" v-show="validar">
                        <div class="red--text" v-for="v in validaMensagem" :key="v" v-text="v">
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
    
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="salvar">Salvar</v-btn>
                </v-card-actions>
              </v-card>

            </v-dialog>

            <v-dialog v-model="adModal" max-width="290">
              <v-card>
                <v-card-title class="headline" v-if="adAction==1">
                  Ativar Item
                </v-card-title>
                <v-card-title class="headline" v-if="adAction==2">
                  Desativar Item
                </v-card-title>
                <v-card-text>
                  Estás a ponto de <span v-if="adAction==1">ativar</span><span v-if="adAction==2">desativar</span> o item {{ adName }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="ativarDesativarCancelar()" color="green darken-1" text>
                    Cancelar
                  </v-btn>
                  <v-btn v-if="adAction==1" @click="ativar()" color="orange darken-4" text>
                    Ativar
                  </v-btn>
                  <v-btn v-if="adAction==2" @click="desativar()" color="orange darken-4" text>
                    Desativar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-toolbar>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            edit
          </v-icon>
          <template v-if="item.status">
            <v-icon
              small
              @click="ativarDesativarMostrar(2, item)"
            >
              block
            </v-icon>
          </template>
          <template v-else>
            <v-icon
              small
              @click="ativarDesativarMostrar(1, item)"
            >
              check
            </v-icon>
          </template>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Recarregar</v-btn>
        </template>

      </v-data-table>

    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {

  data(){

    return {
      dialog: false,
      search: '',
      categorias: [],
      headers: [
        { text: 'Opções', value: 'action', sortable: false },
        { text: 'Nome', value: 'name', sortable: true },
        { text: 'Descrição', value: 'description', sortable: false },
        { text: 'Estado', value: 'status', sortable: false },
      ],
      editedIndex: -1,
      __id: '',
      name: '',
      description:'',
      valida: 0,
      validaMensagem: [],
      adModal: 0,
      adAction: 0,
      adName: '',
      adId: ''
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Novo Item' : 'Editar Item'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  created () {
    this.listar()
  },
  methods: {
    listar() {
      let me = this;
      axios.get('categoria/list').then(function (response){
        me.categorias = response.data;
      }).catch(function (error){
        console.log(error);
      })
    },
    limpar() {
      this._id = '';
      this.name = '';
      this.description = '';
      this.valida = 0;
      this.validaMensagem = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensagem = [];
      if(this.name.length < 1 || this.name.length > 50){
        this.validaMensagem.push('O nome da categoria deve ter entre 1-50 caracteres');
      }
      if(this.description.length > 255){
        this.validaMensagem.push('A descrição da categoria não deve ter mais de 255 caracteres');
      }
      if(this.validaMensagem.length){
        this.validar = 1;
      }
      return this.valida;
    },
    salvar() {
      let me = this;
      if (this.validar()){
        return;
      }
      if (this.editedIndex > -1) {
        axios.put('categoria/update', {'_id': this._id, 'name': this.name, 'description': this.description})
        .then(function(response){
          me.limpar();
          me.close();
          me.listar();
        }).catch(function(error){
          console.log(error);
        });
      } else {
        axios.post('categoria/add', {'name': this.name, 'description': this.description})
        .then(function(response){
          me.limpar();
          me.close();
          me.listar();
        }).catch(function(error){
          console.log(error);
        });
      }
    },
    editItem (item) {
      this._id = item._id;
      this.name = item.name;
      this.description = item.description;
      this.dialog = true;
      this.editedIndex = 1;
    },
    ativarDesativarMostrar(action, item) {
      console.log(item);
      this.adModal = 1;
      this.adName = item.name;
      this.adId = item._id;
      if(action == 1){
        this.adAction = 1;
      } else if (action == 2) {
        this.adAction = 2;
      } else {
        this.adModal = 0;
      }
    },
    ativarDesativarCancelar() {
      this.adModal = 0;
    },
    ativar(){
      let me = this;
      axios.put('categoria/activate', {'_id': this.adId})
      .then(function(response){
        me.adModal = 0;
        me.adAction = 0;
        me.adName = '';
        me.adId = '';
        me.listar();
      }).catch(function(error){
        console.log(error);
      });
    },
    desativar(){
      let me = this;
      axios.put('categoria/deactivate', {'_id': this.adId})
      .then(function(response){
        me.adModal = 0;
        me.adAction = 0;
        me.adName = '';
        me.adId = '';
        me.listar();
      }).catch(function(error){
        console.log(error);
      });
    },
    close () {
      this.limpar();
      this.dialog = false;
    },
  }
}
</script>

<style>

</style>