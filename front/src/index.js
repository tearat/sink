import Vue from 'vue';
// Vue.config.productionTip = false;

// import Vuex from 'vuex';
// Vue.use(Vuex);

// import router from '~/router';
// import store from '~/store'

import Root from '~/components/Root.vue';

require('./public/style.css')

new Vue({
    el: '#app',
    // router,
    // store,
    components: {
        Root
    },
    mounted() {
    },
    template: '<Root/>'
})

console.log("Frontend (DEV) server started on port: 9000");
console.clear();
