<template>
  <div class="chart">
    <div class="current-conditions" v-if='dataCurrent.length'>
      <span>{{ weatherIcon(weather[0].icon) }}</span>
      <p>{{ weather[0].desc }}</p>
      <p>{{ Math.round(dataCurrent[0]) }}<em class="wi wi-thermometer"></em></p>

    </div>
    <div v-else class="loading">
      <p>Fetching weather data</p>
    </div>
    <div>
      <Line id="chart" v-if="fontsLoaded" :chart-data="chartData" :chart-options="chartOptions" :plugins="[chartPlugins]"/>
    </div>
  </div>
  <div id="preloadfont">&nbsp;</div>
</template>

<script>
import OpenWeatherAPI from 'openweather-api-node'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js'

ChartJS.register(Title, Legend, LineElement, PointElement, CategoryScale, LinearScale, ChartDataLabels, Filler)

const weather = new OpenWeatherAPI({
  key: '1835dad453aa19a5d4dba6d784dc52c3',
  units: 'metric'
})

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
      defaultBackground: '#185D8C',
      pointBackgroundColor: '#18618c',
      location: this.defaultLocation,
      weather: [],
      dataCurrent: [],
      dataPast: [],
      labels: [],
      pointRadius: [],
      iconMapping: { // need to map night time codes
        '01d': '0xf00d', // clear sky
        '02d': '0xf002', // few clouds
        '03d': '0xf07d', // scattered clouds
        '04d': '0xf013', // broken clouds
        '09d': '0xf009', // shower rain
        '10d': '0xf008', // rain
        '11d': '0xf010', // thunderstorm
        '13d': '0xf00a', // snow
        '50d': '0xf014', // mist
        '01n': '0xf02e', // clear sky
        '02n': '0xf07e', // few clouds
        '03n': '0xf086', // scattered clouds
        '04n': '0xf013', // broken clouds
        '09n': '0xf029', // shower rain
        '10n': '0xf028', // rain
        '11n': '0xf02d', // thunderstorm
        '13n': '0xf02a', // snow
        '50n': '0xf014' // mist
      }
    }
  },
  computed: {
    chartData () {
      return {
        labels: this.labels,
        datasets: [
          {
            data: this.dataCurrent,
            borderColor: '#fff',
            borderWidth: 2,
            tension: 0.5,
            pointBackgroundColor: this.pointBackgroundColor,
            pointBorderColor: '#fff',
            pointRadius: function (value, ctx) {
              return value.dataset.data.map((point, index, values) => {
                const max = Math.max(...values.slice(1, -1))
                const min = Math.min(...values.slice(1, -1))
                return point === max || point === min ? 4 : 0
              })
            },
            pointBorderWidth: function (value, ctx) {
              return value.dataset.data.map((point, index, values) => {
                const max = Math.max(...values.slice(1, -1))
                const min = Math.min(...values.slice(1, -1))
                return point === max || point === min ? 2 : 0
              })
            },
            datalabels: {
              labels: {
                label: {
                  align: 'top',
                  formatter: function (value, ctx, index) {
                    return (value === Math.min(...ctx.chart.data.datasets[0].data.slice(1, -1)) && index !== 0 && index !== ctx.chart.data.datasets[0].data.length) ? value.toFixed(1) + String.fromCharCode('0xf03c') : null
                  }
                },
                value: {
                  align: 'bottom',
                  formatter: function (value, ctx, index) {
                    return (value === Math.max(...ctx.chart.data.datasets[0].data.slice(1, -1)) && index !== 0 && index !== ctx.chart.data.datasets[0].data.length) ? value.toFixed(1) + String.fromCharCode('0xf03c') : null
                  }
                },
                index: null
              }
            }
          },
          {
            data: this.dataPast,
            fill: 'start',
            borderWidth: 0,
            tension: 0.5,
            pointRadius: 0,
            backgroundColor: 'rgb(200, 200, 200, 0.5)',
            datalabels: {
              labels: {
                label: null,
                value: null,
                index: null
              }
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
            color: '#fff',
            font: {
              size: 18,
              family: '"weathericons", "Quicksand", sans-serif'
            },
            padding: 14
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            display: true,
            position: 'top',
            ticks: {
              color: '#fff',
              font: {
                size: 20,
                family: '"weathericons", "Quicksand", sans-serif'
              },
              callback: (label, index) => {
                if (index % 2 === 0) return
                return [this.weatherIcon(this.weather[index].icon), this.windDirection(this.labels[index].dir), this.toBeaufort(this.labels[index].speed)]
              }
            }
          },
          y: {
            display: false,
            grace: '3%'
          }
        },
        layout: {
          padding: 0
        },
        responsive: true,
        clip: false,
        maintainAspectRatio: false,
        animation: false,
        tooltips: {
          enabled: true
        },
        hover: {
          mode: null
        }
      }
    },
    chartPlugins () {
      return {
        id: 'instrucitons',
        afterRender: chart => {
          const ctx = chart.ctx
          // console.log(chart.width, chart.height, chart.layers)
          ctx.textAlign = 'center'
          ctx.fillStyle = 'white'
          ctx.font = 'bold 16px Quicksand'
          ctx.fillText(String.fromCharCode(0x2733) + ' data shown for two hourly intervals', chart.width / 2, chart.height - 20)
          ctx.restore()
        }
      }
    }
  },
  methods: {
    weatherIcon (icon) {
      return String.fromCharCode(this.iconMapping[icon])
    },
    windDirection (dir) {
      if (dir > 337.5 || dir <= 22.5) {
        return String.fromCharCode(0xf044) // from N
      } else if (dir > 22.5 && dir <= 67.5) {
        return String.fromCharCode(0xf043)
      } else if (dir > 67.5 && dir <= 112.5) {
        return String.fromCharCode(0xf048) // from E
      } else if (dir > 112.5 && dir <= 157.5) {
        return String.fromCharCode(0xf087)
      } else if (dir > 157.5 && dir <= 202.5) {
        return String.fromCharCode(0xf058)
      } else if (dir > 202.5 && dir <= 247.5) {
        return String.fromCharCode(0xf057)
      } else if (dir > 247.5 && dir <= 292.5) {
        return String.fromCharCode(0xf04d)
      } else if (dir > 292.5 && dir <= 337.5) {
        return String.fromCharCode(0xf088)
      } else {
        return null
      }
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
      try {
        await weather.getLocation()
      } catch {
        err++
        // call error response
      }

      if (err) return

      weather.getHourlyForecast(11).then(dataPoints => {
        dataPoints.forEach((dataPoint, index) => {
          this.weather[index] = { desc: dataPoint.weather.description, icon: dataPoint.weather.icon.raw, time: dataPoint.dt.toString().split(' ')[4].split(':')[0] }
          this.dataCurrent[index] = dataPoint.weather.temp.cur
          this.labels[index] = { speed: dataPoint.weather.wind.speed, dir: dataPoint.weather.wind.deg }
        })
      })

      const today = await weather.getHistory(new Date().getTime() - 6000, { units: 'metric' })

      this.dataPast = today.hourly.slice(-11).map(dataPoint => {
        // console.log(dataPoint.dt, dataPoint.weather.temp.cur)
        return dataPoint.weather.temp.cur
      })
      if (this.dataPast.length < 11) {
        const yesterday = await weather.getHistory(new Date().getTime() - 86400000, { units: 'metric' }).slice(this.dataPast.length - 11).map(dataPoint => {
          // console.log(dataPoint.dt, dataPoint.weather.temp.cur)
          return dataPoint.weather.temp.cur
        })
        this.dataPast = yesterday.concat(this.dataPast)
      }
      // console.log(this.dataPast)

      const current = await weather.getCurrent({ units: 'metric' })

      if (Date.now() / 1000 > current.astronomical.sunset_raw && Date.now() / 1000 < current.astronomical.sunrise_raw + Math.pow(8.64, 7) && this.weather[0]) {
        if (this.weather[0].desc.indexOf('clear') > -1) {
          document.body.style.backgroundColor = '#222'
          this.pointBackgroundColor = '#222'
        } else {
          document.body.style.backgroundColor = '#444'
          this.pointBackgroundColor = '#444'
        }
      } else if (this.weather[0]) {
        if (this.weather[0].desc.indexOf('clear') > -1 && Math.round(this.dataCurrent[0]) > 16) {
          document.body.style.backgroundColor = '#d3273e'
          this.pointBackgroundColor = '#d3273e'
        } else {
          document.body.style.backgroundColor = this.defaultBackground
          this.pointBackgroundColor = '#18618c'
        }
      }
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
