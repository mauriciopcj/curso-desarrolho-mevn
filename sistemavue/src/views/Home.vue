<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 sm12 md12>
        <div class="ct-chart">
          <canvas id="myChart">

          </canvas>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import chart from 'chart.js'

export default {
  data(){
    return {
      valores: [],
      meses: [],
      totais: []
    }
  },
  methods: {
    listar() {
      let me = this;
      let header = {'Token': this.$store.state.token};
      let configuration = {headers: header};
      axios.get('venda/grafico12Meses', configuration).then(function (response){
        me.valores = response.data;
        me.graficar();
      }).catch(function (error){
        console.log(error);
      })
    },
    graficar(){
      let me = this;
      let mesn = '';
      me.valores.map(function(x){
        switch (parseInt(x._id.month)) {
          case 1:
            mesn = 'Janeiro'
            break;
          case 2:
            mesn = 'Fevereiro'
            break;
          case 3:
            mesn = 'Março'
            break;
          case 4:
            mesn = 'Abril'
            break;
          case 5:
            mesn = 'Maio'
            break;
          case 6:
            mesn = 'Junho'
            break;
          case 7:
            mesn = 'Julho'
            break;
          case 8:
            mesn = 'Agosto'
            break;
          case 9:
            mesn = 'Setembro'
            break;
          case 10:
            mesn = 'Outubro'
            break;
          case 11:
            mesn = 'Novembro'
            break;
          case 12:
            mesn = 'Dezembro'
            break;
          default:
            mesn = 'error';
        }
        me.meses.push(mesn+'-'+x._id.year);
        me.totais.push(x.total);
      });
      var ctx = document.getElementById('myChart');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: me.meses,
          datasets: [{
            label: 'Vendas dos últimos 12 meses',
            data: me.totais,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }
  },
  mounted(){
    this.listar();
  }
}
</script>
