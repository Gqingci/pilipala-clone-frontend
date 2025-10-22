import { defineStore } from 'pinia'

const useLoginStore = defineStore('loginstate', {
    state: () => {
        return {
            showLogin: false,
            userInfo: {

            },
            devideId: null
        }
    },
    actions: {
        setLogin(show) {
            this.showLogin = show
        },
        saveUserInfo(info) {
            this.userInfo = info;
        },
        saveDeviceId(deviceId) {
            this.devideId = deviceId;
        }
    }
})

export {
    useLoginStore
}