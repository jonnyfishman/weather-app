<template>
  <weather-location v-model:defaultLocation="location" />
  <open-weather v-model:defaultLocation="location" />
</template>

<script>
import WeatherLocation from './components/WeatherLocation.vue'
import OpenWeather from './components/OpenWeather.vue'

export default {
  name: 'App',
  components: {
    OpenWeather,
    WeatherLocation
  },
  data () {
    return {
      location: 'Norwich'
    }
  }
}
</script>

<style>
</style>
