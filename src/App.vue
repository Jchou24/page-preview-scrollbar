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
                    <button @click="isShowCloseButton = !isShowCloseButton">
                        Hide / Show close button
                    </button>
                    <button @click="persist = !persist">
                        Active / Inactive persist
                    </button>
                    <button @click="isShowBrowserScrollbar = !isShowBrowserScrollbar">
                        Hide / Show browser scrollbar
                    </button>
                </div>

                <div>
                    <span>
                        isHideShorterHeight: {{isHideShorterHeight}} |
                    </span>
                    <span>
                        isShowCloseButton: {{isShowCloseButton}} |
                    </span>
                    <span>
                        persist: {{persist}}
                    </span>
                </div>

                <div>
                    <button @click="PaintHtml" >
                        Paint html
                    </button>
                    <button @click="PaintApp" >
                        Paint #app
                    </button>
                    <button @click="PaintImage" >
                        Paint .images
                    </button>
                    <input v-model="targetSelector">
                </div>
            </div>
        </div>
        <div class="images" >
            <div class="row" v-for="(item, idx) in images"
                :key="idx" >
                <img alt="Vue logo" src="./assets/logo.png">
                <h1> {{idx}} </h1>
            </div>
        </div>
        
        <PagePreviewScrollbar class="PagePreviewScrollbar"
            :isShowCloseButton="isShowCloseButton"
            :isHideShorterHeight="isHideShorterHeight" 
            :persist="persist" 
            :targetSelector="targetSelector"
            :paintOption="option"

            @repainted="HandleRepainted"
            @active="HandleActive"
            @inactive="HandleInActive"
            ref="scrollbar" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from '@vue/composition-api'
    
    import PagePreviewScrollbar from './components/PagePreviewScrollbar.vue'

    import { IPagePreviewScrollbarMethods } from './types'
    import * as htmlToImage from 'html-to-image'

    export default defineComponent({
        name: 'App',
        components: {
            PagePreviewScrollbar
        },
        setup( props, { refs }){
            const option = ref({} as htmlToImage.Options)
            const images = ref(new Array(10).fill(0))
            const AddIcon = () => images.value.push(0)
            const RemoveIcon = () => images.value.pop()

            const isShowBrowserScrollbar = ref(false)
            const isHideShorterHeight = ref(true)
            const isShowCloseButton = ref(true)
            const persist = ref(true)
            const targetSelector = ref("html")

            watch( isShowBrowserScrollbar, () => {
                const html = document.querySelector("body")
                if (isShowBrowserScrollbar.value) {
                    html?.classList.add('show-scrollbar')
                }else{
                    html?.classList.remove('show-scrollbar')
                }
            })

            function ResetScrollbar(){
                (refs.scrollbar as IPagePreviewScrollbarMethods)?.Reset();
            }
            
            function PaintHtml(){
                targetSelector.value = 'html'
            }

            function PaintApp(){
                targetSelector.value = '#app'
            }

            function PaintImage(){
                targetSelector.value = '.images'
            }

            function HandleRepainted() {
                console.log("Repainted")
            }

            function HandleActive() {
                console.log("Active")
            }

            function HandleInActive() {
                console.log("InActive")
            }

            return {
                isHideShorterHeight,
                isShowCloseButton,
                isShowBrowserScrollbar,
                persist,
                targetSelector,
                option,
                images,
                
                AddIcon,
                RemoveIcon,
                ResetScrollbar,
                
                PaintHtml,
                PaintApp,
                PaintImage,

                HandleRepainted,
                HandleActive,
                HandleInActive,
            }
        }        
    })
</script>

<style lang="scss">
    body{
        &::-webkit-scrollbar
        {
            width: 0px;
            height: 0px;
            background-color: #eaeaea;
        }
    
        &::-webkit-scrollbar-thumb
        {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: #d8d8d8;

            &:hover{
                background-color: #ecebeb;
            }
        }

        &.show-scrollbar::-webkit-scrollbar
        {
            width: 14px;
            height: 12px;
        }
    }

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

    .PagePreviewScrollbar{
        bottom: 0px;
        top: unset !important;
        // height: calc( 100vh - 300px ) !important;
    }
</style>
