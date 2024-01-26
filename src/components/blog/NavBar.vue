<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <g-image alt="Example image" src="~/images/evgeny-kon-500x500.jpg" width="30" />
      </b-navbar-item>
    </template>
    <template #start>
      <g-link to="/experience/" class="navbar-item">My experience 👨‍💻</g-link>
      <b-navbar-dropdown label="Pet Projects 👾">
        <b-navbar-item href="https://github.com/evgenykon/ffmpeg-ui">
          FFMPEG UI
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/team-builder">
          Team Builder
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/sandbox">
          Sandbox
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/my-browser-game">
          My First Browser Game
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/corporate-game">
          Game for team buildings
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/quinto-circle">
          CSS Quinto circle
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/wall-area-calculator">
          Wall Area Calculator
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/nukeopp">
          Nuclear Opposition
        </b-navbar-item>
        <b-navbar-item href="https://evgenykon.github.io/english-grammar-trainer/">
          English Grammar Trainer
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/sound-mixer">
          Sound Mixer Repo
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/mma-prediction">
          MMA Prediction
        </b-navbar-item>
        <b-navbar-item href="https://evgenykon.github.io/interview-trainer">
          Interview Trainer
        </b-navbar-item>
        <b-navbar-item href="/demos/allow-list">
          AllowList site checker
        </b-navbar-item>
        <b-navbar-item href="https://github.com/evgenykon/game-helper">
          Game Helper
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <template #end>
      <b-navbar-item href="https://github.com/evgenykon">
        Github
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: "NavBar"
}
</script>

<style scoped>

</style>