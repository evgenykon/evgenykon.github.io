<template>

<figure class="image" >
    <a href="big-pic.jpg" target="_blank">
        <g-image alt="Evgeny Kon" src="~/images/evgeny-kon-500x500-v2.jpeg" :width="size" />
    </a>
</figure>

</template>

<script>
export default {
    name: "CvPhoto",
    props: {
      size: {type: Number}
    }
}
</script>