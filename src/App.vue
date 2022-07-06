<template>
<div class="mainContainer">
  <div v-if="!mobile" id="sideBar">
    <Card class="background" style="border-right: 1px gray solid;">
      <template #content>
        <SideMenu v-on:updatePage="updatePage"/>
      </template>
      <template #footer>
        <Button icon="pi pi-github" class="p-button-rounded p-button-text" @click="openInNewTab(githubLink)" />
        <Button icon="pi pi-discord" class="p-button-rounded p-button-text" @click="openInNewTab(discordLink)" />
        <Button icon="pi pi-twitter" class="p-button-rounded p-button-text" @click="openInNewTab(twitterLink)" />
        <div>
          <ToggleButton v-model="darkMode" onLabel="Dark Mode" offLabel="Light Mode" onIcon="pi pi-moon" offIcon="pi pi-sun" />
        </div>
      </template>
    </Card>
  </div>
  <Sidebar v-if="mobile" v-model:visible="sidebar" class="mobile">
    <SideMenu v-on:updatePage="updatePage"/>
    <div class="sideBarFooter">
      <Button icon="pi pi-github" class="p-button-rounded p-button-text" @click="openInNewTab(githubLink)" />
      <Button icon="pi pi-discord" class="p-button-rounded p-button-text" @click="openInNewTab(discordLink)" />
      <Button icon="pi pi-twitter" class="p-button-rounded p-button-text" @click="openInNewTab(twitterLink)" />
      <div>
        <ToggleButton v-model="darkMode" onLabel="Dark Mode" offLabel="Light Mode" onIcon="pi pi-moon" offIcon="pi pi-sun" />
      </div>
    </div>
  </Sidebar>
  <ToggleButton style="position: absolute; top: 5px; left: 5px;" v-if="mobile" v-model="sidebar" onIcon="pi pi-bars" offIcon="pi pi-bars" />
  <Card id="main" class="background">
    <template #content>
      <!--div v-if="page == 'home'">
        <h1>Welcome to the Home Page</h1>
      </div-->
      <About v-if="page == 'about'"/>
    </template>
  </Card>
</div>
</template>

<script>
import SideMenu from './components/SideMenu.vue';
import About from './pages/About.vue'

export default {
  name: 'App',
  components: {
    SideMenu,
    About
  },
  data() {
    return {
      theme: localStorage.getItem('theme'),
      darkMode: true,
      sidebar: false,
      mobile: false,
      page: null
    }
  },
  mounted() {
    this.applyTheme();
    this.$nextTick(() => {
      this.mobile = window.innerWidth < 920;
    })
    window.addEventListener('resize', () => {
      //this.mobile = window.innerWidth < 768
      this.mobile = window.innerWidth < 920
    })
  },
  watch: {
    darkMode: async function(val) {
      this.changeTheme();
      if (this.theme != undefined) { localStorage.setItem('theme', this.theme); }
    }
  },
  methods: {
    changeTheme(theme) {
      let themePath = undefined
      if (theme) {
        themePath = theme
      } else {
        themePath = this.darkMode ? '/themes/lara-dark-purple/theme.css' : '/themes/lara-light-purple/theme.css'
      }
      this.theme = themePath
      this.applyTheme();
    },
    applyTheme() {
      if (this.theme) {
        let themeElement = document.getElementById('theme-link');
        themeElement.setAttribute('href', this.theme);
        if (this.theme == '/themes/lara-dark-purple/theme.css') {
          this.darkMode = true
        } else {
          this.darkMode = false
        }
      }
    },
    updatePage(page) {
      this.page = page
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

html, body {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--surface-card); 
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color); 
}

::-webkit-scrollbar-thumb:hover {
  background: var(--surface-border); 
}

#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow-y: hidden;
}

.mainContainer {
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100vw;
  height: 100vh;
}

.p-component {
  font-family: 'Inter', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#main {
  overflow-y: auto;
  width: 100%;
}

.background {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0px !important;
}

.background .p-card-body {
  height: 100%;
}

.background .p-card-content {
  height: 87%;
}
</style>
