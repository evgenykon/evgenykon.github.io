<template>

    <div class="block columns">
        <div class="content column is-one-quarter">
            <h3 class="title is-size-5">
                {{title}}
            </h3>
            <p class="subtitle is-6">{{subtitle}}</p>
        </div>
        <div class="column is-one-quarter">{{place}} | {{dates}}</div>
        <div class="content column auto">
            <slot />
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
        }
    }
}

</script>