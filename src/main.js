import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: App }
    ]
});

import PrimeVue from 'primevue/config';
//import 'primevue/resources/themes/lara-dark-purple/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App)
app.use(router)

// Some discord checker
// https://github.com/chocololat/discord-lookup-api
let url = 'https://discordlookup.mesavirep.xyz/263676903116898304';
let request = new XMLHttpRequest();
request.open('GET', url, false);
request.send(null);
let response = JSON.parse(request.responseText);

app.mixin({
    data: () => ({
        discordUser: response.tag,
        discordLink: 'https://discord.gg/Vw6acJ5',
        githubLink: 'https://github.com/Mackgame4',
        twitterLink: 'https://twitter.com'
    }),
    methods: {
        openInNewTab(url) {
            window.open(url, '_blank');
        }
    }
})

app.use(PrimeVue);
import Dialog from 'primevue/dialog';
app.component('Dialog', Dialog);
import Button from 'primevue/button';
app.component('Button', Button);
import ToggleButton from 'primevue/togglebutton';
app.component('ToggleButton', ToggleButton);
import InputSwitch from 'primevue/inputswitch';
app.component('InputSwitch', InputSwitch);
import Avatar from 'primevue/avatar';
app.component('Avatar', Avatar);
import Sidebar from 'primevue/sidebar';
app.component('Sidebar', Sidebar);
import MegaMenu from 'primevue/megamenu';
app.component('MegaMenu', MegaMenu);
import Card from 'primevue/card';
app.component('Card', Card);

app.mount('#app')