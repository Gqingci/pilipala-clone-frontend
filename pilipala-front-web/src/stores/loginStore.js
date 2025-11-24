import { defineStore } from 'pinia'

const useLoginStore = defineStore('loginstate', {
    state: () => {
        return {
            showLogin: false,
            userInfo: {

            },
            devideId: null,
            messageNoReadCount: 0
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
        },
        saveMessageNoReadCount(count) {
            this.messageNoReadCount = count;
        },
        readMessageCount(count) {
            this.messageNoReadCount -= count;
        }
    }
})

export {
    useLoginStore
}