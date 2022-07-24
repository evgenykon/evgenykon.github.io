<template>

    <div class="starts">
        <span v-for="item of [...Array(this.count).keys()]">{{char}}</span>
    </div>

</template>

<script>
export default {
    name: "CvStars",
    props: {
        count: {
            type: Number,
            default: 5
        },
        char: {
            type: String,
            default: "⭐"
        }
    }
}
</script>