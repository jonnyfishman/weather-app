<template>
  <div class="conditions-group">
    <div v-if='dataCurrent.length'>
      <h2>Current Conditions</h2>
      <p>Broken clouds</p>
    </div>

  </div>
  <div class="name-group">
    <div class="header">
      <h2>Forecast</h2>
      <h4>Temperature</h4>
      <button>Temperature</button>
    </div>
  </div>
  <div class="table-group">
    <div class="tables">
      <div :class="{top: visibleData[0]}" class="weather-data">
        <table>
          <thead>
            <tr>
              <th>12:00</th>
              <th>13:00</th>
              <th>14:00</th>
              <th>15:00</th>
              <th>16:00</th>
              <th>17:00</th>
              <th>18:00</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(value, index) in dataCurrent" :key="value + '_' + index">{{ value }}&deg;</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div :class="{top: visibleData[1]}" class="weather-data">
        <table>
          <thead>
            <tr>
              <th>12:00</th>
              <th>13:00</th>
              <th>14:00</th>
              <th>15:00</th>
              <th>16:00</th>
              <th>17:00</th>
              <th>18:00</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(value, index) in dataCurrent" :key="value + '_' + index">{{ Math.ceil(value/10) }}&deg;</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div :class="{top: visibleData[2]}" class="weather-data">
        <table>
          <thead>
            <tr>
              <th>12:00</th>
              <th>13:00</th>
              <th>14:00</th>
              <th>15:00</th>
              <th>16:00</th>
              <th>17:00</th>
              <th>18:00</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(value, index) in dataCurrent" :key="value + '_' + index">{{ Math.ceil(value*3.6) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="chart-group">
    <div class="charts">
      <Line :class="{top: visibleData[0]}" class="chart" v-if="fontsLoaded && dataLoaded" :chart-data="temperatureData" :chart-options="chartOptions" :plugins="[chartPlugins]"/>
      <Line :class="{top: visibleData[1]}" class="chart" v-if="fontsLoaded && dataLoaded" :chart-data="windDirectionData" :chart-options="chartOptions" :plugins="[chartPlugins]"/>
      <Line :class="{top: visibleData[2]}" class="chart" v-if="fontsLoaded && dataLoaded" :chart-data="pressureData" :chart-options="chartOptions" :plugins="[chartPlugins]"/>
    </div>
  </div>
  <div class="button-group">
    <button>T</button>
    <button>W</button>
    <button>S</button>
  </div>
</template>

<script>
// import OpenWeatherAPI from 'openweather-api-node'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip } from 'chart.js'

