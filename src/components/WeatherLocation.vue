<template>
    <div class="header-group" :class="{ edit: editMode }">
      <form @submit.prevent='$emit("update:defaultLocation", this.location)'>
        <fieldset>
          <legend for="location_input">Choose a new location</legend>
          <input  id="location_input"
                  name="location_input"
                  ref="location_input"
                  type="text"
                  @input="adjustWidth($event.target.value.length); loadLocationOptions()"
                  :style="{width: locationWidth}"
                  :disabled="!editMode"
                  v-model="location"
                  autocomplete="off"
                  @keyup.esc="editMode = false"
                  @focusout="clickOutside"
                  tabindex="0"
          />
          <button tabindex="1" type="submit" @click="editMode = !editMode" />

        </fieldset>

      </form>
      <ul v-if="locationOptions.length" id="locations" ref="locations">
        <li v-for="(location, index) in locationOptions"
            :tabindex="index + 2"
            @click="updateLocation(location.name, location.country)"
            :key="location.id">
            {{location.name}} ({{ location.country }})
        </li>
      </ul>
    </div>
</template>

<script>
// use v-model so as one way and then return to parent with emit when complete

export default {
  props: {
    defaultLocation: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      locationOptions: [],
      location: this.defaultLocation,
      locationWidth: this.defaultLocation.length + 2 + 'ch',
      editMode: false
    }
  },
  methods: {
    async loadLocationOptions () {
      const response = await fetch('https://cities.jonsalmon.info?name=' + this.location)
      const data = await response.json()
      this.locationOptions = data.data
    },
    adjustWidth (chars) {
      this.locationWidth = Math.ceil(chars + 2.25) + 'ch'
    },
    updateLocation (name, country) {
      this.location = `${name}, ${country}`
      this.adjustWidth(this.location.replace(' ', '').length)
      this.locationOptions = []
      this.$refs.location_input.focus()
    },
    clickOutside () {
      if (this.$refs.locations) this.$refs.location_input.focus()
      else {
        this.editMode = false
        this.$emit('update:defaultLocation', this.location)
      }
    }
  },
  watch: {
    editMode: function () {
      if (this.editMode === true) {
        this.$nextTick(() => {
          this.$refs.location_input.value = null
          this.$refs.location_input.focus()
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
