<template>
  <div class="text-selector">
    <button v-if="!arrowsRight" @click="decrement" :disabled="transitioning" class="arrow up"></button>
      <TransitionGroup name="slide-up" class="text-selector-container" tag="ul" @touchmove.prevent="touchMove" @wheel.prevent="scroll">
        <li v-for="textOption in textOptions" :key="textOption" class="text-selector-item">
          <h3>{{ textOption }}</h3>
        </li>
      </TransitionGroup>
    <button v-if="!arrowsRight" @click="increment" :disabled="transitioning" class="arrow down"></button>
    <div class="arrowsRight" v-if="arrowsRight">
      <button @click="decrement" :disabled="transitioning" class="arrow up"></button>
      <button @click="increment" :disabled="transitioning" class="arrow down"></button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    textArray: {
      type: Array,
      required: true
    },
    arrowsRight: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      textOptions: [],
      transitioning: false,
      currentIndex: 0
    }
  },
  methods: {
    decrement () {
      if (this.transitioning) return

      this.textOptions.unshift(this.textOptions.pop())
      this.currentIndex = (this.currentIndex + this.textOptions.length - 1) % this.textOptions.length
      this.sendSelected()
    },
    increment () {
      if (this.transitioning) return

      this.textOptions.push(this.textOptions.shift())
      this.currentIndex = (this.currentIndex + 1) % this.textOptions.length
      this.sendSelected()
    },
    scroll: debounce(async function (e) {
      e.preventDefault()
      if (e.deltaY < 0) {
        this.decrement()
      } else {
        this.increment()
      }
      this.sendSelected()
    }, 50),
    touchStart (e) {
      this.touchStartY = e.touches[0].clientY
    },
    touchMove: debounce(async function (e) {
      e.preventDefault()
      /*
      if (!e.target.classList.contains('text-selector-item')) return
      */
      if (e.touches[0].clientY < this.touchStartY) {
        this.increment()
      } else {
        this.decrement()
      }
      this.sendSelected()
    }, 50),
    beforeEnter () {
      this.transitioning = true // set transitioning to true before the transition starts
    },
    afterEnter () {
      this.transitioning = false // set transitioning to false when the transition ends
    },
    sendSelected () {
      this.$emit('selected', this.currentIndex)
    }
  },
  mounted () {
    this.textOptions = [...this.textArray.slice(-2), ...this.textArray.slice(0, -2)]
    // window.addEventListener('wheel', this.scroll)
    document.querySelector('.text-selector-container').addEventListener('touchstart', this.touchStart)
    // document.querySelector('.text-selector-container').addEventListener('touchmove', this.touchMove)
  },
  beforeUnmount () {
    // window.removeEventListener('wheel', this.scroll)
    document.querySelector('.text-selector-container').removeEventListener('touchstart', this.touchStart)
    // document.querySelector('.text-selector-container').removeEventListener('touchmove', this.touchMove)
  }
}
</script>

<style scoped>
h3 {
  margin:0;
  font-size:100%;
}

.text-selector,
.arrowsRight {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
}
.arrowsRight {
  flex-direction: column;
}

.text-selector-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style:none;
  padding:0;
  margin:0;
  position:relative;
  width: 50vw;
height: 50vw;
}
.text-selector-container:before,
.text-selector-container:after {
  content:'';
  border-bottom:1px solid blue;
  position:absolute;
  width:40vw;
  z-index:100;
  transform:translateY(-1.5em);
}
.text-selector-container:after {
  transform:translateY(1.5em);
}

.text-selector-item {
  font-size:50%;
  width: 100%;
  padding:0;
    z-index: 10;
    transition: all 0.2s;
    text-align:center;
    opacity:0.5;
}
.text-selector-item:nth-child(1) {
  transform:translateY(75%);
  line-height:50%;
}
.text-selector-item:nth-child(5) {
  transform:translateY(-75%);
  line-height: 75%;
}

.text-selector-item:nth-child(2),
.text-selector-item:nth-child(4) {
  padding:0.3em;
  font-size:75%;
  opacity:0.75;
}
.text-selector-item:nth-child(2) {
  transform:translateY(25%);
}
.text-selector-item:nth-child(4) {
  transform:translateY(-25%);
}

.text-selector-item:nth-child(3) {
  padding:0.4em;
  font-size:100%;
  opacity:1;
}

.text-selector-item:nth-child(n+6) {
  height:0;
  overflow:hidden;
  padding:0;
}

.slide-up-move,
.slide-up-enter-active,
.slide-up-leave-active {
}

.slide-up-enter-from,
.slide-up-leave-to {
}

.slide-up-leave-active {
  position: relative;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 10px;
  background:none;
  cursor:pointer;
}

.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
