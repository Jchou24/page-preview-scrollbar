<template>
    <v-app>
        <GitHubCorner repo="https://github.com/Jchou24/page-preview-scrollbar" position="left" />

        <div class="head" />

        <v-card class="tool-bar pb-4" elevation="6">
            <v-card-title class="text-center text-h5">
                Scrollbar Settings
            </v-card-title>

            <v-divider />

            <v-card-text class="pb-0">
                <v-container>
                    <v-row class="mb-6">
                        <v-btn block rounded @click="AddIcon">
                            Add Vue Icon
                        </v-btn>
                        <v-btn block rounded @click="RemoveIcon">
                            Remove Vue Icon
                        </v-btn>
                        <v-btn block rounded @click="ResetScrollbar">
                            Update scrollbar
                        </v-btn>
                    </v-row>

                    <v-row class="mb-6">
                        <v-btn block rounded :color="GetColor(isHideShorterHeight)" @click="isHideShorterHeight = !isHideShorterHeight">
                            Toggle isHideShorterHeight <v-spacer /> {{isHideShorterHeight}}
                        </v-btn>
                        <v-btn block rounded :color="GetColor(isShowCloseButton)" @click="isShowCloseButton = !isShowCloseButton">
                            Toggle isShowCloseButton <v-spacer /> {{isShowCloseButton}}
                        </v-btn>
                        <v-btn block rounded :color="GetColor(persist)" @click="persist = !persist">
                            Toggle persist <v-spacer /> {{persist}}
                        </v-btn>
                        <v-btn block rounded :color="GetColor(isAutoOpacity)" @click="isAutoOpacity = !isAutoOpacity">
                            Toggle isAutoOpacity <v-spacer /> {{isAutoOpacity}}
                        </v-btn>
                        <v-btn block rounded :color="GetColor(isRepaintAnimation)" @click="isRepaintAnimation = !isRepaintAnimation">
                            Toggle repaintAnimation <v-spacer /> {{isRepaintAnimation}}
                        </v-btn>
                        <v-btn block rounded :color="GetColor(isResizeAutoRepaint)" @click="isResizeAutoRepaint = !isResizeAutoRepaint">
                            Toggle isResizeAutoRepaint <v-spacer /> {{isResizeAutoRepaint}}
                        </v-btn>
                        <v-btn block rounded :color="GetColor(disableRepaint)" @click="disableRepaint = !disableRepaint">
                            Toggle disableRepaint <v-spacer /> {{disableRepaint}}
                        </v-btn>
                        <v-btn block rounded :color="GetColor(isShowBrowserScrollbar)" @click="isShowBrowserScrollbar = !isShowBrowserScrollbar">
                            Toggle isShowBrowserScrollbar <v-spacer /> {{isShowBrowserScrollbar}}
                        </v-btn>
                    </v-row>

                    <!-- ---------------------------------------------------------------------------------------- -->
                    <v-row class="mb-5">
                        <v-divider class="" />
                    </v-row>

                    <v-row class="mb-6 text-h6 text-center">
                        Paint specific target
                    </v-row>

                    <v-row class="mb-5">
                        <v-btn class="px-8" rounded :color="GetColor2(targetSelector === 'html')" @click="PaintHtml" >
                            html
                        </v-btn>
                        <v-btn class="px-8 mx-3" rounded :color="GetColor2(targetSelector === '#app')" @click="PaintApp" >
                            #app
                        </v-btn>
                        <v-btn class="px-8" rounded :color="GetColor2(targetSelector === '.images')" @click="PaintImage" >
                            .images
                        </v-btn>
                        <v-btn class="px-4" rounded :color="GetColor2(targetSelector === '.images .right')" @click="PaintImageRight" >
                            .images .right
                        </v-btn>
                        <v-btn class="px-4 ml-6" rounded :color="GetColor2(targetSelector === '.images .right-rows')" @click="PaintImageRightRows" >
                            .images .right-rows
                        </v-btn>
                    </v-row>

                    <v-row>
                        <v-text-field class="mx-1"
                            v-model="targetSelector"
                            label="targetSelector"
                            outlined
                            rounded
                            dense
                        />
                    </v-row>
                    <!-- ---------------------------------------------------------------------------------------- -->
                    <v-row class="mb-5">
                        <v-divider class="" />
                    </v-row>

                    <v-row class="mb-6 text-h6 text-center">
                        Adjust scrollbar position, height
                    </v-row>

                    <v-row class="mb-5">
                        <v-btn class="px-8" rounded :color="GetColor2(isScrollbarAlignTop)" @click="isScrollbarAlignTop = true" >
                            Align Top
                        </v-btn>
                        <v-btn class="px-8 mx-3" rounded :color="GetColor2(!isScrollbarAlignTop)" @click="isScrollbarAlignTop = false" >
                            Align Bottom
                        </v-btn>
                    </v-row>

                    <v-row>
                        <v-slider class="mx-2"
                            v-model="scrollbarHeightPercent"
                            :min="0"
                            :man="100"
                            append-icon="mdi-plus-circle-outline"
                            prepend-icon="mdi-minus-circle-outline"
                            @click:append="IncrementScrollbarHeight"
                            @click:prepend="DecrementScrollbarHeight"
                        />
                    </v-row>
                    <!-- ---------------------------------------------------------------------------------------- -->
                </v-container>

            </v-card-text>
        </v-card>


        <div class="images d-flex flex-row" >
            <div class="left">V</div>
            <div class="right d-flex flex-column justify-center">

                <div class="right-vvv">VVV</div>
                <div class="right-rows">
                    <div class="row" v-for="(item, idx) in images"
                        :key="idx" >
                        <img alt="Vue logo" src="./assets/logo.png">
                        <h1> {{idx}} </h1>
                    </div>
                </div>

            </div>
        </div>
        
        <PagePreviewScrollbar class="PagePreviewScrollbar" :style="GetSCrollbarStyle"
            :isShowCloseButton="isShowCloseButton"
            :isHideShorterHeight="isHideShorterHeight"
            :isAutoOpacity="isAutoOpacity"
            :isResizeAutoRepaint="isResizeAutoRepaint"
            :disableRepaint="disableRepaint"
            :persist="persist" 
            :targetSelector="targetSelector"
            :elementToRmoveSelectors="elementToRmoveSelectors"
            :repaintAnimation="isRepaintAnimation"

            @repainted="HandleRepainted"
            @active="HandleActive"
            @inactive="HandleInActive"
            ref="scrollbar" />
    </v-app>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, watch } from '@vue/composition-api'
    
    import GitHubCorner from './GitHubCorner.vue'
    import PagePreviewScrollbar from './components/PagePreviewScrollbar.vue'

    import { IPagePreviewScrollbarMethods } from './types'
    import { useWindowSize } from '@u3u/vue-hooks'
    import debounce from 'lodash.debounce'
    import { provideToast, useToast } from "vue-toastification/composition";
    import "vue-toastification/dist/index.css";

    export default defineComponent({
        name: 'App',
        components: {
            GitHubCorner,
            PagePreviewScrollbar
        },
        setup( props, { refs }){
            provideToast({ 
                toastClassName: "toast-notification",
                transition: "Vue-Toastification__fade",
                draggable: false,
                timeout: 3000
            })
            const toast = useToast()
            const { width, height } = useWindowSize()
            
            const images = ref(new Array(15).fill(0))

            const isShowBrowserScrollbar = ref(false)
            const isHideShorterHeight = ref(true)
            const isShowCloseButton = ref(true)
            const isAutoOpacity = ref(true)
            const isRepaintAnimation = ref(true)
            const isResizeAutoRepaint = ref(false)
            const disableRepaint = ref(false)
            const persist = ref(true)
            const targetSelector = ref("html")
            const elementToRmoveSelectors = ref([] as Array<string>)

            watch( isShowBrowserScrollbar, () => {
                const html = document.querySelector("body")
                if (isShowBrowserScrollbar.value) {
                    html?.classList.add('show-scrollbar')
                }else{
                    html?.classList.remove('show-scrollbar')
                }
            })

            function GetColor(isTrue: boolean){
                return isTrue ? "teal lighten-4" : 'deep-purple lighten-4'
            }

            function GetColor2(isTrue: boolean){
                return isTrue ? "teal lighten-4" : ''
            }

            function ResetScrollbar(){
                (refs.scrollbar as IPagePreviewScrollbarMethods)?.Reset();
            }

            function AddIcon(){
                images.value.push(0)
                ResetScrollbar()
            }

            function RemoveIcon(){
                images.value.pop()
                ResetScrollbar()
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

            function PaintImageRight(){
                targetSelector.value = '.images .right'
            }

            function PaintImageRightRows(){
                targetSelector.value = '.images .right-rows'
            }

            function HandleRepainted(){
                toast.success("Repainted")
            }

            function HandleActive(){
                toast.success("Active")
            }

            function HandleInActive(){
                toast.success("InActive")
            }

            // =================================================================

            const scrollbarHeightPercent = ref(100.0)
            const isScrollbarAlignTop = ref(true)

            const DecrementScrollbarHeight = () => scrollbarHeightPercent.value -= 5
            const IncrementScrollbarHeight = () => scrollbarHeightPercent.value += 5

            const GetSCrollbarStyle = computed( () => ({
                height: `${height.value * (scrollbarHeightPercent.value / 100.0)}px !important`,
                top: `${isScrollbarAlignTop.value ? "0" : "unset"} !important`,
                bottom: `${!isScrollbarAlignTop.value ? "0" : "unset"} !important`,
            }))

            watch( scrollbarHeightPercent, debounce(ResetScrollbar, 300) )

            return {
                isHideShorterHeight,
                isShowCloseButton,
                isShowBrowserScrollbar,
                isAutoOpacity,
                isRepaintAnimation,
                isResizeAutoRepaint,
                disableRepaint,
                isScrollbarAlignTop,
                persist,
                targetSelector,
                elementToRmoveSelectors,
                images,
                scrollbarHeightPercent,
                
                AddIcon,
                RemoveIcon,
                ResetScrollbar,
                GetColor,
                GetColor2,
                
                PaintHtml,
                PaintApp,
                PaintImage,
                PaintImageRight,
                PaintImageRightRows,

                HandleRepainted,
                HandleActive,
                HandleInActive,

                DecrementScrollbarHeight,
                IncrementScrollbarHeight,
                GetSCrollbarStyle,
            }
        }        
    })
</script>

<style lang="scss">
    html{
        overflow-x: initial;
        overflow-y: initial;
    }

    body{
        overflow-x: initial;
        overflow-y: initial;

        &::-webkit-scrollbar
        {
            width: 0px;
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

        &.show-scrollbar::-webkit-scrollbar{
            width: 14px;
        }
    }

    .toast-notification{
        margin-right: 200px;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .head{
        height: 40px;
        width: 100%;
        background: #B2DFDB;
        margin-bottom: 20px;
    }

    .tool-bar{
        position: fixed;
        top: 60px;
        left: 60px;
        width: 400px;
        border-radius: 15px !important;

        .v-card__text{
            max-height: 610px;
            overflow: auto;

            &::-webkit-scrollbar
            {
                width: 10px;
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
        }

        .text-center{
            display: flex;
            justify-content: center;
        }

        .v-btn{
            text-transform: capitalize;
            margin-bottom: 10px;
        }
    }

    .images{
        .left{
            width: 30%;
            background: #B2DFDB;
        }
        .right{
            width: 70%;
            margin: 10px;
            padding: 20px;

            .right-vvv{
                width: 100%;
                background: #B2DFDB;
            }
            .right-rows{
                width: 100%;
            }
        }

        .row{
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
    
            h1{
                margin-left: 50px;
                font-size: 100px;
            }
        }
    }

    .PagePreviewScrollbar{
        bottom: 0px;
        top: unset !important;
    }
</style>
