<template>
  <div class="conditions-group">
    <div v-if='weather.time.length'>

      <p>{{ weather.date[0] }}</p>
      <i style="font-size:8em" :class="'wi-' + weather.icon[0]"></i>
      <p style="font-size:1.6em;margin:0.4em;">{{ weather.description[0] }}</p>
      <table>
        <tr>
          <td>
            <svg viewBox="0 0 30 30">
              <path fill="#fff" d="M15 15.43v6.975"/>
              <path fill="#fff" d="m14.49 15.336.01 7.07c0 1.083-.595 1.446-1.174 1.446s-1.174-.363-1.174-1.446a.5.5 0 0 0-1 0c0 1.513 1.079 2.446 2.174 2.446 1.096 0 2.174-.933 2.174-2.446v-.002l-.01-7.068z" color="#000" style="-inkscape-stroke:none"/>
              <path fill="#fff" d="M15 5.018a.5.5 0 0 0-.5.502l.002 1.242c-2.183.26-4.175.803-5.74 2.09-1.599 1.314-2.696 3.383-3.112 6.513a.5.5 0 0 0 .825.442c.964-.844 1.826-1.146 2.664-1.12.838.027 1.692.4 2.574 1.051a.5.5 0 0 0 .027.01.5.5 0 0 0 .178.072.5.5 0 0 0 .05.01.5.5 0 0 0 .216-.031.5.5 0 0 0 .037-.018.5.5 0 0 0 .068-.031c1.4-.945 2.356-1.13 3.152-1.021.796.108 1.493.547 2.288 1.033a.5.5 0 0 0 .052.021.5.5 0 0 0 .037.016.5.5 0 0 0 .225.031.5.5 0 0 0 .025-.006.5.5 0 0 0 .198-.078.5.5 0 0 0 .021-.008c.882-.651 1.736-1.024 2.574-1.05.838-.027 1.7.275 2.664 1.119a.5.5 0 0 0 .825-.442c-.416-3.13-1.513-5.2-3.112-6.513-1.564-1.287-3.555-1.83-5.736-2.09L15.5 5.518a.5.5 0 0 0-.5-.5zm0 2.628c2.354 2.453 2.222 4.569 2.389 6.747-.54-.301-1.126-.561-1.813-.655-.855-.116-1.826.051-2.965.653.167-2.178.036-4.292 2.389-6.745zm-1.46.34c-1.763 2.411-1.783 4.63-1.948 6.534-.775-.46-1.572-.806-2.422-.832-.73-.023-1.468.24-2.203.64.486-2.176 1.274-3.755 2.43-4.705 1.096-.902 2.542-1.345 4.142-1.637zm2.92 0c1.601.292 3.047.735 4.144 1.637 1.155.95 1.943 2.529 2.43 4.705-.736-.4-1.475-.663-2.204-.64-.85.026-1.647.371-2.422.832-.165-1.904-.185-4.123-1.947-6.534zM15.002 6.85 15 5.518" color="#000" style="-inkscape-stroke:none"/>
            </svg>
            <span>{{ weather.graphs.pop.data[0] }}%</span>
          </td>
          <td>
            <i class="wi-thermometer"></i>
            <span>{{ weather.graphs.temperature.data[0] }}°</span>
          </td>
          <td>
            <i class="wi-wind" :class="'wi-rotate-' + Math.round(weather.graphs.windDirection.data[0])"></i>
            <span>{{ toBeaufort(weather.graphs.windSpeed.data[0]) }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <scroll-down />

  <div class="name-group">
    <div class="header">

      <h3 v-for="(graph, name, index) in weather.graphs" @click="bringToFront(index)" :key="graph + '_' + index">{{ graph.label }}</h3>

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
              <td v-for="(value, index) in graph.data" :key="value + '_' + index" :class="{'sml': value.replace('.', '').length >= 4}">{{ value + graph.unit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="chart-group">
    <div class="charts">
      <template v-if="fontsLoaded && dataLoaded">
        <Line
          v-for="(graph, name, index) in weather.graphs"
          :key="'graph_' + name"
          :class="{'top': index === visibleIndex}"
          class="chart"
          :title="graph.label"
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
import OpenWeatherAPI from 'openweather-api-node'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import ScrollDown from './scrollDown.vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Title, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip } from 'chart.js'

ChartJS.register(Title, ArcElement, Legend, LineElement, PointElement, CategoryScale, LinearScale, ChartDataLabels, Filler, Tooltip)

const weather = new OpenWeatherAPI({
  key: '1835dad453aa19a5d4dba6d784dc52c3',
  units: 'metric'
})

export default {
  name: 'LineChart',
  components: {
    Line,
    ScrollDown
  },
  data () {
    return {
      fontsLoaded: false,
      dataLoaded: false,
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
    toBeaufort (speed) {
      if (speed > 0 && speed <= 0.2) {
        return 'F1'
      } else if (speed > 0.2 && speed <= 1.5) {
        return 'F2'
      } else if (speed > 1.5 && speed <= 3.3) {
        return 'F3'
      } else if (speed > 3.3 && speed <= 5.4) {
        return 'F4'
      } else if (speed > 5.4 && speed <= 7.9) {
        return 'F5'
      } else if (speed > 7.9 && speed <= 10.7) {
        return 'F6'
      } else if (speed > 10.7 && speed <= 13.8) {
        return 'F7'
      } else if (speed > 13.8 && speed <= 17.1) {
        return 'F8'
      } else {
        return '>F8'
      }
    },
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
            data: data,
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
    },
    async changeLocation () {
      weather.setLocationByName(this.location)

      let err = null
      let weatherData = null
      try {
        weatherData = await weather.getHourlyForecast()
        console.log(weatherData)
      } catch {
        err++
        // call error response
      }

      if (err) return
      this.$store.dispatch('updateWeather', weatherData)

      console.log(this.weather)

      this.dataLoaded = true

      // console.log(this.weather)
      // weather.setLocationByName(this.location)
    }
  },
  async created () {
    await this.changeLocation()
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
