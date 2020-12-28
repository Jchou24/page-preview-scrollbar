<template>
    <div class="PreviewScroller" >
        <div class="mask-top" :style="heightTop" />
        <div class="mask-center" :style="heightCenter" />
        <div class="mask-bottom" :style="heightBottom" />
        <div class="cover" 
            @mousedown.prevent="HandleMouseDown"
            @mouseup.prevent="HandleMouseUp"            
            @mousemove="HandleMouseMove"
        />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
    
    import { useWindowSize } from '@u3u/vue-hooks'

    import $ from 'jquery'
    import throttle from 'lodash.throttle'

    interface MouseMove extends Event{
        clientY: number;
    }

    export default defineComponent({
        name: 'PreviewScroller',
        props:{
            throttle:{
                type: Number,
                default: 25,
            },
        },
        setup( props ){
            const { height } = useWindowSize()
            const previewHeight = computed( () => height.value )
            const scrollTop = ref(0)
            const containerHeight = ref(0)

            const SetScrollTop = () => scrollTop.value = $(window).scrollTop() || 0
            const SetContainerHeight = () => containerHeight.value = $("html").height() || 0
            const heightTop = ref('')
            const heightCenter = ref('')
            const heightBottom = ref('')

            const Init = () => {
                SetScrollTop()
                SetContainerHeight()

                const ratio = previewHeight.value / containerHeight.value
                const heightMaskTop = ( scrollTop.value - 0.0 ) * ratio
                const heightMaskCenter = ( previewHeight.value ) * ratio
                const heightMaskBoottom = previewHeight.value - heightMaskTop - heightMaskCenter

                heightTop.value = `height: ${heightMaskTop}px;`
                heightCenter.value = `height: ${heightMaskCenter}px;`
                heightBottom.value = `height: ${heightMaskBoottom}px;`
            }

            onMounted( () => {
                Init()

                $(window).on('scroll', () => {
                    SetScrollTop()
                })
            })

            function Reset(){
                Init()
            }

            // =================================================================
            const isDrag = ref(false)

            let top = 0
            const ScrollWindow = throttle(() => {
                $(window).scrollTop(top)
            }, props.throttle)

            function Scroll(event: MouseMove){
                top = (event.clientY / previewHeight.value) * containerHeight.value
                // console.log(event.clientY, height.value, top)
                ScrollWindow()
            }

            function HandleMouseDown(event: MouseMove){
                isDrag.value = true

                Scroll(event)
            }

            function HandleMouseUp(){
                isDrag.value = false
            }

            function HandleMouseMove(event: MouseMove){
                if (!isDrag.value) {
                    return
                }

                Scroll(event)
            }

            return {
                heightTop,
                heightCenter,
                heightBottom,
                HandleMouseDown,
                HandleMouseUp,
                HandleMouseMove,
                Reset,
            }
        }        
    })
</script>

<style lang="scss">
    .PreviewScroller{
        position: relative;
        $mask-background: rgba(189, 189, 189, 0.5);

        .mask-top{
            background: $mask-background;
        }

        .mask-center{

        }

        .mask-bottom{
            background: $mask-background;
        }

        .cover{
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;

            // background: black;
        }
    }
</style>