<template>
<div class="mainContainer" :class="[mobile ? 'mobile' : '']">
  <div v-if="!mobile" id="sideBar">
    <Card class="background" style="border-right: 1px gray solid;">
      <template #content>
        <SideMenu v-on:updatePage="updatePage" v-on:receiveReposData="receiveReposData"/>
      </template>
      <template #footer>
        <Button icon="pi pi-github" class="p-button-rounded p-button-text" @click="openInNewTab(githubLink)" />
        <Button icon="pi pi-discord" class="p-button-rounded p-button-text" @click="openInNewTab(discordLink)" />
        <Button icon="pi pi-reddit" class="p-button-rounded p-button-text" @click="openInNewTab(redditLink)" />
        <div>
          <ToggleButton v-model="darkMode" onLabel="Dark Mode" offLabel="Light Mode" onIcon="pi pi-moon" offIcon="pi pi-sun" />
        </div>
      </template>
    </Card>
  </div>
  <Sidebar v-if="mobile" v-model:visible="sidebar" class="mobile">
    <SideMenu v-on:updatePage="updatePage" v-on:receiveReposData="receiveReposData"/>
    <div class="sideBarFooter">
      <Button icon="pi pi-github" class="p-button-rounded p-button-text" @click="openInNewTab(githubLink)" />
      <Button icon="pi pi-discord" class="p-button-rounded p-button-text" @click="openInNewTab(discordLink)" />
      <Button icon="pi pi-reddit" class="p-button-rounded p-button-text" @click="openInNewTab(redditLink)" />
      <div>
        <ToggleButton v-model="darkMode" onLabel="Dark Mode" offLabel="Light Mode" onIcon="pi pi-moon" offIcon="pi pi-sun" />
      </div>
    </div>
  </Sidebar>
  <ToggleButton style="position: absolute; top: 5px; left: 5px;" v-if="mobile" v-model="sidebar" onIcon="pi pi-bars" offIcon="pi pi-bars" />
  <Card id="main" class="background">
    <template #content>
      <div v-if="page == 'home'">
        <h1>Github Repos</h1>
        <div v-if="!githubRepos" class="repoContainer">
          <Skeleton style="max-width: 417px; min-height: 445px;" class="repoCard" v-for="i in 9" :key="i" shape="rectangle" />
        </div>
        <div class="repoContainer">
          <Card v-for="(repo, i) in githubRepos" :key="i" class="repoCard">
            <template #header>
              <img :id="'repoImg'+repo.id" class="repoImage" />
            </template>
            <template #title>
              <span v-if="repo.name">{{ repo.name }}</span>
              <span v-else>{{ repo.full_name }}</span>
            </template>
            <template #content>
              <p v-if="repo.description">{{ repo.description }}</p>
              <p v-else>No description provided.</p>
              <Button style="margin-bottom: -30px;" icon="pi pi-github" label="View Source" class="p-button-rounded p-button-text" @click="openInNewTab(repo.html_url)" />
            </template>
          </Card>
        </div>
      </div>
      <About v-if="page == 'about'"/>
      <PublicAPI v-if="page == 'api'"/>
      <Contact v-if="page == 'contact'"/>
    </template>
  </Card>
</div>
</template>

<script>
import SideMenu from '../../components/SideMenu.vue';
import About from '../../pages/About.vue'
import PublicAPI from '../../pages/PublicAPI.vue'
import Contact from '../../pages/Contact.vue'
import { createCanvas  } from 'canvas';

