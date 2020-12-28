<template>
    <div class="PagePreviewScrollbar" :style="GetStyle" :class="GetClass" data-html2canvas-ignore
        @mouseenter="HandleMouseEnter"
        @mouseleave="HandleMouseLeave"
        >
        <SimpleTransition enterAnimation="animate__fadeInRight" leaveAnimation="animate__fadeOutRight" >
            <div class="scroll-bar" v-show="isActive">
                <div class="top-block" />

                <Previewer class="Previewer"
                    :previewerId="previewerId"
                    targetElement="html"
                    ref="Previewer"
                    />

                <PreviewScroller class="preview-scroller" :throttle="throttle" ref="PreviewScroller" />

                <CloseButton class="close-btn-top" @click.native="HandleClose" />
                <!-- <CloseButton class="close-btn-bottom" @click.native="HandleClose" /> -->
            </div>
        </SimpleTransition>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api'

    import CloseButton from './CloseButton.vue'
    import SimpleTransition from './SimpleTransition.vue'
    import Previewer from './Previewer.vue'
    import PreviewScroller from './PreviewScroller.vue'

    import $ from 'jquery'
    import ResizeObserver from 'resize-observer-polyfill'
    import { IPagePreviewScrollbarMethods } from '@/types'
    import throttle from 'lodash.throttle'
    import { useWindowSize } from '@u3u/vue-hooks'

    export default defineComponent({
        name: 'PagePreviewScrollbar',
        props:{
            isHideShorterHeight:{
                type: Boolean,
                default: true
            },
            persist:{
                type: Boolean,
                default: true
            },
            previewerId:{
                type: String,
                default: "Previewer"
            },
            // targetElement:{
            //     type: String,
            //     default: "html"
            // },
            throttle:{
                type: Number,
                default: 25,
            },
            zIndex:{
                type: Number,
                default: 100,
            },
        },
        components:{
            CloseButton,
            SimpleTransition,
            Previewer,
            PreviewScroller,
        },
        setup( props, { refs } ){
            const { width, height } = useWindowSize()

            const isActive = ref(props.persist)
            const isHover = ref(false)

            const GetStyle = computed( () => `z-index: ${props.zIndex};`)

            const GetClass = computed( () => ({
                active: isHover.value,
            }))

            const Reset = throttle( () => {
                (refs.Previewer as IPagePreviewScrollbarMethods)?.Reset();
                (refs.PreviewScroller as IPagePreviewScrollbarMethods)?.Reset();

            }, props.throttle )


            // =================================================================
            // handle height change        
            const containerHeight = ref(0)
            const SetContainerHeight = () => containerHeight.value = $("html").height() || 0

            function ShouldActive(){
                SetContainerHeight()
                if (!props.isHideShorterHeight) {
                    Reset()
                    return true
                }

                if (containerHeight.value <= height.value * 1.5) {
                    return false
                }else{
                    Reset()
                    return true
                }
            }

            function HandleHeightChange() {
                // console.log("height change")
                // console.log(ShouldActive()) 
                isActive.value = ShouldActive()
            }

            onMounted( () => {
                const resizeObserver = new ResizeObserver(HandleHeightChange);
                const target = document.querySelector('html')
                if (!target) {
                    return
                }
                resizeObserver.observe(target)
            })
            watch( height, HandleHeightChange)
            // =================================================================
            watch( () => props.persist, () => isActive.value = props.persist )
            watch( () => props.isHideShorterHeight, HandleHeightChange )
            // =================================================================
            function HandleMouseEnter(){
                isHover.value = true

                if (!ShouldActive()) {
                    return
                }
                isActive.value = true
            }

            function HandleMouseLeave(){
                isHover.value = false

                if (!ShouldActive()) {
                    return
                }
                
                if (props.persist) {
                    return
                }

                isActive.value = false
            }

            function HandleClose() {
                isActive.value = false
            }            
            // =================================================================
            onMounted( () => {
                Reset()

                $(window).on('scroll', Reset)
                // document.addEventListener('scroll', Reset)
            })

            onBeforeUnmount( () => {
                // document.removeEventListener('scroll', Reset)
            })

            watch( width, () => {
                Reset()
            })            

            return {
                isActive,
                GetStyle,
                GetClass,
                Reset,
                HandleMouseEnter,
                HandleMouseLeave,
                HandleClose,
            }
        }        
    })
</script>

<style lang="scss" scoped>
    .PagePreviewScrollbar{
        position: fixed;
        right: 0;
        top: 0;
        width: 200px;
        height: 100vh;

        &.active{
            opacity: 1.0;
            background: white;
        }

        .scroll-bar{
            position: relative;
            border-left: 3px solid whitesmoke;
            opacity: 0.6;

            width: 100%;
            height: 100%;

            .close-btn-top{
                position: absolute;
                top: 5px;
                right: 5px;
            }

            .close-btn-bottom{
                position: absolute;
                bottom: 10px;
                right: 0;
            }

            .preview-scroller{
                position: absolute;
                top: 0;
                left: 0;

                width: 100%;
                height: 100%;

            }
        }        
    }
</style>