<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <g-image alt="Example image" src="~/images/evgeny-kon-500x500-v2.jpeg" width="30" />
      </b-navbar-item>
    </template>
    <template #start>
      <g-link to="/experience/" class="navbar-item">My experience 👨‍💻</g-link>
      <b-navbar-dropdown label="Pet Projects 👾">
        <b-navbar-item href="https://evgenykon.github.io/quinto-circle/">
          Quinto Circle
        </b-navbar-item>
        <b-navbar-item href="https://evgenykon.github.io/three-body-problem/">
          Three Body Problem
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