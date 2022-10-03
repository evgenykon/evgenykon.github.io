<template>
  <Layout>
<section class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h1 class="title">
                        {{$page.CvDoc.title}}
                    </h1>
                    <p class="subtitle" v-on:click="onPositionClick" v-if="!flagShowPositionList">
                        {{$page.CvDoc.position}}
                    </p>
                    <p class="subtitle select" v-else>
                        <select v-model="selectedPosition" v-on="onPositionChange()">
                          <option v-for="item in positions" v-bind:value="item">{{item.position}}</option>
                        </select>
                    </p>
                    <div class="block">
                        {{$page.CvDoc.annotation}}
                    </div>


                    <h2 class="title is-5 mt-5 pt-5">WORK EXPERIENCE</h2>

                    <cv-job v-for="job of $page.CvDoc.jobs" 
                      v-bind:key="job.id"
                      v-bind:title="job.title"
                      v-bind:subtitle="job.role"
                      v-bind:place="job.place"
                      v-bind:dates="job.period"
                      v-bind:description="job.description"
                      v-bind:stack="job.stack"
                    >
                    </cv-job>

                    <h2 class="title is-5">
                      <span class="icon-text">
                        <span class="icon">
                          <g-image alt="Network profile" src="https://www.svgrepo.com/show/374863/education.svg" />
                        </span>
                        <span>EDUCATION</span>
                      </span>
                    </h2>
                    <div class="block">
                      <div class="panel-block">
                          <strong>{{$page.CvDoc.education.name}}</strong>
                      </div>

                      <div class="panel-block">
                        {{$page.CvDoc.education.degree}}
                      </div>

                      <cv-panel-item label="Location">{{$page.CvDoc.education.place}}</cv-panel-item>
                      <cv-panel-item label="Dates">{{$page.CvDoc.education.dates}}</cv-panel-item>
                      
                    </div>                  
    
            </div>

            <!-- Right column -->
            <div class="column is-narrow right-sidebar">
                <div class="card w-thin">
                    <div class="card-content p-2">
                      <div class="media">
                        <div class="container">
                          
                          <cv-photo size="165"></cv-photo>

                        </div>
                      </div>
                  
                      <div class="container">

                        <nav class="panel">
                          
                          <cv-panel-item label="Age">{{$page.CvDoc.age}} y.o.</cv-panel-item>
                          <cv-panel-item label="Location">{{$page.CvDoc.location}}</cv-panel-item>
                          <cv-panel-item label="Email">{{$page.CvDoc.email}}</cv-panel-item>

                          <a class="panel-block not-print" v-bind:href="$page.CvDoc.pdf">
                              <span class="panel-icon">
                                <g-image alt="Download CV" src="https://www.svgrepo.com/show/28209/pdf.svg" width="30" />
                              </span>
                              Download CV
                          </a>

                        </nav>

                        <nav class="panel">
                          <div class="panel-block">
                            <strong>My top skills</strong>
                          </div>


                          <div class="panel-block container p-0" v-for="skill of $page.CvDoc.skills">
                            <div class="column py-1">
                              {{skill.name}}
                            </div>
                            <div class="column py-1">
                              <cv-stars v-bind:count="skill.rate"></cv-stars>
                            </div>
                          </div>
                        </nav>

                        <nav class="panel">
                          <div class="panel-block">
                            <strong>Social</strong>
                          </div>
                          <a class="panel-block not-print" v-for="item of $page.CvDoc.socialLinks" v-bind:href="item.url">
                              <span class="panel-icon">
                                <g-image alt="Network profile" v-bind:src="item.img" width="30" />
                              </span>
                              {{item.id}}
                          </a>
                          <div class="panel-block container p-0 print-only" v-for="item of $page.CvDoc.socialLinks">
                            <div class="column py-1">
                              <span class="panel-icon">
                                <g-image alt="Network profile" v-bind:src="item.img" width="30" />
                              </span>
                              {{item.print}}
                            </div>
                          </div>
                          
                        </nav>

                        <nav class="panel">
                          <div class="panel-block">
                            <strong>Achivements</strong>
                          </div>
                          <a class="panel-block" v-for="item of $page.CvDoc.achivements" v-bind:href="item.url">
                            <span class="panel-icon">
                              <g-image alt="achivement" src="https://www.svgrepo.com/show/382123/achivement.svg" width="30" />
                            </span>
                            {{item.name}}
                            <span class="tag achive-date ml-1">{{item.date}}</span>
                          </a>
                        </nav>


                      </div>
                    </div>
                </div>



                 
            </div>
        </div>
    
    </div></section>
    
  </Layout>
</template>

<script>
import CvPhoto from '~/components/cv/CvPhoto.vue'
import CvStars from '~/components/cv/CvStars.vue'
import CvJob from '~/components/cv/CvJob.vue'
import CvPanelItem from '~/components/cv/CvPanelItem.vue'

export default {
  metaInfo: {
    title: 'Evgeny Kon CV'
  },
  components: {
    CvPhoto,
    CvStars,
    CvJob,
    CvPanelItem
  },
  data() {
    return {
      flagShowPositionList: false,
      selectedPosition: null,
      positions: []
    }
  },
  methods: {
    onPositionClick() {
      this.selectedPosition = this.$page.Positions.edges.filter(item => item.node.position === this.$page.CvDoc.position).map(item => item.node)[0];
      this.flagShowPositionList = true;
      this.positions = this.$page.Positions.edges.map(item => item.node);
    },
    onPositionChange() {
      if (this.$route.path !== this.selectedPosition.baseUrl) {
        this.$router.push({path: this.selectedPosition.baseUrl});
      }
    }
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
.cv-job-item .title {
  font-size: 1.2rem;
}
.cv-job-item {
  padding-bottom: 1.4rem;
  padding-left: 0.5rem;
}
.cv-job-item .tag:not(body).is-medium {
  font-size: 0.7rem;
}
.print-only {
  display: none;
}
@media print {
  .right-sidebar {
    max-width: 30%;
  }
  .column, .panel-block {
    font-size: 12px;
  }
  .not-print {
    display: none;
  }
  .print-only {
    display: block;
  }
  .is-size-5 {
    font-size: 14px;
  }
  .tag:not(body).is-medium {
    font-size: 12px;
  }
  .cv-job-item .column {
    padding: 4px;
  }
  .cv-job-item .tag:not(body).is-primary.is-light {
    padding: 1px 3px;
    text-decoration: underline #ccc;
    color: black;
  }
  .tag:not(body).achive-date {
    font-size: 10px;
  }
  @page {
    padding: 2cm;
    margin: 0;
  }
}

</style>


<page-query>
query {
  CvDoc: docs(path: "/docs/cv/fullstack/") {
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