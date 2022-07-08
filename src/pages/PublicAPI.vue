<template>
    <div>
        <h1>Public API</h1>
        <p>This is a public API page.</p>
        <dashboard :uppy="uppy" :plugins="['Webcam']" :props="{theme: 'light'}" />
    </div>
</template>

<script>
import { Dashboard } from '@uppy/vue'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'
import DragDrop from '@uppy/drag-drop'
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
                debug: true,
                autoProceed: true,
                restrictions: {
                }
            })
        }
    },
    mounted() {
        this.uppy.use(Webcam, {
            target: this.$refs.uppy,
            width: 640,
            height: 480,
            facingMode: 'user'
        })
        this.uppy.on('upload', (file) => {
            console.log(file)
        })
        this.uppy.on('complete', (result) => {
            console.log('successful files:', result.successful)
            console.log('failed files:', result.failed)
        })
        this.uppy.use(DragDrop, {
        });
        this.uppy.use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' });
        this.uppy.on('upload-success', function (file, response) {
            var url = response.uploadURL
            var fileName = file.name

            console.log(url, fileName)
        });
    },
    beforeDestroy () {
        this.uppy.close({ reason: 'unmount' })
    },
    computed: {
    },
    methods: {
        uploadFile() {
            
        }
    }
}
</script>

<style>

</style>