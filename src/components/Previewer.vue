<template>
    <div :id="previewerId" class="Previewer" />
</template>

<script lang="ts">
    import { computed, defineComponent, watch } from '@vue/composition-api'

    import * as htmlToImage from 'html-to-image'

    export default defineComponent({
        name: 'Previewer',
        props:{
            previewerId:{
                type: String,
                default: "Previewer"
            },
            targetSelector:{
                type: String,
                default: "html"
            },
            paintOption:{
                type: Object as () => htmlToImage.Options,
                default: () => ({})
            },
            containerClass:{
                type: String,
                default: "PagePreviewScrollbar"
            },
        },
        setup( props, { emit } ){

            const option = computed( () => {
                const filter = (element: HTMLElement) => {
                    const isNoScript = element.tagName?.toLowerCase() === "noscript"
                    if( isNoScript === true ){
                        return false
                    }

                    const isScrollbar = element.classList?.contains(props.containerClass)
                    return (isScrollbar === false || isScrollbar === true) ? !isScrollbar : true
                }

                const mixedFilter = (element: HTMLElement) => {
                    const optionFilter = props.paintOption.filter
                    if( optionFilter ){
                        return optionFilter(element) && filter(element)
                    }else{
                        return filter(element)
                    }
                }   

                return {
                    ...props.paintOption,
                    filter: mixedFilter,
                } as htmlToImage.Options
            })

            const Init = () => {
                // console.log("Init")
                const target = document.querySelector(props.targetSelector) as HTMLElement
                const previewer = document.getElementById(props.previewerId)

                // console.log(target, previewer)

                if (!target || !previewer) {
                    return
                }

                // console.log("Paint")

                // htmlToImage.toCanvas(target)
                //     .then(function (canvas) {

                //         const children = previewer.children
                //         if( children.length > 0){
                //             previewer.innerHTML = ""
                //         }

                //         previewer.appendChild(canvas)

                //         emit("repainted")
                //     })

                // htmlToImage.toPng(target)
                //     .then(function (dataUrl) {
                //         const img = new Image();
                //         img.src = dataUrl;

                //         const children = previewer.children
                //         if( children.length > 0){
                //             previewer.innerHTML = ""
                //         }

                //         previewer.appendChild(img)

                //         emit("repainted")
                //     })                

                htmlToImage.toSvg(target, option.value)
                    .then(function (dataUrl) {
                        const img = new Image();
                        img.src = dataUrl;

                        const children = previewer.children
                        if( children.length > 0){
                            previewer.innerHTML = ""
                        }

                        previewer.appendChild(img)

                        emit("repainted")
                    })
            }

            watch( () => props.targetSelector, Init )

            function Reset(){
                Init()
            }

            return {
                Reset,
            }
        }        
    })
</script>

<style lang="scss">
    .Previewer{
        background: whitesmoke;
        width: 100%;
        height: 100%;

        // canvas{
        //     width: 100% !important;
        //     height: 100% !important;
        // }

        img{
            width: 100%;
            height: 100%;
        }
    }
</style>