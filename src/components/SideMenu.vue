<template>
<div>
    <div v-if="githubProfile">
        <Avatar style="width: 145px; height: 145px;" :image="githubProfile.avatar_url" size="xlarge" shape="circle" />
        <h2>@{{ githubProfile.login }}</h2>
        <p><b>Developer - {{ githubProfile.name }}</b></p>
        <p>{{ githubProfile.bio }}</p>
    </div>
    <div v-else>
        <Avatar icon="pi pi-user" />
        <h2>Mack</h2>
    </div>
    <MegaMenu class="sidebarMenu" :model="menuItems" orientation="vertical" />
</div>
</template>

<script>
export default {
    name: 'App',
    components: {
    },
    data() {
    return {
        page: 'about',
        githubProfile: null,
        menuItems: [
            /*{
            label: 'Home', icon: 'pi pi-fw pi-home', command: () => { this.page = 'home' }
            },*/
            {
            label: 'About', icon: 'pi pi-fw pi-info-circle', command: () => { this.page = 'about' }
            },
            {
            label: 'Contact', icon: 'pi pi-fw pi-envelope', command: () => { this.page = 'contact' }
            },
            {
            label: 'Public API', icon: 'pi pi-fw pi-box', command: () => { this.page = 'api' }
            },
            {
            label: 'Github Repositories', icon: 'pi pi-fw pi-folder',
            items: [
                [
                    {
                        label: 'Public Repos',
                        items: []
                    }
                ]
            ]
            },
            /*{
            label: 'Pages', icon: 'pi pi-fw pi-file',
            items: [
                [
                    {
                        label: 'Video 1',
                        items: [{label: 'Video 1.1'}, {label: 'Video 1.2'}]
                    },
                    {
                        label: 'Video 2',
                        items: [{label: 'Video 2.1'}, {label: 'Video 2.2'}]
                    }
                ]
            ]
            },*/
            {
            label: 'FiveM Tebex', icon: 'pi pi-fw pi-shopping-cart', url: 'https://mackmods.tebex.io'
            }
        ]
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$emit('updatePage', this.page);
        })
        fetch('https://api.github.com/users/mackgame4')
        .then(res => res.json())
        .then(res => {
            this.githubProfile = res
        })
        fetch('https://api.github.com/users/mackgame4/repos')
        .then(res => res.json())
        .then(res => {
            for (let i = 0; i < res.length; i++) {
            let icon = res[i].fork ? 'pi pi-fw pi-sitemap' : 'pi pi-fw pi-folder-open'
            this.menuItems[3].items[0][0].items.push({label: res[i].name, icon: icon, url: res[i].html_url})
            }
        }).then(() => {
            var list = document.querySelectorAll('a.p-menuitem-link');
            for (let i = 0; i < list.length; i++) {
            list[i].setAttribute('target', '_blank');
            }
        })
    },
    watch: {
        page: function(newPage) {
            this.$emit('updatePage', newPage)
        }
    },
    methods: {
    }
}
</script>

<style>
.p-sidebar-content {
    height: 100%;
}

.sideBarFooter {
    position: absolute;
    bottom: 12px;
    right: 15px;
    display: flex;
}

.sideBarFooter .p-togglebutton {
    margin-left: 5px;
}

.sidebarMenu {
    width: 100% !important;
    padding: 5px !important;
}

.sidebarMenu .p-megamenu-panel {
    text-align: left !important;
    position: absolute !important;
    min-width: 328px !important;
    max-height: 570px !important;
    overflow-y: auto !important;
}

.sidebarMenu .p-megamenu-panel .p-menuitem {
    width: 100% !important;
    text-align: left !important;
}

.sidebarMenu .p-megamenu-panel .p-menuitem-link {
    min-width: 300px !important;
}

.p-menuitem-active > .p-megamenu-panel {
    display: block !important;
    position: fixed !important;
    top: 27% !important;
    left: 358px !important;
}

.mobile .p-megamenu-panel {
    position: relative !important;
    top: 5px !important;
    margin-bottom: 3px !important;
    left: 0px !important;
    min-width: 200px !important;
    overflow: auto !important;
}

#sideBar {
    width: 380px;
    height: 100vh;
    background-color: #f5f5f5;
    /*overflow-y: hidden !important;*/
    overflow-y: auto !important;
}
</style>