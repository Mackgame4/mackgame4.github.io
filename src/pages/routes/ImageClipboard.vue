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
                    <div v-if="this.clipboardImages.filter(image => image.favorite).length > 0">
                        <h3>Favorite</h3>
                        <div style="margin-bottom: 0px;" class="imageContainer">
                            <div v-for="(image, i) in clipboardImages" :key="i">
                                <Button v-if="image.favorite" :id="'image_'+image.id" @click="copyToClipboard(image.url)" type="button" class="clipboardButton p-button-raised p-button-text" @contextmenu="onImageRightClick">
                                    <img :id="'image_'+image.id" class="clipboardImage" :src="image.url" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <h3 v-if="clipboardImages.length > 0" >Clipboard</h3>
                    <div class="imageContainer">
                        <div v-for="(image, i) in clipboardImages" :key="i">
                            <Button v-if="!image.favorite" :id="'image_'+image.id" @click="copyToClipboard(image.url)" type="button" class="clipboardButton p-button-raised p-button-text" @contextmenu="onImageRightClick">
                                <img :id="'image_'+image.id" class="clipboardImage" :src="image.url" />
                            </Button>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
        <div class="footer">
            <Button class="p-button-text" type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"/>
            <Menu id="overlay_menu" ref="sidemenu" :model="sidemenuItems" :popup="true" />
            <Message class="message" v-if="message.text" :severity="message.severity" @close="this.message = {};">{{ message.text }}</Message>
        </div>
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
            message: {
                text: '',
                type: 'info'
            },
            selectedImage: null,
            sidemenuItems: [
                {
                    label: 'Menu',
                    items: [{
                        label: 'Home',
                        icon: 'pi pi-home',
                        command: () => {
                            this.$router.push({ path: '/' });
                        }
                    },
                    {
                        label: 'Export to JSON',
                        icon: 'pi pi-upload',
                        command: () => {
                            this.exportToJSON();
                        }
                    },
                    {
                        label: 'Import from JSON',
                        icon: 'pi pi-download',
                        command: () => {
                            this.importFromJSON();
                        }
                    },
                    {
                        label: 'Help',
                        icon: 'pi pi-question',
                        command: () => {
                            this.message = {
                                text: 'Paste an image URL in the input and click "Add" or Enter to add it to the clipboard. You can also right-click on an image to remove it from the clipboard or add it to your favorites.',
                                severity: 'info'
                            };
                        }
                    }
                ]},
                {
                    label: 'Danger Zone',
                    items: [{
                        label: 'Clear Clipboard',
                        icon: 'pi pi-trash',
                        command: () => {
                            this.clearClipboard();
                        }
                    }
                ]}
            ],
            items: [
            {
                label: 'Favorite',
                icon: 'pi pi-star',
                command: () => {
                    this.editClipboard('favorite');
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    this.editClipboard('delete');
                }
            }
        ]
        }
    },
    mounted() {
        this.clipboardImages = JSON.parse(localStorage.getItem('clipboardImages') || '[]');
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
        editClipboard(action) {
            if (this.selectedImage) {
                if (action === 'favorite') {
                    this.clipboardImages.filter(image => image.id == this.selectedImage)[0].favorite = !this.clipboardImages.filter(image => image.id == this.selectedImage)[0].favorite;
                } else if (action === 'delete') {
                    this.clipboardImages = this.clipboardImages.filter(image => image.id != this.selectedImage);
                }
                this.selectedImage = null;
                localStorage.setItem('clipboardImages', JSON.stringify(this.clipboardImages));
            }
        },
        exportToJSON() {
            let data = JSON.stringify(this.clipboardImages);
            let blob = new Blob([data], {type: 'text/plain'});
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'imageClipboard.json';
            a.click();
        },
        importFromJSON() {
            let self = this;
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.addEventListener('change', function(e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = function(e) {
                    let data = e.target.result;
                    self.clipboardImages = JSON.parse(data);
                    localStorage.setItem('clipboardImages', data);
                };
                reader.readAsText(file);
            });
            input.click();
        },
        onImageRightClick(event) {
            this.selectedImage = event.target.id.replace('image_', '');
            this.$refs.menu.show(event);
        },
        toggle(event) {
            this.$refs.sidemenu.toggle(event);
            // lazy fix menu text color
            setTimeout(() => {
                const clearClipboardButton = document.querySelectorAll('a.p-menuitem-link')[4];
                clearClipboardButton.querySelector('span.p-menuitem-icon').style.color = 'red';
                clearClipboardButton.querySelector('span.p-menuitem-text').style.color = 'red';
            }, 1);
        },
        isImage(url) {
            // check if image is not broken
            var img = new Image();
            img.src = url;
            if (!img.height > 0 && !img.width > 0) {
                return false;
            }
            url = url.split('?')[0];
            return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
        },
        addToClipboard() {
            if (this.clipboardURL && this.isImage(this.clipboardURL)) {
                this.clipboardImages.push({
                    id: Date.now(),
                    url: this.clipboardURL,
                    favorite: false,
                    recent: true
                });
                this.clipboardURL = '';
                localStorage.setItem('clipboardImages', JSON.stringify(this.clipboardImages));
            }
        },
        clearClipboard() {
            this.clipboardImages = [];
            localStorage.setItem('clipboardImages', JSON.stringify(this.clipboardImages));
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

.message {
    position: fixed;
    bottom: 12px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 100%;
    max-width: 850px;
    z-index: 1;
}

.imageContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    max-height: 28vh;
    margin-bottom: 52px;
    overflow-y: auto;
}

.clipboardButton {
    width: 45px;
    height: 45px;
    margin: 5px !important;
    padding: 5px !important;
}

.clipboardImage {
    width: 100%;
    height: 100%;
}

.clipboardButton.p-button.p-button-raised {
    box-shadow: none !important;
}

.footer {
    position: absolute;
    bottom: 12px;
    right: 15px;
    display: flex;
}

#overlay_menu {
    min-width: 203px !important;
}

</style>