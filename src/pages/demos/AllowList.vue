<template>
  <Layout>

    <div class="container">

      <nav-bar />

      <div class="container">

        <section class="section p-0 pt-5">
          <h1 class="title">AllowList site checker</h1>
        </section>

        <section class="section p-0 pt-2">
          <textarea class="textarea"
                    placeholder="list of URLs, one line is one URL to check"
                    v-model="list"
          ></textarea>

        </section>

        <section class="section p-0 pt-2">
          <button class="button mr-1" v-on:click="setDemoList">Demo list</button>
          <button class="button is-primary" v-on:click="runTests">Run test</button>
        </section>

        <section class="section p-0 pt-4">

          <div class="columns box p-2" v-for="item in this.results">
            <div class="column is-three-quarters">
              {{item.url}}
            </div>
            <div class="column has-text-right">
              {{item.status}}
            </div>
          </div>

        </section>

      </div>

    </div>

  </Layout>
</template>

<script>
import BlogItem from '../../components/blog/BlogItem.vue';
import NavBar from "../../components/blog/NavBar.vue";
export default {
  metaInfo: {
    title: 'Evgeny Kon Github Page'
  },
  components: {
    NavBar,
    BlogItem
  },
  data() {
    return {
      list: '',
      results: []
    }
  },
  methods: {
    setDemoList() {
      this.list = `https://bulma.io/
https://www.google.com/
https://not-existed-site.ddd/
https://www.google.com/404`;
    },
    parseList() {
      this.results = this.list.split('\n').map(item => item.trim()).map(item => Object.assign({}, {
        url:item,
        status: 'testing...'
      }))
    },
    async runTests() {
      this.parseList();
      for (let i in this.results) {
        if (!this.results.hasOwnProperty(i)) {
          continue;
        }
        try {
          await this.testUrl(this.results[i].url);
          this.results[i].status = 'success'
        } catch (e) {
          this.results[i].status = 'failed'
        }
      }
    },
    testUrl(url) {
      console.log('testUrl', url);
      return new Promise((resolve, reject) => {
        const element = document.createElement('link');
        element.href = url;
        const id = 'rel-'+Math.random();
        element.id = id;
        element.rel = 'stylesheet';
        element.onerror = (event, err) => {
          console.log('onerror', event, err);
          document.getElementById(id).remove();
          reject();
        }
        element.onabort = (e) => {
          console.log('onabort', e);
          document.getElementById(id).remove();
          reject();
        }
        element.onload = (e) => {
          console.log('onload', e);
          document.getElementById(id).remove();
          resolve();
        }
        setTimeout(() => {
          document.getElementById(id).remove();
          reject();
        }, 5000);
        document.body.appendChild(element);
      });

    }
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
  MainDoc: docs(path: "/docs/main/") {
    title
    TopBanner
    Bottom
  }
}
</page-query>