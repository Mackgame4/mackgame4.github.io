<template>
    <div id="clipboardPage">
        <ContextMenu ref="menu" :model="items" />
        <Card class="clipboardPage">
            <template #content>
                <div class="header">
                    <h2>Image Clipboard</h2>
                    <InputText id="clipboardURL" v-model="clipboardURL" placeholder="Paste an image URL here" />
                    <Button style="margin-left: 10px;" icon="pi pi-plus" @click="addToClipboard" label="Add" />
                </div>
                <div class="content">
                    <div class="imageContainer">
                        <Button v-for="(image, i) in clipboardImages" :key="i" @click="copyToClipboard(image.url)" type="button" class="clipboardButton p-button-raised p-button-text" @contextmenu="onImageRightClick">
                            <img :src="image.url" />
                        </Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script>

export default {
    name: 'ImageClipboard',
    components: {
    },
    data() {
        return {
            clipboardURL: '',
            clipboardImages: [],
            selectedImage: null,
            items: [
                {
                label:'File',
                icon:'pi pi-fw pi-file',
                items:[
                    {
                        label:'New',
                        icon:'pi pi-fw pi-plus',
                        items:[
                            {
                                label:'Bookmark',
                                icon:'pi pi-fw pi-bookmark'
                            }
                        ]
                    }
                ]
            }
        ]
        }
    },
    mounted() {
        this.$nextTick(() => {
            self = this;
            document.getElementById("clipboardURL").addEventListener("keyup", function(event) {
                if (event.key === "Enter") {
                    self.addToClipboard();
                }
            });
        });
    },
    computed: {
    },
    methods: {
        onImageRightClick(event) {
            this.selectedImage = event.target.src;
            this.$refs.menu.show(event);
        },
        isImage(url) {
            url = url.split('?')[0];
            return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
        },
        addToClipboard() {
            if (this.clipboardURL && this.isImage(this.clipboardURL)) {
                this.clipboardImages.push({
                    url: this.clipboardURL,
                    favorite: false,
                    recent: true
                });
                this.clipboardURL = '';
            }
        },
        copyToClipboard(url) {
            navigator.clipboard.writeText(url);
        }
    }
}
</script>

<style>

body, html {
    height: 100vh;
}

.clipboardPage {
    width: 100vw;
    height: 100vh;
    margin: 0;
    border-radius: 0px !important;
}

.clipboardButton {
    padding: 5px !important;
}

</style>