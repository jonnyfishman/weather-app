import { createStore } from 'vuex'

import OpenWeatherAPI from 'openweather-api-node'
import getCardinalDirection from '@/composables/getCardinalDirection'

const weather = new OpenWeatherAPI({
  key: '1835dad453aa19a5d4dba6d784dc52c3',
  units: 'metric'
})

export default createStore({
  state: {
    location: '',
    weather: {
      description: [],
      icon: [],
      date: [],
      time: [],
      graphs: {
        temperature: {
          title: 'Temperature',
          data: [],
          unit: '°'
        },
        windChill: {
          title: 'Windchill',
          data: [],
          unit: '°'
        },
        pop: {
          title: 'Chance of rain',
          data: [],
          unit: '%'
        },
        pressure: {
          title: 'Pressure',
          data: [],
          unit: 'Pa'
        },
        windSpeed: {
          title: 'Wind Speed',
          data: [],
          unit: ''
        },
        gustSpeed: {
          title: 'Gust Speed',
          data: [],
          unit: ''
        },
        windDirection: {
          title: 'Wind Direction',
          labels: [],
          data: [],
          unit: ''
        }
      }
    }

  },
  mutations: {
    addWeather (state, payload) {
      //
    },
    async addLocation (state, payload) {
      state.location = payload
      state.weather.date = []

      weather.setLocationByName(payload)

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

      for (let index = 0; index < 8; index++) { // Date functions to seperate component?
        state.weather.description[index] = weatherData[index].weather.description
        state.weather.icon[index] = weatherData[index].weather.icon.raw
        state.weather.date[index] =
              ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weatherData[index].dt.getDay()] + ' ' +
              ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'][weatherData[index].dt.getDate()] + ' ' +
              ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][weatherData[index].dt.getMonth()]
        state.weather.time[index] = String(weatherData[index].dt.getHours()).padStart(2, '0') + ':00'
        state.weather.graphs.temperature.data[index] = weatherData[index].weather.temp.cur.toFixed(1)
        state.weather.graphs.windChill.data[index] = weatherData[index].weather.feelsLike.cur.toFixed(1)
        state.weather.graphs.pop.data[index] = String(Math.floor(weatherData[index].weather.pop * 100))
        state.weather.graphs.pressure.data[index] = String(weatherData[index].weather.pressure)
        state.weather.graphs.windSpeed.data[index] = weatherData[index].weather.wind.speed.toFixed(1)
        state.weather.graphs.gustSpeed.data[index] = weatherData[index].weather.wind.gust.toFixed(1)
        state.weather.graphs.windDirection.data[index] = weatherData[index].weather.wind.deg
        state.weather.graphs.windDirection.labels[index] = getCardinalDirection(weatherData[index].weather.wind.deg)
      }

      console.log(state.weather)
    }
  },
  actions: {
    updateWeather (context, payload) {
      context.commit('addWeather', payload)
    },
    updateLocation (context, payload) {
      context.commit('addLocation', payload)
    }
  }
})
