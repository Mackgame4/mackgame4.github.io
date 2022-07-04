<template>
    <div id="aboutPage">
        <h1 style="margin-top: -5px;">About</h1>
        <Markdown id="markdownContainer" :source="readmeSource" html :breaks="false" linkify />
        <br>
        <Button label="Follow me!" icon="pi pi-github" class="p-button-rounded p-button-text" @click="openInNewTab(githubLink)" />
        <Button label="Contact me!" icon="pi pi-discord" class="p-button-rounded p-button-text" @click="openInNewTab(discordLink)" />
    </div>
</template>

<script>
import Markdown from 'vue3-markdown-it';

export default {
    name: 'App',
    components: {
        Markdown
    },
    data() {
        return {
        }
    },
    mounted() {
        this.fetchDiscordUser();
    },
    computed: {
        readmeSource() {
            let url = 'https://raw.githubusercontent.com/Mackgame4/Mackgame4/master/README.md';
            let request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send(null);
            return request.responseText;
        }
    },
    methods: {
        fetchDiscordUser() {
            var waitForElement = setInterval(() => {
                if (document.getElementById("discord") && this.discordUser) {
                    document.getElementById("discord").innerHTML = this.discordUser;
                    var list = document.querySelectorAll('a');
                    for (let i = 0; i < list.length; i++) {
                        list[i].setAttribute('target', '_blank');
                    }
                    clearInterval(waitForElement);
                }
            }, 1);
        },
    }
}
</script>

<style>
a:link {
    color: var(--primary-color);
    background-color: transparent;
    text-decoration: none;
}
a:visited {
    color: var(--primary-color);
    background-color: transparent;
    text-decoration: none;
}
a:hover {
    color: pink;
    background-color: transparent;
    text-decoration: underline;
}
a:active {
    color: pink;
    background-color: transparent;
    text-decoration: underline;
}

#markdownContainer {
    margin-top: 20px;
}

#markdownContainer h4 {
    max-width: 980px;
    margin-left: auto;
    margin-right: auto;
}

#markdownContainer p {
    margin-top: -5px;
    display: inline-block;
    text-align: center;
}

#markdownContainer ul {
    list-style-type: none;
}

/* https://codepen.io/sosuke/pen/Pjoqqp */
#markdownContainer p a .icon {
    margin: 5px;
    margin-right: 10px;
    filter: invert(67%) sepia(35%) saturate(580%) hue-rotate(208deg) brightness(105%) contrast(98%);
}

#markdownContainer p a .icon:hover {
    filter: invert(76%) sepia(9%) saturate(1018%) hue-rotate(301deg) brightness(103%) contrast(106%);
}

</style>