<template>
  <Layout>
<section class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h1 class="title">
                        {{$page.CvDoc.title}}
                    </h1>
                    <p class="subtitle">
                        {{$page.CvDoc.position}}
                    </p>
                    <div class="block">
                        {{$page.CvDoc.annotation}}
                    </div>
                    <h2 class="title is-5">WORK EXPERIENCE</h2>

                    <cv-job v-for="job of $page.exJobs.edges" 
                      v-bind:key="job.node.id"
                      v-bind:title="job.node.title"
                      v-bind:subtitle="job.node.role"
                      v-bind:place="job.node.place"
                      v-bind:dates="job.node.period"
                    >
                      <div v-html="job.node.content"></div>
                    </cv-job>
                  
    
            </div>

            <!-- Right column -->
            <div class="column is-narrow">
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

                          <a class="panel-block" v-bind:href="$page.CvDoc.pdf">
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
                          <a class="panel-block" v-for="item of $page.CvDoc.socialLinks" v-bind:href="item.url">
                              <span class="panel-icon">
                                <g-image alt="Network profile" v-bind:src="item.img" width="30" />
                              </span>
                              {{item.id}}
                          </a>
                        </nav>


                        <nav class="panel">
                          <div class="panel-block">
                            <strong>Education</strong>
                          </div>
                          <div class="panel-block">
                            <span class="panel-icon">
                                <g-image alt="Network profile" src="https://www.svgrepo.com/show/374863/education.svg" width="30" />
                            </span>
                              <strong>{{$page.CvDoc.education.name}}</strong>
                          </div>

                          <div class="panel-block">
                            {{$page.CvDoc.education.degree}}
                          </div>

                          <cv-panel-item label="Location">{{$page.CvDoc.education.place}}</cv-panel-item>
                          <cv-panel-item label="Dates">{{$page.CvDoc.education.dates}}</cv-panel-item>

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
                            <span class="tag ml-1">{{item.date}}</span>
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
  CvDoc: docs(path: "/docs/cv/") {
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
    }
  }
  exJobs: allDocs(filter: {type: {eq: "lastjob"}} sort: {by: "order", order: ASC}) {
    edges {
      node {
        id
        title
        role
        place
        period
        content
      }
    }
  }
}
</page-query>