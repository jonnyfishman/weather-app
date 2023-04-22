import { createStore } from 'vuex'
import getCardinalDirection from '@/composables/getCardinalDirection'

export default createStore({
  state: {
    location: 'Norwich',
    weather: {
      description: [],
      icon: [],
      date: [],
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
          unit: ''
        }
      }
    }

  },
  mutations: {
    addWeather (state, payload) {
      for (let index = 0; index < 8; index++) { // Date functions to seperate component?
        state.weather.description[index] = payload[index].weather.description
        state.weather.icon[index] = payload[index].weather.icon.raw
        state.weather.date[index] =
              ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][payload[index].dt.getDay()] + ' ' +
              ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'][payload[index].dt.getDate()] + ' ' +
              ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][payload[index].dt.getMonth()]
        state.weather.time[index] = String(payload[index].dt.getHours()).padStart(2, '0') + ':00'
        state.weather.graphs.temperature.data[index] = payload[index].weather.temp.cur.toFixed(1)
        state.weather.graphs.windChill.data[index] = payload[index].weather.feelsLike.cur.toFixed(1)
        state.weather.graphs.pop.data[index] = String(Math.floor(payload[index].weather.pop * 100))
        state.weather.graphs.pressure.data[index] = String(payload[index].weather.pressure)
        state.weather.graphs.windSpeed.data[index] = payload[index].weather.wind.speed.toFixed(1)
        state.weather.graphs.gustSpeed.data[index] = payload[index].weather.wind.gust.toFixed(1)
        state.weather.graphs.windDirection.data[index] = getCardinalDirection(payload[index].weather.wind.deg)
      }
    },
    addLocation (state, payload) {
      state.location = payload
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
