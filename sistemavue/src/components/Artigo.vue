<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="artigos"
        :search="search"
        class="elevation-1"
      >    
        

        <template v-slot:top>
          <v-toolbar flat color="white">

            <v-btn @click="criarPDF()">
              <v-icon>print</v-icon>
            </v-btn>

            <v-toolbar-title>Artigos</v-toolbar-title>
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

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="code" label="Código"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-select v-model="category" :items="categories" label="Categoria"></v-select>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="name" label="Nome"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field type="number" v-model="stock" label="Estoque"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="price_shell" label="Preço de Venda"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
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

        <template v-slot:item.category="{item}">
          <v-text>{{ item.category }}</v-text>
        </template>

        <template v-slot:item.status="{item}">
          <v-text v-if="item.status==1" class="blue--text">Ativo</v-text>
          <v-text v-if="item.status==0" class="red--text">Inativo</v-text>
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {

  data(){

    return {
      dialog: false,
      search: '',
      artigos: [],
      headers: [
        { text: 'Opções', value: 'action', sortable: false },
        { text: 'Código', value: 'code', sortable: false },
        { text: 'Nome', value: 'name', sortable: true },
        { text: 'Categoria', value: 'category.name', sortable: true },
        { text: 'Estoque', value: 'stock', sortable: false },
        { text: 'Preço de Venda', value: 'price_shell', sortable: false },
        { text: 'Descrição', value: 'description', sortable: false },
        { text: 'Estado', value: 'status' , sortable: false },
      ],
      editedIndex: -1,
      __id: '',
      category: '',
      categories: [],
      code: '',
      name: '',
      stock: 0,
      price_shell: 0,
      description: '',
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
    this.listar();
    this.selectCategory();
  },
  methods: {
    criarPDF(){
      var columns = [
        {title: 'Nome', dataKey: 'name'},
        {title: 'Código', dataKey: 'code'},
        {title: 'Categoria', dataKey: 'category'},
        {title: 'Estoque', dataKey: 'stock'},
        {title: 'Preço de Venda', dataKey: 'price_shell'},
      ];
      var rows = [];

      this.artigos.map(function(x){
        rows.push(
          {name: x.name,
          code: x.code,
          category: x.category.name,
          stock: x.stock,
          price_shell: x.price_shell}
        );
      });

      var doc = new jsPDF('p', 'pt');
      doc.autoTable(columns, rows, {
        margin: {top: 60},
        addPageContent: function(data){
          doc.text('Lista de Artigos', 40, 30);
        }
      });
      doc.save('Artigos.pdf');
    },
    selectCategory(){
      let me = this;
      let categoryArray = [];
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('categoria/list', configuration).then(function (response){
        categoryArray = response.data;
        categoryArray.map(function(x){
          me.categories.push({text: x.name, value: x._id});
          console.log(x.name, x._id);
        });
      }).catch(function (error){
        console.log(error);
      })
    },
    listar() {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('artigo/list', configuration).then(function (response){
        me.artigos = response.data;
      }).catch(function (error){
        console.log(error);
      })
    },
    limpar() {
      this._id = '';
      this.name = '';
      this.code = '';
      this.stock = 0;
      this.price_shell = 0;
      this.description = '';
      this.valida = 0;
      this.validaMensagem = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensagem = [];
      if(!this.category){
        this.validaMensagem.push('Selecione uma categoria');
      }
      if(this.code.length > 64){
        this.validaMensagem.push('O código não deve ter mais de 64 caracteres');
      }
      if(this.name.length < 1 || this.name.length > 50){
        this.validaMensagem.push('O nome do artigo deve ter entre 1-50 caracteres');
      }
      if(this.description.length > 255){
        this.validaMensagem.push('A descrição do artigo não deve ter mais de 255 caracteres');
      }
      if(this.stock.length < 0){
        this.validaMensagem.push('Insira um valor de estoque válido');
      }
      if(this.price_shell.length < 0){
        this.validaMensagem.push('Insira um preço de venda válido');
      }
      if(this.validaMensagem.length){
        this.valida = 1;
      }
      return this.valida;
    },
    salvar() {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      if (this.validar()){
        return;
      }
      if (this.editedIndex > -1) {
        axios.put('artigo/update', {
          '_id': this._id, 
          'category': this.category,
          'code': this.code,
          'name': this.name, 
          'stock': this.stock,
          'price_shell': this.price_shell,
          'description': this.description
        }, configuration)
        .then(function(response){
          me.limpar();
          me.close();
          me.listar();
        }).catch(function(error){
          console.log(error);
        });
      } else {
        axios.post('artigo/add', 
        {
          'category': this.category,
          'code': this.code,
          'name': this.name, 
          'stock': this.stock,
          'price_shell': this.price_shell,
          'description': this.description
        }, configuration)
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
      this.category = item.category;
      this.code = item.code;
      this.name = item.name;
      this.stock = item.stock;
      this.price_shell = item.price_shell;
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
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.put('artigo/activate', {'_id': this.adId}, configuration)
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
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.put('artigo/deactivate', {'_id': this.adId}, configuration)
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