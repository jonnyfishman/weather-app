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
        <ul v-if="locationOptions.length" id="locations" ref="locations">
          <li v-for="(location, index) in locationOptions"
              :tabindex="index + 2"
              @click="updateLocation(location.name, location.country)"
              :key="location.id">
              {{location.name}} ({{ location.country }})
          </li>
        </ul>
      </fieldset>
    </form>
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
      this.locationWidth = Math.ceil(chars + 1 * 1.25) + 'ch'
    },
    updateLocation (name, country) {
      this.location = `${name}, ${country}`
      this.adjustWidth(this.location.length)
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
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    font-family: 'Quicksand', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-top: 60px;
    font-weight:300;
    background-color:#3598db;
    color:#fff;
  }
  .edit:before {
    content:'';
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left:0;
    background:rgba(0,0,0,0.7)
  }
  p{
    font-size:2rem;
  }
  input {
    font-family:inherit;
    border:none;
    outline:none;
    color:inherit;
    font-size:inherit;
    width:fit-content;
    max-width:calc(90% - 2em);
    position:relative;
    background: #3598db;
    padding:0 4rem;
    margin:0;
    border-bottom: 1px solid #fff;
    text-align:center;
    vertical-align: middle;
    text-transform:capitalize;
  }
  input:disabled {
    background:none;
    user-select: none;
    border:none;
    border-bottom:1px solid rgba(0,0,0,0)
  }
  legend {
    display:none;
    position: absolute;
    bottom: calc(-2rem - 15px);
    left: calc(50% - 100px);
    font-size: 1rem;
    background: #e84c3d;
    border-radius: 5px;
    padding: .6em;
    width: 200px;
    text-align: center;
  }
  legend:after {
    content: "";
    width: 0;
    height: 0;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    position: absolute;
    left: calc(50% - 10px);
    border-bottom: 10px solid #e84c3d;
    top: -9px;
    z-index: 999;
  }
  .edit legend {
    display:block;
  }
  button {
    width:3rem;
    height:4rem;
    border:none;
    background: rgba(0,0,0,0) url(../assets/arrow.png) center center no-repeat;
    /*border-bottom: rgba(0,0,0,) solid #fff;*/
    cursor:pointer;
    margin-left:-3.5rem;
    vertical-align: middle;
    position: relative;
  }
  input:disabled ~ button {
    background:url(../assets/edit.png) center center no-repeat;
    border:none;
    border-bottom:1px solid rgba(0,0,0,0);
  }
  fieldset ul {
    display:none;
  }
  .edit fieldset ul {
    list-style:none;
    font-size:1.2rem;
    padding:0.4rem;
    display:flex;
    flex-direction:column;
    padding:0;
    background:#fff;
    color:#222;
    border-top:1px solid #ccc;
    position:absolute;
    left: calc(50% - 200px);
    width: 400px;
  }
  .edit fieldset li {
    border:1px solid #ccc;
    border-top:none;
    cursor:pointer;
    padding:0.4rem 0.6rem;
  }
  .edit fieldset li:hover, .edit fieldset li:focus {
    background: #f1c40f;
  }

  .header-group {
    font-size:3rem;
    position:relative;
    display:flex;
    margin:auto;
  }
  .header-group fieldset, .header-group form {
    margin: auto auto auto auto;
    outline:none;
    border:none;
    padding:0;
  }

  .body-group {
    margin:2em auto;
  }
</style>
