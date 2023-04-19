<template>
  <div class="conditions-group">
    <div v-if='weather.time.length'>

      <p>Saturday 12th August</p>
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
        <Line v-for="(graph, name, index) in weather.graphs" :key="'graph' + name" :class="{'top': index === visibleIndex}" class="chart" :title="graph.label" :chart-data="graphData(graph.data)" :chart-options="chartOptions(Math.min( ...graph.data ), Math.max( ...graph.data ))" :plugins="[chartPlugins]"/>
      </template>
    </div>
  </div>
</template>

<script>
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
  props: {
    defaultLocation: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      fontsLoaded: false,
      dataLoaded: false,
      defaultBackground: '#185D8C',
      pointBackgroundColor: '#18618c',
      location: this.defaultLocation,
      visibleIndex: 0,
      weather: {
        description: [],
        icon: [],
        time: [],
        graphs: {
          temperature: {
            label: 'Temperature',
            data: [],
            unit: '°'
          },
          windChill: {
            label: 'Windchill',
            data: [],
            unit: '°'
          },
          pop: {
            label: 'Chance of rain',
            data: [],
            unit: '%'
          },
          pressure: {
            label: 'Pressure',
            data: [],
            unit: 'Pa'
          },
          windSpeed: {
            label: 'Wind Speed',
            data: [],
            unit: ''
          },
          gustSpeed: {
            label: 'Gust Speed',
            data: [],
            unit: ''
          },
          windDirection: {
            label: 'Wind Direction',
            data: [],
            unit: '°'
          }
        }
      },
      colorGradients: {
        one: '214, 40, 40',
        two: '247, 127, 0',
        three: '252, 191, 73',
        four: '74,193,207'
      }
    }
  },
  computed: {
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
    async changeLocation () {
      weather.setLocationByName(this.defaultLocation)

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

      for (let index = 0; index < 8; index++) {
        this.weather.description[index] = weatherData[index].weather.description
        this.weather.icon[index] = weatherData[index].weather.icon.raw
        this.weather.time[index] = String(weatherData[index].dt.getHours()).padStart(2, '0') + ':00'
        this.weather.graphs.temperature.data[index] = weatherData[index].weather.temp.cur.toFixed(1)
        this.weather.graphs.windChill.data[index] = weatherData[index].weather.feels_like.cur.toFixed(1)
        this.weather.graphs.pop.data[index] = String(Math.floor(weatherData[index].weather.pop * 100))
        this.weather.graphs.pressure.data[index] = String(weatherData[index].weather.pressure)
        this.weather.graphs.windSpeed.data[index] = weatherData[index].weather.wind.speed.toFixed(1)
        this.weather.graphs.gustSpeed.data[index] = weatherData[index].weather.wind.gust.toFixed(1)
        this.weather.graphs.windDirection.data[index] = String(weatherData[index].weather.wind.deg)
      }

      /*
      this.weather.description = [
        'clear sky',
        'few clouds',
        'scattered clouds',
        'scattered clouds',
        'broken clouds',
        'broken clouds',
        'overcast clouds'
      ]
      this.weather.icon = [
        '01d',
        '01d',
        '02d',
        '02d',
        '01d',
        '02d',
        '03d'
      ]
      this.weather.time = [
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00'
      ]
      this.weather.graphs.temperature.data = [
        11.8,
        11.4,
        10.9,
        10.3,
        9.5,
        8.1,
        7.9,
        7.3
      ]
      this.weather.graphs.windChill.data = [
        11.8,
        11.4,
        10.9,
        10.3,
        9.5,
        8.1,
        7.9,
        5.2
      ]
      this.weather.graphs.pop.data = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
      this.weather.graphs.pressure.data = [
        1029,
        1029,
        1029,
        1029,
        1028,
        1028,
        1029,
        1029
      ]
      this.weather.graphs.windSpeed.data = [
        8.9,
        8.4,
        8.3,
        7.6,
        6.8,
        6.5,
        6.6,
        6.2
      ]
      this.weather.graphs.gustSpeed.data = [
        12.5,
        11.8,
        11.5,
        11.4,
        11.1,
        11.7,
        12.2,
        12.1
      ]
      this.weather.graphs.windDirection.data = [
        65,
        65,
        67,
        69,
        67,
        61,
        59,
        58
      ]
      */
      console.log(this.weather)

      this.dataLoaded = true

      // console.log(this.weather)
      // weather.setLocationByName(this.location)
    }
  },
  watch: {
    defaultLocation () { this.changeLocation() }
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
.arrows {
  position: relative;
  cursor: pointer;
  margin:auto;
  display:flex;
  flex-direction:column;
  align-items:center;

}

.arrow {
  display: block;
  width: 5px;
  height: 5px;
  -ms-transform: rotate(45deg); /* IE 9 */
  -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
  transform: rotate(45deg);

  border-right: 2px solid white;
  border-bottom: 2px solid white;
  margin: 0 0 3px 4px;

  width: 16px;
  height: 16px;
  -webkit-animation: mouse-scroll 1s infinite;
    -moz-animation: mouse-scroll 1s infinite;
    animation: mouse-scroll 1s infinite;
}

.arrow:nth-child(1) {
  -webkit-animation-delay: .1s;
  -moz-animation-delay: .1s;
  -webkit-animation-direction: alternate;

  animation-direction: alternate;
  animation-delay: alternate;
}

.arrow:nth-child(2) {
  -webkit-animation-delay: .2s;
  -moz-animation-delay: .2s;
  -webkit-animation-direction: alternate;

  animation-delay: .2s;
  animation-direction: alternate;

  margin-top: -6px;
}

.arrow:nth-child(3) {
  -webkit-animation-delay: .3s;
  -moz-animation-delay: .3s;
  -webkit-animation-direction: alternate;

  animation-delay: .3s;
  animation-direction: alternate;

  margin-top: -6px;
}

@-webkit-keyframes mouse-scroll {

0%   { opacity: 0;}
50%  { opacity: .5;}
100% { opacity: 1;}
}
@-moz-keyframes mouse-scroll {

0%   { opacity: 0; }
50%  { opacity: .5; }
100% { opacity: 1; }
}
@-o-keyframes mouse-scroll {

0%   { opacity: 0; }
50%  { opacity: .5; }
100% { opacity: 1; }
}
@keyframes mouse-scroll {

0%   { opacity: 0; }
50%  { opacity: .5; }
100% { opacity: 1; }
}

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
