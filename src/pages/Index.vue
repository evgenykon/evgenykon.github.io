<template>
  <Layout>


    <div class="container">

   <b-navbar>
        <template #brand>
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
              <g-image alt="Example image" src="~/images/evgeny-kon-500x500.jpg" width="30" />
          </b-navbar-item>
        </template>
        <template #start>
            <g-link to="/experience/" class="navbar-item">Experience</g-link>
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
            </b-navbar-dropdown>
        </template>

    </b-navbar>

      <div class="notification is-primary">
        Site was created using <a href="https://gridsome.org">Gridsome</a> + <a href="https://vuejs.org">Vuejs</a> + <a href="https://bulma.io/">Bulma.io</a> by one night.
      </div>

      <div class="columns">
        <div class="column is-2">
          <figure class="image is-128x128 container">
            <img src="https://www.svgrepo.com/show/420629/device-embedded-embedding.svg">
          </figure>
        </div>
        <div class="column"><pre>Blog will be later ...</pre></div>
      </div>
      
    </div>

  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'Evgeny Kon Github Page'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
