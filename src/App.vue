<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>New World</h2>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="mr-4" icon v-if="!$vuetify.theme.dark" @click="handledarkmode">
        <v-icon color="white">mdi-lightbulb</v-icon>
      </v-btn>
      <v-btn class="mr-4" icon v-if="$vuetify.theme.dark" @click="handledarkmode">
        <v-icon color="yellow darken-3">mdi-lightbulb-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      darkmode: false
    }
  },
  created () {
    if (localStorage.getItem('DarkMode')) {
      const cookieValue = localStorage.getItem('DarkMode') === 'true';
      this.darkmode = cookieValue;
      this.$vuetify.theme.dark = cookieValue
    } else {
      this.handledarkmode();
    }
  },
  methods: {
    handledarkmode () {
      if (this.darkmode === true) {
        this.$vuetify.theme.dark = false
        localStorage.setItem('DarkMode', false);
        this.darkmode = false
      } else if (this.darkmode === false) {
        this.$vuetify.theme.dark = true
        localStorage.setItem('DarkMode', true)
        this.darkmode = true;
      }
    }
  }
};
</script>
<style lang="scss">
.switch-center {
  display: flex;
  justify-content: center;
}
</style>
