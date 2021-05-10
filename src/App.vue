<template>
  <div id="app">
    <router-view />
    <choose-image ref="chooseImage" :max="maxChooseImage"></choose-image>
  </div>
</template>

<script>
import chooseImage from '@/components/image/choose-image'
export default {
  name: 'App',
  provide() {
    return {
      $app: this,
    }
  },
  components: {
    chooseImage,
  },
  data() {
    return {
      maxChooseImage: 9,
    }
  },
  methods: {
    chooseImage(callback, max = 9) {
      this.maxChooseImage = max
      this.$refs.chooseImage.showDialog(callback)
    }
  }
}
</script>
