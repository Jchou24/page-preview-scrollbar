<template>
    <div :id="previewerId" class="Previewer" >
        <div class="previewer-content" :class="{trans: isStartTransition}" ref="Previewer"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api'

    export default defineComponent({
        name: 'Previewer',
        props:{
            previewerId:{
                type: String,
                default: "Previewer"
            },
            containerClass:{
                type: String,
                default: "PagePreviewScrollbar"
            },
            targetSelector:{
                type: String,
                default: "html"
            },
            iframeHtmlClass:{
                type: String,
                default: "PagePreviewScrollbar-iframe"
            },
            elementToRmoveSelectors:{
                type: Array as () => Array<string>,
                default: () => [],
            },
            repaintAnimation:{
                type: Boolean,
                default: true,
            },
        },
        setup( props, { emit, refs } ){
            const GetPreviewer = () => refs.Previewer as HTMLElement
            const GetPreviewerContent = () => {
                const previewerContent = document.createElement('iframe') as HTMLIFrameElement
                previewerContent.className += 'previewer-iframe';
                previewerContent.style.transformOrigin = '0 0';
                return previewerContent
            }
            const GetIframeHtml = () => {
                const elementToRmoveSelectors = props.elementToRmoveSelectors.includes(`.${props.containerClass}`) ? props.elementToRmoveSelectors : [`.${props.containerClass}`, ...props.elementToRmoveSelectors]
                const elementToRmoveString = elementToRmoveSelectors.map( x => `"${x}"` ).join(",")
                let html = document.documentElement.outerHTML
                    .replace(/<script([\s\S]*?)>([\s\S]*?)<\/script>/gim, '');// Remove all scripts
                const script = `<script>
                    const elementToRmove = [${elementToRmoveString}];
                    for(var i = 0; i < elementToRmove.length; i++){

                        const target = document.querySelectorAll(elementToRmove[i]);
                        for(var j = 0; j < target.length; j++){
                            target[j].parentNode.removeChild(target[j]);
                        }
                    }
                    document.body.classList.add("${props.iframeHtmlClass}")

                    const target = document.querySelector("${props.targetSelector}")
                    target.style.width = "100%"
                    target.style.height = "100%"
                    target.style.border = "unset"
                    target.style.margin = "0"
                    target.style.position = "fixed"
                    target.style["box-sizing"] = "border-box"
                    target.style.left = "0"
                    target.style.top = "0"
                    target.style["z-index"] = "99999"

                    const bg = document.createElement('div')
                    bg.style.width = "100%"
                    bg.style.height = "100%"
                    bg.style.position = "fixed"
                    bg.style.left = "0"
                    bg.style.top = "0"
                    bg.style["z-index"] = "99998"
                    bg.style.background = "white"

                    const parent = target.parentElement
                    if(parent){
                        target.parentElement.appendChild(bg) 
                    }
                    <`+`/script>`;
                html = html.replace('</body>',script + '</body>');
                return html
            }

            const previewerContent = ref( GetPreviewerContent() )

            const SetDimensions = () => {
                const previewer = GetPreviewer()
                const target = document.querySelector(props.targetSelector)
                const realScaleWidth = previewer.getBoundingClientRect().width / (target as Element).getBoundingClientRect().width;
                const realScaleHeight = previewer.getBoundingClientRect().height / (target as Element).getBoundingClientRect().height;
                
                previewerContent.value.style.transform = `scale( ${realScaleWidth}, ${realScaleHeight} )`;
                previewerContent.value.style.width = (100 / realScaleWidth) + '%';
                previewerContent.value.style.height = (100 / realScaleHeight) + '%';
            }

            const InitEventListener = () => {
                window.addEventListener('resize', SetDimensions);
                window.addEventListener('load', SetDimensions);                
            }

            const RemoveEventListener = () => {
                window.removeEventListener('resize', SetDimensions);
                window.removeEventListener('load', SetDimensions);
            }

            const isStartTransition = ref(false)
            const StartTransition = () => {
                if(!props.repaintAnimation){
                    return
                }
                isStartTransition.value = true
                setTimeout(() => isStartTransition.value = false, 1000)
            }

            const Init = () => {
                StartTransition()
                previewerContent.value = GetPreviewerContent()
                const previewer = GetPreviewer()
                previewer.innerHTML = ""
                previewer.appendChild(previewerContent.value);

                const iframeDoc = (previewerContent.value.contentWindow as Window)?.document;
                if(!iframeDoc){
                    return
                }
                const html = GetIframeHtml()
                
                iframeDoc.open();
                iframeDoc.write("");
                iframeDoc.write(html);
                iframeDoc.close();
                
                SetDimensions();
                RemoveEventListener()
                InitEventListener()
                emit("repainted")
            }

            onMounted(Init)
            onBeforeUnmount(RemoveEventListener)
            watch( () => [ props.targetSelector ], Init )

            return {
                isStartTransition,
                Reset: Init,
            }
        }
    })
</script>

<style lang="scss">
    .Previewer{
        width: 100%;
        height: 100%;

        .previewer-content{
            width: 100%;
            height: 100%;

            @keyframes fadeScale {
                0% {
                    transform: scale(0.97);
                    opacity: 0.0;
                }
                100% {
                    transform: scale(1.0);
                    opacity: 1.0;
                }
            }

            &.trans{
                animation-name: fadeScale;
                animation-duration: 1s;
                animation-timing-function: ease-in-out;
                
            }
        }

        .previewer-iframe{ 
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            transform-origin: 0 0;
        }
    }
</style>