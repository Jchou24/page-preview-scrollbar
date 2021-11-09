<template>
    <div class="PagePreviewScrollbar" :style="GetStyle" :class="GetClass"
        @mouseenter="HandleMouseEnter"
        @mouseleave="HandleMouseLeave"
        >
        <SimpleTransition enterAnimation="animate__fadeInRight" leaveAnimation="animate__fadeOutRight" >
            <div class="page-preview-scroll-bar" v-show="isActive">
                <div class="top-block" />

                <Previewer class="Previewer" containerClass="PagePreviewScrollbar"
                    :previewerId="previewerId"
                    :elementToRmoveSelectors="elementToRmoveSelectors"

                    @repainted="emit('repainted')"
                    ref="Previewer"
                    />

                <PreviewScroller class="preview-scroller" containerClass="PagePreviewScrollbar"
                    :throttle="throttle" 
                    :targetSelector="targetSelector"
                    ref="PreviewScroller" />

                <CloseButton class="close-btn-top" @click.native="HandleClose" v-if="isShowCloseButton" />
                <!-- <CloseButton class="close-btn-bottom" @click.native="HandleClose" /> -->
            </div>
        </SimpleTransition>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, nextTick, onMounted, ref, watch } from '@vue/composition-api'

    import CloseButton from './CloseButton.vue'
    import SimpleTransition from './SimpleTransition.vue'
    import Previewer from './Previewer.vue'
    import PreviewScroller from './PreviewScroller.vue'

    import $ from 'jquery'
    import ResizeObserver from 'resize-observer-polyfill'
    import { IPagePreviewScrollbarMethods } from '@/types'
    import throttle from 'lodash.throttle'
    import debounce from 'lodash.debounce'
    import { useWindowSize } from '@u3u/vue-hooks'

    export default defineComponent({
        name: 'PagePreviewScrollbar',
        props:{
            isHideShorterHeight:{
                type: Boolean,
                default: true
            },
            isShowCloseButton:{
                type: Boolean,
                default: true
            },
            isAutoOpacity:{
                type: Boolean,
                default: true
            },
            isResizeAutoRepaint:{
                type: Boolean,
                default: false
            },
            persist:{
                type: Boolean,
                default: true
            },
            zIndex:{
                type: Number,
                default: 100,
            },
            disableRepaint:{
                type: Boolean,
                default: false
            },

            previewerId:{
                type: String,
                default: "Previewer"
            },
            targetSelector:{
                type: String,
                default: "html"
            },
            throttle:{
                type: Number,
                default: 25,
            },
            debounceRepaint:{
                type: Number,
                default: 300,
            },
            elementToRmoveSelectors:{
                type: Array as () => Array<string>,
                default: () => [],
            },         
        },
        components:{
            CloseButton,
            SimpleTransition,
            Previewer,
            PreviewScroller,
        },
        setup( props, { emit, refs } ){
            const { width, height } = useWindowSize()

            const isActive = ref(props.persist)
            const isHover = ref(false)

            const GetStyle = computed( () => `z-index: ${props.zIndex};`)
            const GetClass = computed( () => ({
                active: props.isAutoOpacity ?
                    isActive.value === false ? false : isHover.value
                    : true
            }))

            const ResetPreviewer = () => {
                // console.log( "ResetPreviewer" )
                if (props.disableRepaint) {
                    return
                }
                (refs.Previewer as IPagePreviewScrollbarMethods)?.Reset();
            }
            const ResetPreviewScroller = () => {
                (refs.PreviewScroller as IPagePreviewScrollbarMethods)?.Reset();
            }

            const DebounceResetPreviewer = debounce( ResetPreviewer, props.debounceRepaint )
            const ThrottleResetPreviewScroller = throttle( ResetPreviewScroller, props.throttle )


            const Reset = () => {
                // console.log("reset")
                DebounceResetPreviewer()
                ThrottleResetPreviewScroller()
                // ResetPreviewer()
                // ResetPreviewScroller()
            }

            watch( isActive, () => {
                if (isActive.value) {
                    emit("active")
                } else {
                    emit("inactive")                    
                }
            })
            // =================================================================
            // handle height change        
            const containerHeight = ref(0)
            const SetContainerHeight = () => containerHeight.value = $(props.targetSelector).height() || 0
            // =================================================================

            function ShouldActive(){
                SetContainerHeight()
                if (!props.isHideShorterHeight) {
                    return true
                }

                if (containerHeight.value <= height.value * 1.5) {
                    return false
                }else{
                    return true
                }
            }

            const isUpdated = ref(false)
            function HandleResize() {
                if(!props.isResizeAutoRepaint){
                    return
                }
                // console.log("Resize change", isUpdated.value)
                // console.log(ShouldActive())

                if (!isUpdated.value) {
                    isUpdated.value = true
                    return
                }
                // console.log("HandleResize call reset")
                Reset()
                isActive.value = ShouldActive()
            }

            function InitResizeObserver() {
                // console.log( "init InitResizeObserver" )
                const resizeObserver = new ResizeObserver(debounce(HandleResize, props.debounceRepaint));
                const target = document.querySelector(props.targetSelector)
                if (!target) {
                    return
                }
                resizeObserver.observe(target)
            }

            onMounted( () => {
                ResetPreviewScroller()
                InitResizeObserver()

                // nextTick(Reset)
                // nextTick(InitResizeObserver)

                $(window).on('scroll', ThrottleResetPreviewScroller )
            })
            // =================================================================
            watch( () => props.persist, () => isActive.value = props.persist )
            watch( () => props.isHideShorterHeight, HandleResize )
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

            return {
                isActive,
                emit,
                GetStyle,
                GetClass,
                Reset,
                ResetScroller: ResetPreviewScroller,
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

        &.active .page-preview-scroll-bar{
            opacity: 1.0;
        }

        .page-preview-scroll-bar{
            position: relative;
            border-left: 3px solid whitesmoke;
            opacity: 0.6;
            transition: opacity 0.3s;

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