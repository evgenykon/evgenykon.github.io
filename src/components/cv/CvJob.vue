<template>

    <div class="cv-job-item block">
        <div class="columns">
            <div class="content column is-one-quarter mb-0 py-1">
                <h3 class="title">
                    {{title}}
                </h3>
                <p class="subtitle is-6">{{subtitle}}</p>
            </div>
            <div class="column is-one-quarter py-1">{{place}} | {{dates}}</div>
            <div class="content column auto  py-1">
                {{description}}
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <span class="tag is-primary is-medium mr-1 mb-1 is-light" v-for="item in stack">{{item}}</span>
            </div>
        </div>
        
    </div>

</template>

<script>
export default {
    name: "CvJob",
    props: {
        title: {
            type: String,
            default: "title"
        },
        subtitle: {
            type: String,
            default: "subtitle"
        },
        place: {
            type: String,
            default: "place"
        },
        dates: {
            type: String,
            default: "date period"
        },
        description: {
            type: String,
            default: "description"
        },
        stack: {
            type: Array,
            default: () => []
        }
    }
}

</script>