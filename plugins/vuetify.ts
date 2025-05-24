import '@mdi/font/css/materialdesignicons.css'
import { md3 } from "vuetify/blueprints";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {defaults} from "~/utils/defaults";

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        blueprint: md3,
        defaults
    })
    app.vueApp.use(vuetify)
})
