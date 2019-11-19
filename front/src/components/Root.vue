<template>
<div class="container">
    <div id="app">

        <h1>Judgement day cloud</h1>

        <p v-if="debug">servers: {{ servers }}</p>
        <p v-if="debug">data: {{ data }}</p>

        <hr>

        <div class="server" v-for="server in data">
            <h2 :class="{
                'dead': server.status == 'dead' || server.status == 'off',
                'sync': server.status == 'sync',
                'outdate': server.status == 'outdate',
                'ready': server.status == 'ready',
            }">
                {{ server.link }}
            </h2>
            <p>time: {{ server.time }}</p>
            <p>data: {{ server.data }}</p>
            <p>status: {{ server.status }}</p>
            <div class="buttons">
                <button v-if="server.status != 'dead' && server.status != 'off'" @click="setData(server)">Set data</button>
                <button v-if="server.status != 'dead' && server.status != 'off'" @click="shutdown(server)">Shut down</button>
                <button v-if="server.status == 'off'"  @click="loadServer(server)">Start</button>
            </div>
            <hr>
        </div>

    </div>
</div>
</template>


<script>

import axios from 'axios'
import $ from 'jquery'
import config from '../../../config'

export default {
    data() {
        return {
            servers: config.servers,
            data: [],
            debug: false,
            updatePeriod: 500,
            lazyUpdatePeriod: 3000,
        }
    },
    computed: {
    },
    components: {
    },
    methods: {
        observer() {
            var that = this
            this.data.forEach(server => {
                if( server.status == 'dead'    ) that.loadServer(server)
                if( server.status == 'sync'    ) that.syncServer(server)
                if( server.status == 'outdate' ) that.updateServer(server)
            })
        },
        lazyObserver() {
            var that = this
            this.data.forEach(server => {
                if( server.status == 'ready' ) that.testServer(server)
            })
        },
        testServer(server) {
            axios({
                method: 'get',
                url: server.link + '?action=ping',
            })
            .then(res => {
                server.status = "sync"
            })
            .catch(err => {
                server.status = "dead"
            })
        },
        loadServer(server) {
            if (this.debug) console.log("LOAD SERVER", server.link)
            axios({
                method: 'get',
                url: server.link + '?action=load',
            })
            .then(res => {
                let isNotJson = false
                try {
                    let parsed = JSON.parse(res.data)
                }
                catch (e) {
                    if( e instanceof SyntaxError ) {
                        isNotJson = true
                    }
                }
                if( isNotJson ) {
                    server.time = -1
                    server.data = []
                    server.status = 'sync'
                } else {
                    let parsed = JSON.parse(res.data)
                    server.time = parsed.time
                    server.data = parsed.data
                    server.status = 'sync'
                }
            })
            .catch(function(error) {
                server.time = -1
                server.data = []
                server.status = 'dead'
            })
        },
        syncServer(server) {
            if (this.debug) console.log("SYNC SERVER",server.link)
            var donor = this.findDonor()
            if( server.time == donor.time ) {
                server.status = 'ready'
            } else {
                server.status = 'outdate'
            }
        },
        findDonor() {
            if (this.debug) console.log("FIND DONOR")
            var donor = {}
            var maxtime = 0
            this.data.forEach((server) => {
                if( server.time > maxtime ) maxtime = server.time
            })
            this.data.forEach((server) => {
                if( server.time == maxtime ) {
                    donor = server
                }
            })
            return Object.assign({}, donor);
        },
        updateServer(server) {
            if (this.debug) console.log("UPDATE SERVER")
            var donor = this.findDonor()
            delete donor.link
            delete donor.status
            let donorData = JSON.stringify(donor)
            $.ajax({
                type: "POST",
                url: server.link + '?action=save',
                async: false,
                data: {
                    data: donorData
                },
                success: function(res) {
                    server.status = 'dead'
                }
            });
        },
        shutdown(server) {
            server.status = 'off'
        },
        setData(server) {
            server.time = Date.now()
        }
    },
    mounted() {
        var that = this
        that.data = []
        this.servers.forEach(server => {
            that.data.push({
                link: server,
                time: null,
                data: null,
                status: 'dead',
                needUpdate: null
            })
        })
        setInterval(function(){
            that.observer()
        }, that.updatePeriod);
        setInterval(function(){
            that.lazyObserver()
        }, that.lazyUpdatePeriod);
    },
    created() {
    }
}
</script>
