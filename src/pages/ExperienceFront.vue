
<script>
import Experience from './Experience.vue';

export default {
  extends: Experience,
  metaInfo: {
    title: 'Evgeny Kon CV'
  }
}
</script>

<page-query>
query {
  CvDoc: docs(path: "/docs/cv/frontend/") {
    title
    position
    age
    location
    email
    pdf
    skills {
      name
      rate
    }
    socialLinks {
      id
      url
      img
      print
    }
    education {
      name
      place
      dates
      degree
    }
    achivements {
      name
      date
      url
    },
    jobs {
      title
      role
      place
      period
      description
      stack
    }
  }
  Positions: allDocs(filter: {type: {eq:"cv"}}) {
    edges {
      node {
        id
        path
        position
        baseUrl
      }
    }
  }
}
</page-query>