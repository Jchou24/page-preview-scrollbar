<template>
    <div id="app">
        <div class="head">
            <div class="btns">
                <div>
                    <button @click="AddIcon">
                        Add Vue Icon
                    </button>
                    <button @click="RemoveIcon">
                        Remove Vue Icon
                    </button>
                    <button @click="ResetScrollbar">
                        Update scrollbar
                    </button>
                </div>

                <div>
                    <button @click="isHideShorterHeight = !isHideShorterHeight">
                        Hide / Show when screen height is short
                    </button>
                    <button @click="persist = !persist">
                        Active / Inactive persist
                    </button>
                </div>

                <div>
                    <span>
                        isHideShorterHeight: {{isHideShorterHeight}} |
                    </span>
                    <span>
                        persist: {{persist}}
                    </span>
                </div>
            </div>
        </div>
        <div v-for="(item, idx) in images" class="images"
            :key="idx">
            <div class="row">
                <img alt="Vue logo" src="./assets/logo.png">
                <h1> {{idx}} </h1>
            </div>
        </div>
        
        <PagePreviewScrollbar :isHideShorterHeight="isHideShorterHeight" :persist="persist" ref="scrollbar" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'

    import PagePreviewScrollbar from './components/PagePreviewScrollbar.vue';

    import { IPagePreviewScrollbarMethods } from './types';

    export default defineComponent({
        name: 'App',
        components: {
            PagePreviewScrollbar
        },
        setup( props, { refs }){
            const images = ref(new Array(10).fill(0))
            const AddIcon = () => images.value.push(0)
            const RemoveIcon = () => images.value.pop()

            const isHideShorterHeight = ref(true)
            const persist = ref(true)

            function ResetScrollbar(){
                (refs.scrollbar as IPagePreviewScrollbarMethods)?.Reset();
            }

            return {
                isHideShorterHeight,
                persist,

                images,
                AddIcon,
                RemoveIcon,
                ResetScrollbar,
            }
        }        
    })
</script>

<style lang="scss">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .head{
        position: sticky;
        top: 0;

        .btns{
            width: 100%;
            height: 88px;
            background: #41b883;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            & > div{
                margin: 2px;
            }
        }
    }

    .row{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        h1{
            margin-left: 50px;
            font-size: 100px;
        }
    }
</style>
