import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    mode: 'hash',
    routes: [
        { path: '/', name: "Home", component: App },
        { path: '/imageclipboard', name: "imageClipboard", component: () => import('./pages/routes/ImageClipboard.vue') },
        { path: "/:catchAll(.*)", redirect: '/' }
    ]
});

import PrimeVue from 'primevue/config';
//import 'primevue/resources/themes/lara-dark-purple/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App).use(router)

// Some discord checker
// https://github.com/chocololat/discord-lookup-api
//let url = 'https://discordlookup.mesavirep.xyz/263676903116898304';
//let request = new XMLHttpRequest();
//request.open('GET', url, false);
//request.send(null);
//let response = JSON.parse(request.responseText);
//response = response;
let response = {
    username: '📂 cd ./System32/Mack.exe#2173'
}

app.mixin({
    data: () => ({
        discordUser: response.username,
        discordLink: 'https://discord.gg/Vw6acJ5',
        githubLink: 'https://github.com/Mackgame4',
        redditLink: 'https://www.reddit.com/user/Mackgame4'
    }),
    methods: {
        openInNewTab(url) {
            window.open(url, '_blank');
        },
        waitForElement(selector, callback) {
            if (document.querySelector(selector)) {
                callback();
            } else {
                setTimeout(() => {
                this.waitForElement(selector, callback);
                }, 100);
            }
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
import Checkbox from 'primevue/checkbox';
app.component('Checkbox', Checkbox);
import InputSwitch from 'primevue/inputswitch';
app.component('InputSwitch', InputSwitch);
import InputText from 'primevue/inputtext';
app.component('InputText', InputText);
import Avatar from 'primevue/avatar';
app.component('Avatar', Avatar);
import Sidebar from 'primevue/sidebar';
app.component('Sidebar', Sidebar);
import Menu from 'primevue/menu';
app.component('Menu', Menu);
import MegaMenu from 'primevue/megamenu';
app.component('MegaMenu', MegaMenu);
import Image from 'primevue/image';
app.component('Image', Image);
import Message from 'primevue/message';
app.component('Message', Message);
import InlineMessage from 'primevue/inlinemessage';
app.component('InlineMessage', InlineMessage);
import Card from 'primevue/card';
app.component('Card', Card);
import Textarea from 'primevue/textarea';
app.component('Textarea', Textarea);
import Skeleton from 'primevue/skeleton';
app.component('Skeleton', Skeleton);
import ContextMenu from 'primevue/contextmenu';
app.component('ContextMenu', ContextMenu);
import Tooltip from 'primevue/tooltip';
app.directive('tooltip', Tooltip);

app.mount('#app')