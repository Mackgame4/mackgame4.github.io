<template>
    <div>
        <h1 style="margin-top: -5px;">Public API</h1>
        <Message severity="warn" :closable="false">This API its in work in progress!</Message>
        <h2>Temp File Upload</h2>
        <dashboard :uppy="uppy" :props="{theme: 'light'}" />
        <p v-if="cachedFiles.length != 0">Your files:</p>
        <div v-if="cachedFiles.length != 0" style="overflow-x:auto;">
            <table>
                <tr>
                    <th>File Name</th>
                    <th>URL</th>
                </tr>
                <tr v-for="(file, i) in cachedFiles" :key="i">
                    <td>{{ file.name }}</td>
                    <td><a :href="file.url" target="_blank">{{ file.url }}</a></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { Dashboard } from '@uppy/vue'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

export default {
    name: 'App',
    components: {
        Dashboard
    },
    data() {
        return {
            uppy: new Uppy({
                id: 'uppy',
                debug: false,
                autoProceed: true,
                restrictions: {
                }
            }),
            cachedFiles: []
        }
    },
    mounted() {
        let self = this
        if (localStorage.getItem('cachedFiles')) {
            this.cachedFiles = JSON.parse(localStorage.getItem('cachedFiles'))
        }
        this.uppy.use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' });
        this.uppy.on('upload-success', function (file, response) {
            var url = response.uploadURL
            var fileName = file.name
            //console.log(url, fileName);
            self.cachedFiles.push({
                name: fileName,
                url: url
            })
            localStorage.setItem('cachedFiles', JSON.stringify(self.cachedFiles))
        });
    },
    beforeDestroy () {
        this.uppy.close({ reason: 'unmount' })
    },
    computed: {
    },
    methods: {
    }
}
</script>

<style>

.uppy-Dashboard-overlay {
    width: 100vw !important;
}

.uppy-Dashboard-inner {
    width: 100vw !important;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
}

th {
    background-color: var(--surface-b);
    padding: 8px;
}

tr, td {
    overflow: auto;
    min-width: 230px;
}

td, th {
    border-top: 1px solid var(--surface-d);
    border-bottom: 1px solid var(--surface-d);
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: none;
}

</style>