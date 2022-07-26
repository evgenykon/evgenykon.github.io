<template>
<div class="box mb-1 has-background-white-bis">
  <article class="media">
    <div class="media-left">
        
   <small class="tag is-dark">{{format(date)}}</small>
      <figure class="image is-96x96" v-if="img">
        <img :src="img" alt="Image">
      </figure>
      <figure class="image is-96x96" v-else>
        <img src="https://www.svgrepo.com/show/420629/device-embedded-embedding.svg" alt="Image">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p><strong>{{title}}</strong></p>
        <slot />
      </div>
    </div>
  </article>
</div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'BlogItem',
    props: {
        title: {
            type: String,
        },
        date: {
            type: String
        },
        img: {
            type: String
        }
    },
    methods: {
        format(val) {
            return moment(val).format('ll');
        }
    }
}


</script>