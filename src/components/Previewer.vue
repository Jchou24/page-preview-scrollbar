<template>
    <div :id="previewerId" class="Previewer" >
        <div class="previewer-content" ref="Previewer"></div>
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
            iframeHtmlClass:{
                type: String,
                default: "PagePreviewScrollbar-iframe"
            },
            elementToRmoveSelectors:{
                type: Array as () => Array<string>,
                default: () => [],
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

                        var target = document.querySelectorAll(elementToRmove[i]);
                        for(var j = 0; j < target.length; j++){
                            target[j].parentNode.removeChild(target[j]);
                        }
                    }
                    document.body.classList.add("${props.iframeHtmlClass}")
                    <`+`/script>`;
                html = html.replace('</body>',script + '</body>');
                return html
            }

            const previewerContent = ref( GetPreviewerContent() )

            const SetDimensions = () => {
                const previewer = GetPreviewer()
                const realScaleWidth = previewer.clientWidth / document.body.clientWidth;
                const realScaleHeight = previewer.clientHeight / document.body.clientHeight;
                
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

            const Init = () => {
                previewerContent.value = GetPreviewerContent()
                const previewer = GetPreviewer()
                previewer.innerHTML = ""
                previewer.appendChild(previewerContent.value);

                const iframeDoc = (previewerContent.value.contentWindow as Window)?.document;
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
            watch( () => props.elementToRmoveSelectors, Init )

            return {
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