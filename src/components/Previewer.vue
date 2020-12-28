<template>
    <div :id="previewerId" class="Previewer" />
</template>

<script lang="ts">
    import { defineComponent, onMounted } from '@vue/composition-api'

    import html2canvas from 'html2canvas'

    export default defineComponent({
        name: 'Previewer',
        props:{
            previewerId:{
                type: String,
                default: "Previewer"
            },
            targetElement:{
                type: String,
                default: "html"
            },
        },
        setup( props ){
            const Init = () => {
                // console.log("Init")
                const target = document.querySelector(props.targetElement) as HTMLElement
                const previewer = document.getElementById(props.previewerId)

                // console.log(target, previewer)

                if (!target || !previewer) {
                    return
                }

                // console.log("Paint")
                html2canvas(target).then(canvas => {
                    const children = previewer.children
                    if( children.length > 0){
                        previewer.innerHTML = ""
                    }

                    previewer.appendChild(canvas)
                })
            }

            onMounted(Init)            

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

        canvas{
            width: 100% !important;
            height: 100% !important;
        }
    }
</style>