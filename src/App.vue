<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>New World</h2>
      </div>
      <v-spacer></v-spacer>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.twitch.tv/electricdragn"
      >
        <v-btn class="mr-4" icon>
          <v-icon color="white">mdi-twitch</v-icon>
        </v-btn>
      </a>
      <v-btn
        class="mr-4"
        icon
        v-if="!$vuetify.theme.dark"
        @click="handleDarkMode"
      >
        <v-icon color="white">mdi-lightbulb</v-icon>
      </v-btn>
      <v-btn
        class="mr-4"
        icon
        v-if="$vuetify.theme.dark"
        @click="handleDarkMode"
      >
        <v-icon color="yellow darken-3">mdi-lightbulb-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div>
        <v-alert
          v-model="alert"
          dismissible
          color="cyan"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-exclamation-thick"
        >
          New changes: End Date now showing on the table
          <template v-slot:close="{}">
            <v-icon @click="closeAlert">mdi-close</v-icon>
          </template>
        </v-alert>
      </div>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      darkMode: false,
      alert: false,
      alertId: "0003",
    };
  },
  created() {
    if (localStorage.getItem("darkMode")) {
      const cookieValue = localStorage.getItem("darkMode") === "true";
      this.darkMode = cookieValue;
      this.$vuetify.theme.dark = cookieValue;
    } else {
      this.handleDarkMode();
    }

    if (
      this.alertId === localStorage.getItem("alertId") &&
      localStorage.getItem("alert")
    ) {
      const cookieValue = localStorage.getItem("alert") === "true";
      this.alert = cookieValue;
      console.log(
        "This banner has already been seen in the past. Alert value:",
        cookieValue
      );
    } else {
      this.showAlert();
    }
  },
  methods: {
    handleDarkMode() {
      if (this.darkMode === true) {
        this.$vuetify.theme.dark = false;
        localStorage.setItem("darkMode", false);
        this.darkMode = false;
      } else if (this.darkMode === false) {
        this.$vuetify.theme.dark = true;
        localStorage.setItem("darkMode", true);
        this.darkMode = true;
      }
    },
    showAlert() {
      localStorage.setItem("alert", true);
      localStorage.setItem("alertId", this.alertId);
      this.alert = true;
    },
    closeAlert() {
      localStorage.setItem("alert", false);
      this.alert = false;
    },
  },
};
</script>