export default {
  name: 'App',
  components: {
    SideMenu,
    About,
    PublicAPI,
    Contact
  },
  data() {
    return {
      theme: localStorage.getItem('theme'),
      darkMode: true,
      sidebar: false,
      mobile: false,
      page: null,
      githubRepos: null
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
    },
    mobile: async function(val) {
      if (val) {
        this.sidebar = true; // TODO: Fix mobile sidebar
      }
    },
    page: function(val) {
      if (val == 'home') {
        if (this.githubRepos) {
          for (let i = 0; i < this.githubRepos.length; i++) {
            let repo = this.githubRepos[i];
            this.waitForElement(`#repoImg${repo.id}`, () => {
              document.getElementById('repoImg'+repo.id).src = this.githubRepos[i].image;
            })
          }
        }
      }
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
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      let wordSplitter = '-';
      let words = text.split(wordSplitter); //let words = text.split(' ');
      let line = '';
      let testLine = '';
      let wordArray = [];
      let totalLineHeight = 0;
      for(var n = 0; n < words.length; n++) {
          testLine += `${words[n]+wordSplitter}`;
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
              wordArray.push([line, x, y]);
              y += lineHeight;
              totalLineHeight += lineHeight;
              // dont add to the last word
              if (n == words.length - 1) {
                line = `${words[n]}`;
              } else {
                line = `${words[n]+wordSplitter}`;
              }
              testLine = `${words[n]+wordSplitter}`;
          }
          else {
            if (n == words.length - 1) {
              line += `${words[n]}`;
            } else {
              line += `${words[n]+wordSplitter}`;
            }
          }
          if(n === words.length - 1) {
              wordArray.push([line, x, y]);
          }
      }
      return [ wordArray, totalLineHeight ];
    },
    receiveReposData(data) {
      this.githubRepos = data
      // Canvas
      for (let i = 0; i < this.githubRepos.length; i++) {
        let repo = this.githubRepos[i];
        const canvas = createCanvas(1342, 853);
        const ctx = canvas.getContext('2d');
        // Settings
        ctx.globalCompositeOperation='destination-over';
        // Vars
        var gradientList = [
          [ '#FA9800', '#D7BC00' ],
          [ '#15BC80', '#41E784' ],
          [ '#052793', '#1BACC9' ],
          [ '#FF536E', '#FFD793' ],
          [ '#F78FCA', '#49E94B' ],
          [ '#5C67DA', '#CA87E4' ],
          [ '#EDE46D', '#18BCBE' ],
          [ '#F8C768', '#A251F8' ],
          [ '#82DCFF', '#DD4462' ],
          [ '#EDF1F2', '#8E9EAB' ],
          [ '#C84C80', '#FCB7B2' ],
          [ '#06E1F7', '#6850EC' ]
        ];
        var emojiList = ['💻', '🖥️', '💎', '🍌', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍅', '🍆', '🍑', '🍇', '🍉', '🍒', '🍓', '🍈', '🍍', '🍅', '🍆', '🍑', '🍊', '🍋', '🍌', '🍏', '🍎', '🍐', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍅', '🍆', '🍑', '🍊', '🍋', '🍌', '🍏', '🍎', '🍐', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍅', '🍆', '🍑', '🍊', '🍋', '🍌', '🍏', '🍎', '🍐', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍅', '🍆', '🍑', '🍊', '🍋', '🍌', '🍏', '🍎', '🍐', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍅', '🍆', '🍑', '🍊', '🍋', '🍌', '🍏', '🍎', '🍐', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒']
        var articleName = repo.name;
        var articleCategory = repo.language;
        // Emoji
        let emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        ctx.fillStyle = 'white';
        ctx.font = '95px Inter';
        ctx.fillText(emoji, 85, 700);
        // Text
        ctx.font = 'bold 95px Inter';
        ctx.fillStyle = 'white';
        let wrappedText = this.wrapText(ctx, articleName, 85, 753, 1280, 100);
        wrappedText[0].forEach(function(item) {
          ctx.fillText(item[0], item[1], item[2] - wrappedText[1] - 200); // 200 is height of an emoji
        })
        // Category
        ctx.font = 'bold 50px Inter';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText(articleCategory, 85, 553 - wrappedText[1] - 100); // 853 - 200 for emoji, -100 for line height of 1
        // Stats
        ctx.font = '50px Inter';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('⭐'+repo.stargazers_count, 85, 253 - wrappedText[1] - 100);
        ctx.fillText('👁️‍🗨️'+repo.watchers_count, 225, 253 - wrappedText[1] - 100);
        ctx.fillText('🗄️'+repo.forks_count, 365, 253 - wrappedText[1] - 100);
        ctx.fillText('📦'+repo.size, 490, 253 - wrappedText[1] - 100);
        if (repo.license) { ctx.fillText('📖'+repo.license.name, 85, 353 - wrappedText[1] - 100); }
        // Gradient Background
        let gradientColors = gradientList[Math.floor(Math.random() * gradientList.length)];
        let grd = ctx.createLinearGradient(0, 853, 1352, 0);
        grd.addColorStop(0, gradientColors[0]);
        grd.addColorStop(1, gradientColors[1]);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1342, 853);
        const dataURL = canvas.toDataURL();
        this.githubRepos[i].image = dataURL;
        this.waitForElement(`#repoImg${repo.id}`, () => {
          document.getElementById('repoImg'+repo.id).src = dataURL;
        })
      }
    }
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

.mainContainer.mobile {
  display: flex !important;
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

.repoContainer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  width: 100%;
  height: 100%;
}

.repoCard {
  background: var(--surface-b);
  border: 1px solid var(--surface-d);
  border-radius: 6px;
  max-width: 480px;
  padding: 12px;
}

.repoImage {
  width: 100%;
  border-radius: 5px !important;
}
</style>
