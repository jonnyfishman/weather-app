<template>
    <div class="header-group" :class="{ edit: editMode }">
        <form @submit.prevent='sendLocation'>
          <fieldset>
            <legend for="location_input">Choose a new location</legend>
            <input  id="location_input"
                    name="location_input"
                    ref="location_input"
                    type="text"
                    @input="loadLocationOptions()"
                    :disabled="!editMode"
                    v-model="location"
                    autocomplete="off"
                    tabindex="0"
            />
            <button tabindex="1" type="submit"></button>
          </fieldset>
          <ul v-show="locationOptions.length && editMode" id="locations" ref="locations">
          <template v-for="(possibleLocation) in locationOptions" :key="possibleLocation.id">
            <li v-if="possibleLocation.error">
              <span class="error">{{ possibleLocation.error }}</span>
            </li>
            <li v-else
              @click="updateLocation(possibleLocation.name, possibleLocation.country)"
            >
              {{possibleLocation.name}} ({{ possibleLocation.country }})
            </li>
          </template>
        </ul>
        </form>

    </div>
</template>

<script>
// use v-model so as one way and then return to parent with emit when complete
import { mapState } from 'vuex'
import { debounce } from 'lodash'

export default {
  data () {
    return {
      prevLocation: '',
      location: '',
      locationOptions: [],
      locationWidth: '50%',
      editMode: false
    }
  },
  computed: {
    ...mapState({
      currentLocation: state => state.location
    })
  },
  created () {
    this.location = this.currentLocation
  },
  methods: {
    loadLocationOptions: debounce(async function () {
      if (this.location.length < 2) return

      const response = await fetch(
        `https://cities.jonsalmon.info?name=${this.location}`
      )
      this.updateLocationOptions(response)
    }, 150),
    async updateLocationOptions (response) {
      if (response.status === 200) {
        const { data } = await response.json()
        this.locationOptions = data
      } else {
        this.locationOptions = [{ error: 'No city found' }]
      }
    },
    updateLocation (name, country) {
      this.location = `${name}, ${country}`
      this.sendLocation()
    },
    async sendLocation () {
      this.locationOptions = []

      if (!this.editMode) { // editMode is false
        this.editMode = true
        this.prevLocation = this.location
        await this.$nextTick()
        this.$refs.location_input.value = null
        this.$refs.location_input.focus()
      } else { // editMode is true
        this.editMode = false
        if (this.location !== 0) this.$store.dispatch('updateLocation', this.location)
      }
    },
    async onKeyDown (event) {
      // console.log(event.keyCode)
      if (event.keyCode === 27) { // Check if escape key was pressed
        this.$refs.location_input.value = null
        this.editMode = false
        this.location = this.prevLocation
      }
    },
    touchEvent (event) {
      if (!document.querySelector('form').contains(event.target)) {
        this.editMode = false
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('mousedown', this.touchEvent)
    document.addEventListener('touchstart', this.touchStart)
  },
  beforeUnmount () {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('mousedown', this.touchEvent)
    document.removeEventListener('touchstart', this.touchStart)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
