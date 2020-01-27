<template>
  <v-layout align-start>
    <v-flex>
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

                    <v-text-field @keyup.enter="listarArtigos" class="text-xs-center" v-model="texto" append-icon="search" label="Pesquisa"></v-text-field>

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

                          </v-toolbar>
                        </template>

                        <template v-slot:item.action="{ item }">
                          <v-icon class="black--text"
                            @click="adicionarDetalhe(item)"
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
      
      <v-data-table
        :headers="headers"
        :items="compras"
        :search="search"
        class="elevation-1"
        v-if="verNovo==0"
      >  
        <template v-slot:item.action="{ item }">

          <v-icon small class="mr-2" @click="verCompra(item)">
            tab
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

        <template v-slot:item.user="{item}">
          <v-text>{{ item.user.name }}</v-text>
        </template>

        <template v-slot:item.person="{item}">
          <v-text>{{ item.person.name }}</v-text>
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
                  <v-icon class="black--text"
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
            <v-btn color="success" v-if="verDetalhe==0" @click.native="salvar()">Salvar</v-btn>
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
      _id: '',
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
      verDetalhe: 0,
      valida: 0,
      validaMensagem: [],
      adModal: 0,
      adAction: 0,
      adName: '',
      adId: ''
    }
  },
  computed: {
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
        });
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
            _id: data._id,
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
    listarDetalhes(id) {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('compra/query?_id=' + id, configuration).then(function (response){
        me.detalhes = response.data.details;
      }).catch(function (error){
        console.log(error);
      })
    },
    verCompra(item){
      this.limpar();
      this.receipt_type = item.receipt_type;
      this.receipt_serie = item.receipt_serie;
      this.receipt_num = item.receipt_num;
      this.person = item.person._id;
      this.tax = item.tax;
      this.listarDetalhes(item._id);
      this.verNovo = 1;
      this.verDetalhe = 1;
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
      this.receipt_type = '';
      this.receipt_serie = '';
      this.receipt_num = '';
      this.tax = 0.18;
      this.code = '';
      this.total = 0;
      this.totalParcial = 0;
      this.totalImposto = 0;
      this.detalhes = [];
      this.verNovo = 0;
      this.valida = 0;
      this.validaMensagem = [];
      this.verDetalhe = 0;
    },
    validar() {
      this.valida = 0;
      this.validaMensagem = [];

      if(!this.person){
        this.validaMensagem.push('Seleciona um Fornecedor');
      }
      if(!this.receipt_type){
        this.validaMensagem.push('Selecione um tipo de comprovante');
      }
      if(!this.receipt_num){
        this.validaMensagem.push('Insira o número do comprovante');
      }
      if(!this.tax || this.tax < 0 || this.tax > 1){
        this.validaMensagem.push('Insira um imposto válido');
      }
      if(this.detalhes.length <= 0){
        this.validaMensagem.push('Insira ao menos um artigo em detalhes');
      }
      if(this.validaMensagem.length){
        this.valida = 1;
      }
      return this.valida;
    },
    mostraNovo(){
      this.verNovo = 1;
    },
    ocultarNovo(){
      this.verNovo = 0;
      this.limpar();
    },
    salvar() {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      if (this.validar()){
        return;
      }
      // Código para salvar
      axios.post('compra/add', 
      {
          'person': this.person,
          'user': this.$store.state.usuario._id,
          'receipt_type': this.receipt_type,
          'receipt_serie': this.receipt_serie,
          'receipt_num': this.receipt_num,
          'tax': this.tax,
          'total': this.total,
          'details': this.detalhes
      }, configuration)
      .then(function(response){
        me.limpar();
        me.close();
        me.listar();
      }).catch(function(error){
        console.log(error);
      });
    },
    ativarDesativarMostrar(action, item) {
      this.adModal = 1;
      this.adName = item.receipt_num;
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
      axios.put('compra/activate', {'_id': this.adId}, configuration)
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
      axios.put('compra/deactivate', {'_id': this.adId}, configuration)
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
      this.dialog = false;
    },
  }
}
</script>

<style>

</style>