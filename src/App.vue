<template>
  <weather-location/>
  <current-conditions/>
  <forecast-graphs/>
</template>

<script>
import WeatherLocation from './components/WeatherLocation.vue'
import currentConditions from './components/currentConditions.vue'
import forecastGraphs from './components/forecastGraphs.vue'

export default {
  name: 'App',
  components: {
    WeatherLocation,
    currentConditions,
    forecastGraphs
  },
  data () {
    return {
      defaultLocation: 'Norwich'
    }
  },
  created () {
    this.$store.dispatch('updateLocation', this.defaultLocation)
  }
}
</script>

<style>
</style>
