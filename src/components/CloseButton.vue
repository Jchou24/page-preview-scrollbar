<template>
    <div class="CloseButton">
        <span class="material-icons">cancel</span>
    </div>
</template>

<script>
    import { defineComponent } from '@vue/composition-api'

    export default defineComponent({
        name: "CloseButton",
    })
</script>

<style lang="scss" scoped>
    .CloseButton{
        // width: 100%;
        height: 24px;
        border-radius: 15px;

        cursor: pointer;

        &:hover{
            background: grey;
            color: #2c3e50;
        }
    }
</style>
