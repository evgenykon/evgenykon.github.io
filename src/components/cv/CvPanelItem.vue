<template>
<div class="panel-block container p-0">
    <div class="column is-one-third py-1">
        {{label}}
    </div>
    <div class="column py-1">
        <slot />
    </div>
</div>
</template>

<script>
export default {
    name: 'CvPanelItem',
    props: {
        label: {
            type: String
        }
    }
}
</script>