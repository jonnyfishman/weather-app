<template>
  <div class="name-group">
    <div class="header">
      <text-selector
        :textArray="Object.keys(weather.graphs).map(key => weather.graphs[key].title)"
        @selected="(index) => {bringToFront(index)}"
        :arrowsRight="true"
      />
      <!--
        <h3 v-for="(graph, name, index) in weather.graphs" @click="bringToFront(index)" :key="graph + '_' + index">{{ graph.title }}</h3>
      -->
    </div>
  </div>
  <div class="table-group">
    <div class="tables">
      <div v-for="(graph, name, index) in weather.graphs" :key="name" :class="{'top': index === visibleIndex}" class="weather-data">
        <table>
          <thead>
            <tr>
              <th v-for="(icon, index) in weather.icon" :key="icon + '_' + index">
                {{ weather.time[index] }}
                <i :class="'wi-' + icon"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <template v-if="graph.labels">
                <!-- CHECK FOR WIND VALUES AGAIN -->
                <td v-for="(value, index) in graph.labels" :key="value + '_' + index" :class="{'sml': value.replace('.', '').length >= 4}">
                  {{ value }}
                </td>
              </template>
              <template v-else>
                <td v-for="(value, index) in graph.data" :key="value + '_' + index" :class="{'sml': value.replace('.', '').length >= 4}">
                  {{ value + graph.unit }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="chart-group">
    <div class="charts">
      <template v-if="fontsLoaded">
        <lineChart
          v-for="(graph, name, index) in weather.graphs"
          :key="'graph_' + name"
          :class="{'top': index === visibleIndex}"
          class="chart"
          :title="graph.title"
          :data="graphData(graph.data)"
          :options="chartOptions(Math.min( ...graph.data ), Math.max( ...graph.data ))"
          :plugins="[chartPlugins]"
        />
      </template>
    </div>
  </div>
</template>

<script>
// import { LocalDateTime, DateTimeFormatter } from '@js-joda/core'
import { mapState } from 'vuex'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Title, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js'

import textSelector from './textSelector.vue'

ChartJS.register(Title, ArcElement, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

export default {
  components: {
    lineChart: Line,
    textSelector
  },
  data () {
    return {
      fontsLoaded: false,
      visibleIndex: 0,
      colorGradients: {
        one: '214, 40, 40',
        two: '247, 127, 0',
        three: '252, 191, 73',
        four: '74,193,207'
      }
    }
  },
  computed: {
    ...mapState({
      weather: state => state.weather,
      location: state => state.location
    }),
    chartPlugins () {
      return {
        id: 'labels',
        beforeEvent: (chart, args) => {
          if (args.event.type === 'click' || args.event.type === 'touchstart' || args.event.type === 'mousemove') {
            const index = Math.round(0.5 + (args.event.x * 7 / chart.width)) // chart.scales.x.getValueForPixel(args.event.x)
            document.querySelectorAll('.tables tr td:nth-child(' + index + ')').forEach((item, i) => {
              if (!item.classList.contains('highlight')) {
                item.classList.add('highlight')
                setInterval(function () {
                  item.classList.remove('highlight')
                }, 600)
              }
            })
          }
        }
      }
    }
  },
  methods: {
    chartOptions (min, max) {
      return {
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        elements: {
          point: {
            radius: 0,
            hoverRadius: 0
          },
          line: {
            tension: 0.2,
            fill: 'start',
            borderWidth: 0
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'xy'
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false,
            grid: {
              drawBorder: false
            },
            min: min - 2 * (max - min),
            max: max + 2 * (max - min)
          }
        },
        responsive: true,
        clip: false,
        maintainAspectRatio: false,
        animation: false
      }
    },
    graphData (data) {
      return {
        labels: this.weather.time,
        datasets: [
          {
            data,
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx
              const gradient = canvas.createLinearGradient(0, 0, 0, 300)
              gradient.addColorStop(1, 'rgba(' + this.colorGradients.one + ', 1')
              gradient.addColorStop(0, this.getRandomRgb())

              return gradient
            }
          }
        ]
      }
    },
    bringToFront (index) {
      this.visibleIndex = index
    },
    getRandomRgb () {
      const num = Math.round(0xffffff * Math.random())
      const r = num >> 16
      const g = num >> 8 & 255
      const b = num & 255
      return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)'
    }
  },
  mounted () {
    document.fonts.ready.then(() => {
      this.fontsLoaded = true
    })
  }
}

// custom tooltip key
// background color change with current weather
// ui https://www.quotemaster.org/images/59/59373a1708ca193d355dff51fc7216b5.jpg
// ui https://miro.medium.com/max/1400/1*NDLtDsZaUVaEZapWAdpbww.png
// pallette https://coolors.co/fffbdb-ffec51-3598db-ff674d-2f2f2f
// add more data points but hide every odd etc

// timezone maths possibly use moment.js

// https://andreybleme.com/2018-01-07/sharing-data-across-vuejs-components/
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.

.conditions-group span {
  margin-left: -0.2em;
}
.conditions-group [class^="wi-"] {
  font-size:3em;
}

.sml {
  font-size: 80%;
}
</style>
