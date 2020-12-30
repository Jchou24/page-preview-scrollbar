import Vue from 'vue'
import vuetify from './vuetify'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)

new Vue({
    vuetify,
    render: h => h(App),
}).$mount('#app')
