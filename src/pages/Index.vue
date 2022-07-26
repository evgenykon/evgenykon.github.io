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
            </b-navbar-dropdown>
        </template>

      </b-navbar>

      <div class="container">

        <!-- div class="notification is-primary">
          Site was created using <a href="https://gridsome.org">Gridsome</a> + <a href="https://vuejs.org">Vuejs</a> + <a href="https://bulma.io/">Bulma.io</a> in one night.
        </div -->

     <section class="hero is-primary">
        <div class="hero-body pl-0">
          <div class="container-fluid">

            <div class="columns">
              <div class="column is-2">
                <figure class="image is-128x128 container">
                  <img src="https://www.svgrepo.com/show/420629/device-embedded-embedding.svg">
                </figure>
              </div>
              <div class="column">
                <p class="title">
                  While you were reading this text
                </p>
                <p class="subtitle mb-5 mt-4">
                  I'm committing code to my new pet-project's repository
                </p>
                <p class="is-size-7">But could have done a project for you instead</p>
              </div>
            </div>

          </div>
          
        </div>
      </section>

<div class="content mt-5">
<h3>DevBlog</h3>

<blog-item v-for="post of $page.blogPosts.edges" :key="post.node.id" :title="post.node.title" :date="post.node.date">
  <div v-html="post.node.content"></div>
</blog-item>

</div>


    </div>


      <div class="container mt-4">
        <div class="notification">
          Right now I just want to have my personal page to <a href="/experience/">share my CV</a> and my ideas. 
        </div>
      </div>
      
    </div>

  </Layout>
</template>

<script>
import BlogItem from '../components/blog/BlogItem.vue';
export default {
  metaInfo: {
    title: 'Evgeny Kon Github Page'
  },
  components: {
    BlogItem
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>


<page-query>
query {
  blogPosts: allDocs(filter: {type: {eq: "blog"}} sort: {by: "date", order: DESC}) {
    edges {
      node {
        id
        title
        date
        content
      }
    }
  }
}
</page-query>