ChartJS.register(Title, Legend, LineElement, PointElement, CategoryScale, LinearScale, ChartDataLabels, Filler, Tooltip)
/*
const weather = new OpenWeatherAPI({
  key: '1835dad453aa19a5d4dba6d784dc52c3',
  units: 'metric'
})
*/
export default {
  name: 'LineChart',
  components: { Line },
  props: {
    defaultLocation: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      scrollAmount: 0,
      fontsLoaded: false,
      dataLoaded: false,
      defaultBackground: '#185D8C',
      pointBackgroundColor: '#18618c',
      location: this.defaultLocation,
      weather: [],
      dataCurrent: [7.1, 7.3, 7.0, 7.6, 7.7, 8, 8.2, 8.1],
      colorGradients: {
        one: '214, 40, 40',
        two: '247, 127, 0',
        three: '252, 191, 73',
        four: '74,193,207'
      },
      dataPast: [],
      labels: ['', '', '', '', '', '', '', ''],
      pointRadius: [],
      visibleData: [true, false, false],
      iconMapping: {
        '01d': '0xf00d', // clear sky - wi-day-sunny
        '02d': '0xf002', // few clouds - wi-day-cloudy
        '03d': '0xf07d', // scattered clouds - wi-day-cloudy-high
        '04d': '0xf013', // broken clouds - wi-cloudy
        '09d': '0xf009', // shower rain - wi-day-showers
        '10d': '0xf008', // rain - wi-day-rain
        '11d': '0xf010', // thunderstorm - wi-day-thunderstorm
        '13d': '0xf00a', // snow - wi-day-snow
        '50d': '0xf014', // mist - wi-fog
        '01n': '0xf02e', // clear sky - wi-night-clear
        '02n': '0xf07e', // few clouds - wi-night-alt-cloudy-high
        '03n': '0xf086', // scattered clouds - wi-night-alt-cloudy
        '04n': '0xf031', // broken clouds - wi-night-cloudy
        '09n': '0xf029', // shower rain - wi-night-alt-showers
        '10n': '0xf028', // rain - wi-night-alt-rain
        '11n': '0xf02d', // thunderstorm - wi-night-alt-thunderstorm
        '13n': '0xf02a', // snow - wi-night-alt-snow
        '50n': '0xf04a' // mist - wi-night-fog
      }
    }
  },
  computed: {
    temperatureData () {
      return {
        labels: this.labels,
        datasets: [
          {
            data: this.dataCurrent,
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
    windSpeedData () {
      return {
        labels: this.labels,
        datasets: [
          {
            data: [
              this.randomBetween(0, 100),
              this.randomBetween(0, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(40, 100),
              this.randomBetween(50, 100),
              this.randomBetween(60, 100)
            ],
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx
              const gradient = canvas.createLinearGradient(0, 0, 0, 300)
              gradient.addColorStop(1, 'rgba(' + this.colorGradients.two + ', 1')
              gradient.addColorStop(0, this.getRandomRgb())

              return gradient
            }
          }
        ]
      }
    },
    windChillData () {
      return {
        labels: this.labels,
        datasets: [
          {
            data: [
              this.randomBetween(0, 100),
              this.randomBetween(0, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(40, 100),
              this.randomBetween(50, 100),
              this.randomBetween(60, 100)
            ],
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx
              const gradient = canvas.createLinearGradient(0, 0, 0, 300)
              gradient.addColorStop(1, 'rgba(' + this.colorGradients.three + ', 1')
              gradient.addColorStop(0, this.getRandomRgb())

              return gradient
            }
          }
        ]
      }
    },
    visibilityData () {
      return {
        labels: [
          this.randomBetween(0, 100),
          this.randomBetween(0, 100),
          this.randomBetween(20, 100),
          this.randomBetween(20, 100),
          this.randomBetween(20, 100),
          this.randomBetween(40, 100),
          this.randomBetween(50, 100),
          this.randomBetween(60, 100)
        ],
        datasets: [
          {
            data: [
              this.randomBetween(0, 100),
              this.randomBetween(0, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(40, 100),
              this.randomBetween(50, 100),
              this.randomBetween(60, 100)
            ],
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx
              const gradient = canvas.createLinearGradient(0, 0, 0, 300)
              gradient.addColorStop(1, 'rgba(' + this.colorGradients.two + ', 1')
              gradient.addColorStop(0, this.getRandomRgb())

              return gradient
            }
          }
        ]
      }
    },
    pressureData () {
      return {
        labels: this.labels,
        datasets: [
          {
            data: [
              this.randomBetween(0, 100),
              this.randomBetween(0, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(40, 100),
              this.randomBetween(50, 100),
              this.randomBetween(60, 100)
            ],
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx
              const gradient = canvas.createLinearGradient(0, 0, 0, 300)
              gradient.addColorStop(1, 'rgba(' + this.colorGradients.two + ', 1')
              gradient.addColorStop(0, this.getRandomRgb())

              return gradient
            }
          }
        ]
      }
    },
    windDirectionData () {
      return {
        labels: [
          this.randomBetween(0, 100),
          this.randomBetween(0, 100),
          this.randomBetween(20, 100),
          this.randomBetween(20, 100),
          this.randomBetween(20, 100),
          this.randomBetween(40, 100),
          this.randomBetween(50, 100),
          this.randomBetween(60, 100)
        ],
        datasets: [
          {
            data: [
              this.randomBetween(0, 100),
              this.randomBetween(0, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(20, 100),
              this.randomBetween(40, 100),
              this.randomBetween(50, 100),
              this.randomBetween(60, 100)
            ],
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx
              const gradient = canvas.createLinearGradient(0, 0, 0, 300)
              gradient.addColorStop(1, 'rgba(' + this.colorGradients.three + ', 1')
              gradient.addColorStop(0, this.getRandomRgb())

              return gradient
            }
          }
        ]
      }
    },
    chartOptions () {
      return {
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: function (context) {
              return context.chart.data.labels[0] === 1
            },
            color: '#fff',
            font: {
              size: 20,
              family: '"Gill Sans", sans-serif'
            }
          },
          tooltip: {
            enabled: false,
            displayColors: false,
            backgroundColor: '#ffffff',
            position: 'nearest',
            caretSize: 10,
            bodyColor: '#000000',
            bodyFont: {
              family: 'Gill Sans',
              size: 14,
              weight: 'normal'
            },
            padding: 10,
            callbacks: {
              title: () => null,
              label: function (context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + '°'
                }
                return label
              }
            }
          }
        },
        elements: {
          point: {
            radius: 0,
            hoverRadius: 0
          },
          line: {
            tension: 0.4,
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
            display: false,
            ticks: {
              display: false
            },
            grid: {
              color: function (context) {
                if (context.tick.value === 0) {
                  return '#ffffff00'
                } else {
                  return '#ffffff'
                }
              },
              lineWidth: 0.5
            }
          },
          y: {
            display: false,
            grid: {
              drawBorder: false
            },
            grace: '10%'
          }
        },
        layout: {
          padding: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }
        },
        responsive: true,
        clip: false,
        maintainAspectRatio: false,
        animation: false
      }
    },
    chartPlugins () {
      return {
        id: 'labels',
        beforeEvent: (chart, args) => {
          if (args.event.type === 'click' || args.event.type === 'touchstart' || args.event.type === 'mousemove') {
            const index = Math.round(0.5 + (args.event.x * 7 / chart.width)) // chart.scales.x.getValueForPixel(args.event.x)
            document.querySelectorAll('tr td:nth-child(' + index + ')').forEach((item, i) => {
              if (!item.classList.contains('highlight')) {
                item.classList.add('highlight')
                setInterval(function () {
                  item.classList.remove('highlight')
                }, 1000)
              }
            })
          }
        }
      }
    }
  },
  methods: {
    stopwatch () {
      setInterval(function () {
        this.visibleData.push(this.visibleData.shift())
        this.labels[0] = new Date()
      }.bind(this), 5000)
    },
    randomBetween (min, max) {
      return min + Math.floor(Math.random() * (max - min + 1))
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
      /*
      weather.setLocationByName(this.defaultLocation)

      let err = null
      try {
        await weather.getLocation()
      } catch {
        err++
        // call error response
      }

      if (err) return
      console.log(weather.getEverything())
      const tomorrow = await weather.getHourlyForecast(12)

      let yesterday = []
      const today = await weather.getHistory(new Date().getTime() - 6000, { units: 'metric' })

      if (today.length < 14) {
        yesterday = await weather.getHistory(new Date().getTime() - 86400000, { units: 'metric' })
      }

      yesterday.slice(today - 12).concat(today.hourly.slice(-14), tomorrow.slice(1)).forEach((dataPoint, index) => {
        // if (index % 2 !== 0) {
        this.weather.push({ desc: dataPoint.weather.description, icon: dataPoint.weather.icon.raw, time: dataPoint.dt.toString().split(' ')[4].split(':')[0] })
        this.dataCurrent.push(dataPoint.weather.temp.cur)
        // this.labels.push({ time: new Date(dataPoint.dt).getHours(), speed: dataPoint.weather.wind.speed, dir: dataPoint.weather.wind.deg })
        if (index % 2 !== 0) {
          this.labels.push('0x0' + String(new Date(dataPoint.dt).getHours()).padStart(2, '0'))
        } else {
          this.labels.push('')
        }
        // }
      })
      */
      this.dataLoaded = true

      // console.log(this.weather)
      // weather.setLocationByName(this.location)
    },
    scroll: function (amount) {
      const menu = this.$refs.scrollable

      if (this.scrollAmount + amount >= 0 && this.scrollAmount + amount <= 950) {
        menu.scrollTo({
          left: this.scrollAmount += amount,
          behavior: 'smooth'
        })
      }
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
    this.stopwatch()
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

</style>
