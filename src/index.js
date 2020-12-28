import Vue from 'vue'

import PagePreviewScrollbar from '@/components/PagePreviewScrollbar.vue'

const Components = {
    PagePreviewScrollbar,
}

Object.keys(Components).forEach( name =>{
    Vue.component(name, Components[name])
})

export default Components