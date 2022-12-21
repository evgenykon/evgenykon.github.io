<template>
  <Layout>
    <div class="container">

      <nav-bar />

      <div class="container">

        <!-- div class="notification is-primary">
          Site was created using <a href="https://gridsome.org">Gridsome</a> + <a href="https://vuejs.org">Vuejs</a> + <a href="https://bulma.io/">Bulma.io</a> in one night.
        </div -->

     <section class="hero is-primary px-3">
        <div class="hero-body pl-0 py-2">
          <div class="container-fluid">

            <div class="columns">
              <div class="column" style="font-family: 'Courier New', Courier, monospace;">
                <p v-for="text in $page.MainDoc.TopBanner">{{text}}</p>
              </div>
            </div>

          </div>
          
        </div>
      </section>

<div class="content mt-5 ml-2">
<h3>{{$page.MainDoc.title}}</h3>

<blog-item v-for="post of $page.blogPosts.edges" :key="post.node.id" :title="post.node.title" :date="post.node.date">
  <div v-html="post.node.content"></div>
</blog-item>

</div>

    </div>
      <div class="container mt-4">
        <div class="notification">
          {{$page.MainDoc.Bottom}}
        </div>
      </div>
      
    </div>

  </Layout>
</template>

<script>
import BlogItem from '../components/blog/BlogItem.vue';
import NavBar from "../components/blog/NavBar.vue";
export default {
  metaInfo: {
    title: 'Evgeny Kon Github Page'
  },
  components: {
    BlogItem, NavBar
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
  },
  MainDoc: docs(path: "/docs/main/") {
    title
    TopBanner
    Bottom
  }
}
</page-query>