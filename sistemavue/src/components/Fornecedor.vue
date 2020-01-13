<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="persons"
        :search="search"
        class="elevation-1"
      >    
        

        <template v-slot:top>
          <v-toolbar flat color="white">

            <v-toolbar-title>Fornecedor</v-toolbar-title>
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

                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="name" label="Nome"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-select v-model="document_type" :items="documents" label="Tipo do Documento"></v-select>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="document_num" label="Número do Documento"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="direction" label="Direção"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="phone" label="Telefone"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="email" label="E-mail"></v-text-field>
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

export default {

  data(){

    return {
      dialog: false,
      search: '',
      persons: [],
      headers: [
        { text: 'Opções', value: 'action', sortable: false },
        { text: 'Nome', value: 'name', sortable: true },
        { text: 'Tipo', value: 'person_type', sortable: false },
        { text: 'Tipo Documento', value: 'document_type', sortable: false },
        { text: 'Número Documento', value: 'document_num', sortable: false },
        { text: 'Direção', value: 'direction', sortable: false },
        { text: 'Telefone', value: 'phone', sortable: false },
        { text: 'E-mail', value: 'email', sortable: false },
        { text: 'Estado', value: 'status', sortable: false },
      ],
      editedIndex: -1,
      __id: '',
      name: '',
      person_type: 'Fornecedor',
      document_type: '',
      documents: ['RG', 'CPF', 'PASSAPORTE', 'CNH'],
      document_num: '',
      direction: '',
      phone: '',
      email: '',
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
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('pessoa/listFornecedores', configuration).then(function (response){
        me.persons = response.data;
      }).catch(function (error){
        console.log(error);
      })
    },
    limpar() {
      this._id = '';
      this.name = ''; 
      this.document_num = '';
      this.direction = '';
      this.phone = '';
      this.email = '';
      this.valida = 0;
      this.validaMensagem = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensagem = [];

      if(this.name.length < 1 || this.name.length > 50){
        this.validaMensagem.push('O nome da pessoa deve ter entre 1-50 caracteres');
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
      if(this.email.length > 50){
        this.validaMensagem.push('O email da pessoa deve ter menos de 50 caracteres');
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
        axios.put('pessoa/update', {
            '_id': this._id, 
            'person_type': this.person_type,
            'name': this.name, 
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
        axios.post('pessoa/add', 
        {
            'person_type': this.person_type,
            'name': this.name, 
            'document_type': this.document_type,
            'document_num': this.document_num,
            'direction': this.direction,
            'phone': this.phone,
            'email': this.email
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
      this.name = item.name, 
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
      axios.put('pessoa/activate', {'_id': this.adId}, configuration)
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
      axios.put('pessoa/deactivate', {'_id': this.adId}, configuration)
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