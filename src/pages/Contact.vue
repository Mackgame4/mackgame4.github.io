<template>
    <div id="contactPage">
        <h1 style="margin-top: -5px;">Contact</h1>
        <h3>Hey lets make some projects together!</h3>
        <form class="formContainer">
            <InputText id="name" placeholder="Name*" type="text" v-model="name" :class="[showMessage ? 'p-invalid' : '']" v-tooltip="'The name you identify'" />
            <span class="p-input-icon-right" v-tooltip="'Email is required because its going to be the main response method in case discord is not avaliable'">
                <i class="pi pi-envelope" />
                <InputText id="email" placeholder="Email*" type="text" v-model="email" :class="[showMessage ? 'p-invalid' : '']" />
            </span>
            <span class="p-input-icon-right" v-tooltip="'If your discord DMs are avaliable it will be the main contact method, but its optional'">
                <i class="pi pi-discord" />
                <InputText id="username" placeholder="Discord (ex: Username#0001)" type="text" v-model="discordUsername" />
            </span>
            <Textarea id="message" v-model="text" :autoResize="true" rows="5" cols="30" placeholder="Message" />
            <InlineMessage v-if="showMessage">{{ message }}</InlineMessage>
            <Button label="Submit" icon="pi pi-send" class="submitButton p-button-raised" @click="sendMessage()" />
        </form>
        <Button label="Follow me!" icon="pi pi-github" class="p-button-rounded p-button-text" @click="openInNewTab(githubLink)" />
        <Button label="Contact me!" icon="pi pi-discord" class="p-button-rounded p-button-text" @click="openInNewTab(discordLink)" />
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'App',
    components: {
    },
    data() {
        return {
            showMessage: false,
            message: '*Required',
            name: '',
            email: '',
            discordUsername: '',
            text: ''
        }
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        sendMessage() {
            if (this.name && this.validateEmail(this.email)) {
                this.showMessage = false;
                fetch('https://discord.com/api/webhooks/999039644773666896/7OVDeNOuHlcS8ETGLBlLhdVTyQWDmmUKbaTlhFq3239x3jCScF1OYx7xkBCNOyOo0P30', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: "Web Contact Form",
                        avatar_url: 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/1024/messages-icon.png',
                        content: `**${this.name}** has sent you a message!`,
                        embeds: [
                            {
                                title: "Website Contact Form",
                                description: this.text, // New message from the website contact form!
                                url: "https://mackgame4.github.io",
                                color: 11474714,
                                fields: [
                                    {
                                        name: "Name",
                                        value: this.name
                                    },
                                    {
                                        name: "Email",
                                        value: `||${this.email}||`
                                    },
                                    {
                                        name: "Discord",
                                        value: `*@${this.discordUsername}*`
                                    }
                                ],
                                footer: {
                                    text: "mackgame4.github.io"
                                },
                                timestamp: moment().format(),
                                thumbnail: {
                                    url: "https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/1024/messages-icon.png"
                                }
                            }
                        ],
                        components: [],
                        attachments: []
                    })
                })
            } else if (this.name && !this.validateEmail(this.email)) {
                this.showMessage = true;
                this.message = 'Invalid email';
            }
            else {
                this.showMessage = true;
            }
        },
    }
}
</script>

<style>

.formContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;
    height: 100%;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 20px;
}

.formContainer span.p-input-icon-right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
}

#name {
    width: 100%;
    margin-bottom: 10px;
}

#email {
    width: 100%;
}

#username {
    width: 100%;
}

#message {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
}

.submitButton {
    width: 100%;
    margin-top: 10px !important;
}

.p-inline-message {
    border: none !important;
}

</style>