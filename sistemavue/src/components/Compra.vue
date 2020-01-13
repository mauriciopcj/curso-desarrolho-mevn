<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="compras"
        :search="search"
        class="elevation-1"
        v-if="verNovo==0"
      >    
        

        <template v-slot:top>
          <v-toolbar flat color="white">

            <v-toolbar-title>Compras</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
            
            <v-text-field v-if="verNovo==0" class="text-xs-center" v-model="search" append-icon="search" label="Pesquisa" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" v-if="verNovo==0" @click="mostraNovo()">Novo</v-btn>

            <v-dialog v-model="dialog" max-width="1000px">

              <v-card>
                <v-card-title>
                  <span class="headline">Selecione um artigo</span>
                </v-card-title>
    
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-flex xs12 sm12 md12 lg12 xl12>
                        <template>
                          <v-data-table
                            :headers="cabeceraArtigos"
                            :items="artigos"
                            class="elevation-1"
                          >    
                            
                            <template v-slot:top>
                              <v-toolbar flat color="white">

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

                              </v-toolbar>
                            </template>

                            <template v-slot:item.action="{ item }">
                              <v-icon
                                small
                                class="mr-2"
                                @click="editItem(item)"
                              >
                                add
                              </v-icon>
                            </template>

                            <template v-slot:item.category="{item}">
                              <v-text>{{ item.category }}</v-text>
                            </template>

                            <template v-slot:item.status="{item}">
                              <v-text v-if="item.status==1" class="blue--text">Ativo</v-text>
                              <v-text v-if="item.status==0" class="red--text">Inativo</v-text>
                            </template>

                          </v-data-table>
                        </template>
                      </v-flex>
                    </v-row>
                  </v-container>
                </v-card-text>
    
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
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

        <template v-slot:item.user="{item}">
          <v-text>{{ item.user }}</v-text>
        </template>

        <template v-slot:item.person="{item}">
          <v-text>{{ item.person }}</v-text>
        </template>

        <template v-slot:item.status="{item}">
          <v-text v-if="item.status==1" class="blue--text">Aceito</v-text>
          <v-text v-if="item.status==0" class="red--text">Anulado</v-text>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Recarregar</v-btn>
        </template>

      </v-data-table>

      <v-container grid-list-sm class="pa-4 white" v-if="verNovo">
        <v-layout row wrap>

          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select v-model="receipt_type" :items="receipts" label="Tipo do Comprovante">
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="receipt_serie" label="Serio do Comprovante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="receipt_num" label="Número do Comprovante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-autocomplete :items="persons" v-model="person" label="Fornecedor">
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field type="number" v-model="tax" label="Imposto">
            </v-text-field>
          </v-flex>

          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-text-field v-model="code" label="Código" @keyup.enter="buscarCodigo()">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="mostrarModalArtigos()">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12 v-show="errorArtigo">
            <div class="red--text" v-text="errorArtigo">

            </div>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="cabeceraDetalhes"
                :items="detalhes"
                class="elevation-1"
              >
                <template v-slot:item.apagar="{item}">
                  <v-icon dark 
                  @click="eliminarDetalhe(detalhes,item)"
                  >
                  delete
                  </v-icon>
                </template>
                <template v-slot:item.price="{item}">
                  <v-text-field v-model="item.price" type="number">{{item.price}}</v-text-field>
                </template>
                <template v-slot:item.quantity="{item}">
                  <v-text-field v-model="item.quantity" type="number">{{item.quantity}}</v-text-field>
                </template>
                <template v-slot:item.total="{item}">
                  $ {{ item.quantity * item.price }}
                </template>

                <template slot="no-data">
                  <h3>Não tem artigos anexados em detalhes</h3>
                </template>

              </v-data-table>

              <v-flex class="text-xs-right">
                <strong>Total Parcial:</strong> $ {{ totalParcial = (total - totalImposto).toFixed(2) }}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Imposto:</strong> $ {{ totalImposto = ((total * tax) / (1 + tax)).toFixed(2) }}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total:</strong> $ {{ total = calcularTotal }}
              </v-flex>

            </template>
          </v-flex>

          <v-flex xs12 sm12 md12 v-show="valida">
            <div class="red--text" v-for="v in validaMensagem" :key="v" v-text="v"></div>
          </v-flex>

          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" text @click.native="ocultarNovo()">Cancelar</v-btn>
            <v-btn color="success" @click.native="salvar()">Salvar</v-btn>
          </v-flex>


        </v-layout>
      </v-container>

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
      compras: [],
      headers: [
        { text: 'Opções', value: 'action', sortable: false },
        { text: 'Usuário', value: 'user', sortable: true },
        { text: 'Fornecedor', value: 'person', sortable: true },
        { text: 'Tipo do Comprovante', value: 'receipt_type', sortable: true },
        { text: 'Serie do Comprovante', value: 'receipt_serie', sortable: false },
        { text: 'Número do Comprovante', value: 'receipt_num', sortable: false },
        { text: 'Data', value: 'createdAt', sortable: false },
        { text: 'Imposto', value: 'tax', sortable: false },
        { text: 'Total', value: 'total', sortable: false },
        { text: 'Estado', value: 'status', sortable: false },
      ],
      editedIndex: -1,
      __id: '',
      person: '',
      persons: [],
      receipt_type: '',
      receipts: ['BOLETO', 'FATURA', 'GUIA', 'TICKET'],
      receipt_serie: '',
      receipt_num: '',
      tax: 0.18,
      code:'',
      cabeceraDetalhes: [
        { text: 'Apagar', value: 'apagar', sortable: false },
        { text: 'Artigo', value: 'article', sortable: false },
        { text: 'Quantidade', value: 'quantity', sortable: false },
        { text: 'Preço', value: 'price', sortable: false },
        { text: 'Sub Total', value: 'total', sortable: false },
      ],
      detalhes: [],
      verNovo: 0,
      errorArtigo: null,
      total: 0,
      totalParcial: 0,
      totalImposto: 0,
      artigos: [],
      texto: '',
      cabeceraArtigos: [
        { text: 'Selecionar', value: 'selecionar', sortable: false },
        { text: 'Código', value: 'code', sortable: false },
        { text: 'Nome', value: 'name', sortable: true },
        { text: 'Categoria', value: 'category.name', sortable: true },
        { text: 'Estoque', value: 'stock', sortable: false },
        { text: 'Preço de Venda', value: 'price_shell', sortable: false },
        { text: 'Descrição', value: 'description', sortable: false },
        { text: 'Estado', value: 'status' , sortable: false },
      ],
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
    calcularTotal: function() {
      let resultado = 0.0;
      this.detalhes.forEach(element => {
        resultado = resultado + (element.quantity * element.price);
      });
      return resultado;
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  created () {
    this.listar();
    this.selecionarPessoa();
  },
  methods: {
    selecionarPessoa(){
      let me = this;
      let personArray = [];
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('pessoa/listFornecedores', configuration).then(function (response){
        personArray = response.data;
        personArray.map(function(x){
          me.persons.push({text: x.name, value: x._id});
          console.log(x.name, x._id);
        });
        console.log(me.persons);
      }).catch(function (error){
        console.log(error);
      })
    },
    buscarCodigo() {
      let me = this;
      me.errorArtigo = null;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('artigo/queryCode?code=' + this.code, configuration).then(function (response){
        me.adicionarDetalhe(response.data);
      }).catch(function (error){
        me.errorArtigo = 'Não existe este artigo';
      })
    },
    adicionarDetalhe(data) {
      this.errorArtigo = null;
      if (this.encontrar(data._id)==true){
        this.errorArtigo = 'Este artigo já foi adicionado.'
      } else {
        this.detalhes.push(
          {
            _id: data.id,
            article: data.name,
            quantity: 1,
            price: data.price_shell
          }
        );
        this.code = '';
      }
    },
    encontrar(id){
      let sw = false;
      this.detalhes.forEach(element => {
        if(element._id == id){
          sw = true;
        }
      });
      return sw;
    },
    eliminarDetalhe(arrrarr, item){
      let i = arrrarr.indexOf(item);
      if(i != -1){
        arrrarr.splice(i,1);
      }
    },
    listarArtigos() {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('artigo/list?valor=' + this.texto, configuration).then(function (response){
        me.artigos = response.data;
      }).catch(function (error){
        console.log(error);
      })
    },
    mostrarModalArtigos(){
      this.dialog = 1;
    },
    listar() {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('compra/list', configuration).then(function (response){
        me.compras = response.data;
      }).catch(function (error){
        console.log(error);
      })
    },
    limpar() {
      this._id = ''; 
      this.direction = '';
      this.phone = '';
      this.email = '';
      this.password = '';
      this.valida = 0;
      this.validaMensagem = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensagem = [];

      if(!this.rol){
        this.validaMensagem.push('Seleciona um papel');
      }
      if(this.document_num.length > 20){
        this.validaMensagem.push('O documento não deve ter mais de 20 caracteres');
      }
      if(this.direction.length > 70){
        this.validaMensagem.push('A direção não deve ter mais de 20 caracteres');
      }
      if(this.phone.length > 20){
        this.validaMensagem.push('O telefone não deve ter mais de 20 caracteres');
      }
      if(this.validaMensagem.length){
        this.validar = 1;
      }
      if(this.email.length < 1 || this.email.length > 50){
        this.validaMensagem.push('O email do usuário deve ter entre 1-50 caracteres');
      }
      if(this.password.length < 1 || this.password.length > 64){
        this.validaMensagem.push('A senha do usuário deve ter entre 1-64 caracteres');
      }
      return this.valida;
    },
    mostraNovo(){
      this.verNovo = 1;
    },
    ocultarNovo(){
      this.verNovo = 0;
    },
    salvar() {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      if (this.validar()){
        return;
      }
      if (this.editedIndex > -1) {
        axios.put('usuario/update', {
            '_id': this._id,  
            'document_type': this.document_type,
            'document_num': this.document_num,
            'direction': this.direction,
            'phone': this.phone,
            'email': this.email,
            'password': this.password
        }, configuration)
        .then(function(response){
          me.limpar();
          me.close();
          me.listar();
        }).catch(function(error){
          console.log(error);
        });
      } else {
        axios.post('usuario/add', 
        {
            'document_type': this.document_type,
            'document_num': this.document_num,
            'direction': this.direction,
            'phone': this.phone,
            'email': this.email,
            'password': this.password
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
      this.rol = item.rol,
      this.document_type = item.document_type,
      this.document_num = item.document_num,
      this.direction = item.direction,
      this.phone = item.phone,
      this.email = item.email,
      this.password = item.password
      this.dialog = true;
      this.editedIndex = 1;
    },
    ativarDesativarMostrar(action, item) {
      console.log(item);
      this.adModal = 1;
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
      axios.put('usuario/activate', {'_id': this.adId}, configuration)
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
      axios.put('usuario/deactivate', {'_id': this.adId}, configuration)
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