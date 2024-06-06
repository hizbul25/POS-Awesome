import { createApp, h } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Global CSS has to be imported
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import Home from './Home.vue';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        background: '#FFFFFF',
        primary: '#0097A7',
        secondary: '#00BCD4',
        accent: '#9575CD',
        success: '#66BB6A',
        info: '#2196F3',
        warning: '#FF9800',
        error: '#E86674',
        orange: '#E65100',
        golden: '#A68C59',
        badge: '#F5528C',
        customPrimary: '#085294',
      },
    },
  },
  rtl: frappe.utils.is_rtl(),
});

frappe.provide('frappe.PosApp');

frappe.PosApp.posapp = class {
  constructor({ parent }) {
    this.$parent = $(document);
    this.page = parent.page;
    this.make_body();
  }

  make_body() {
    this.$el = this.$parent.find('.main-section');

    const app = createApp({
      render: () => h(Home),
    }).use(vuetify).mount(this.$el[0])
  }

  setup_header() {
    // Implement setup_header logic here
  }
};
