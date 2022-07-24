<template>
  <Layout>

   <b-navbar>
        <template #brand>
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
              <g-image alt="Example image" src="~/images/evgeny-kon-500x500.jpg" width="30" />
          </b-navbar-item>
        </template>
        <template #start>
            <g-link to="/Experience/" class="navbar-item">Experience</g-link>
            <b-navbar-dropdown label="Pet Projects 👾">
                <!-- b-navbar-item href="#">
                    About
                </b-navbar-item>
                <b-navbar-item href="#">
                    Contact
                </b-navbar-item -->
            </b-navbar-dropdown>
        </template>

    </b-navbar>

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
