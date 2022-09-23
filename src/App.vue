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
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@200;400;600&display=swap');

#app {
  font-family: 'Quicksand', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 30px;
  font-weight:300;
}
body {
  background-color:#3598db;
  color:#FFFBDB;
}
</style>
