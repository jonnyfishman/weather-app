<template>
    <div class="arrows" @click="scrollDown" role="button" tabindex="0" aria-label="Scroll Down">
        <div class="arrow" aria-hidden="true"></div>
        <div class="arrow" aria-hidden="true"></div>
        <div class="arrow" aria-hidden="true"></div>
    </div>
</template>

<script>
export default {
  name: 'scrollDown',
  methods: {
    scrollDown () {
      window.scrollBy({
        top: window.innerHeight, // Not working on mobile devices because of taskbar height
        behavior: 'smooth'
      })
    }
  }
}
</script>

  <!-- Add 'scoped' attribute to limit CSS to this component only -->
  <style scoped>
  .arrows {
    position: relative;
    cursor: pointer;
    margin:auto;
    display:flex;
    flex-direction:column;
    align-items:center;

  }

  .arrow {
    display: block;
    width: 5px;
    height: 5px;
    -ms-transform: rotate(45deg); /* IE 9 */
    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
    transform: rotate(45deg);

    border-right: 2px solid var(--txtColor);
    border-bottom: 2px solid var(--txtColor);
    margin: 0 0 3px 4px;

    width: 16px;
    height: 16px;
    -webkit-animation: mouse-scroll 1s infinite;
      -moz-animation: mouse-scroll 1s infinite;
      animation: mouse-scroll 1s infinite;
  }

  .arrow:nth-child(1) {
    -webkit-animation-delay: .1s;
    -moz-animation-delay: .1s;
    -webkit-animation-direction: alternate;

    animation-direction: alternate;
    animation-delay: alternate;
  }

  .arrow:nth-child(2) {
    -webkit-animation-delay: .2s;
    -moz-animation-delay: .2s;
    -webkit-animation-direction: alternate;

    animation-delay: .2s;
    animation-direction: alternate;

    margin-top: -6px;
  }

  .arrow:nth-child(3) {
    -webkit-animation-delay: .3s;
    -moz-animation-delay: .3s;
    -webkit-animation-direction: alternate;

    animation-delay: .3s;
    animation-direction: alternate;

    margin-top: -6px;
  }

  @-webkit-keyframes mouse-scroll {

  0%   { opacity: 0;}
  50%  { opacity: .5;}
  100% { opacity: 1;}
  }
  @-moz-keyframes mouse-scroll {

  0%   { opacity: 0; }
  50%  { opacity: .5; }
  100% { opacity: 1; }
  }
  @-o-keyframes mouse-scroll {

  0%   { opacity: 0; }
  50%  { opacity: .5; }
  100% { opacity: 1; }
  }
  @keyframes mouse-scroll {

  0%   { opacity: 0; }
  50%  { opacity: .5; }
  100% { opacity: 1; }
  }
  </style>
