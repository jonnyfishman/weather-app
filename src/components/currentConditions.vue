<template>
  <div class="conditions-group">
    <div v-if='weather.date.length > 0'>

      <p>{{ weather.date[0] }}</p>
      <i style="font-size:8em" :class="'wi-' + weather.icon[0]"></i>
      <p style="font-size:1.6em;margin:0.4em;">{{ weather.description[0] }}</p>
      <table>
        <tr>
          <td>
            <svg viewBox="0 0 30 30">
              <path fill="#333" d="M15 15.43v6.975"/>
              <path fill="#333" d="m14.49 15.336.01 7.07c0 1.083-.595 1.446-1.174 1.446s-1.174-.363-1.174-1.446a.5.5 0 0 0-1 0c0 1.513 1.079 2.446 2.174 2.446 1.096 0 2.174-.933 2.174-2.446v-.002l-.01-7.068z" color="#000" style="-inkscape-stroke:none"/>
              <path fill="#333" d="M15 5.018a.5.5 0 0 0-.5.502l.002 1.242c-2.183.26-4.175.803-5.74 2.09-1.599 1.314-2.696 3.383-3.112 6.513a.5.5 0 0 0 .825.442c.964-.844 1.826-1.146 2.664-1.12.838.027 1.692.4 2.574 1.051a.5.5 0 0 0 .027.01.5.5 0 0 0 .178.072.5.5 0 0 0 .05.01.5.5 0 0 0 .216-.031.5.5 0 0 0 .037-.018.5.5 0 0 0 .068-.031c1.4-.945 2.356-1.13 3.152-1.021.796.108 1.493.547 2.288 1.033a.5.5 0 0 0 .052.021.5.5 0 0 0 .037.016.5.5 0 0 0 .225.031.5.5 0 0 0 .025-.006.5.5 0 0 0 .198-.078.5.5 0 0 0 .021-.008c.882-.651 1.736-1.024 2.574-1.05.838-.027 1.7.275 2.664 1.119a.5.5 0 0 0 .825-.442c-.416-3.13-1.513-5.2-3.112-6.513-1.564-1.287-3.555-1.83-5.736-2.09L15.5 5.518a.5.5 0 0 0-.5-.5zm0 2.628c2.354 2.453 2.222 4.569 2.389 6.747-.54-.301-1.126-.561-1.813-.655-.855-.116-1.826.051-2.965.653.167-2.178.036-4.292 2.389-6.745zm-1.46.34c-1.763 2.411-1.783 4.63-1.948 6.534-.775-.46-1.572-.806-2.422-.832-.73-.023-1.468.24-2.203.64.486-2.176 1.274-3.755 2.43-4.705 1.096-.902 2.542-1.345 4.142-1.637zm2.92 0c1.601.292 3.047.735 4.144 1.637 1.155.95 1.943 2.529 2.43 4.705-.736-.4-1.475-.663-2.204-.64-.85.026-1.647.371-2.422.832-.165-1.904-.185-4.123-1.947-6.534zM15.002 6.85 15 5.518" color="#000" style="-inkscape-stroke:none"/>
            </svg>
            <span>{{ weather.graphs.pop.data[0] }}%</span>
          </td>
          <td>
            <i class="wi-thermometer"></i>
            <span>{{ weather.graphs.temperature.data[0] }}°</span>
          </td>
          <td>
            <i class="wi-wind" :class="'wi-rotate-' + Math.round(weather.graphs.windDirection.data[0])"></i>
            <span>{{ getBeaufort(weather.graphs.windSpeed.data[0]) }}</span>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
  <scroll-down />
</template>

<script>
// import { LocalDateTime, DateTimeFormatter } from '@js-joda/core'
import { mapState } from 'vuex'
import scrollDown from './scrollDown.vue'

import toBeaufort from '@/composables/toBeaufort'

export default {
  components: {
    scrollDown
  },
  computed: {
    ...mapState({
      weather: state => state.weather
    })
  },
  methods: {
    getBeaufort (speed) {
      return toBeaufort(speed)
    }
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
