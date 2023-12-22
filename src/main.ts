import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    // ssr: true,  // SSR (Server-Side Rendering)
    icons: {
        // Material Design Icons (MDI)
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

createApp(App).use(vuetify).mount('#app')
