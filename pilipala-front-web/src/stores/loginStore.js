import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const useLoginStore = defineStore('loginstate', {
    state: () => {
        return {
            showLogin: false,
            userInfo: {

            }
        }
    },
    acitons: {
        setLogin() {
            this.showLogin = show
        },
        saveUserInfo(info) {
            this.userInfo = info;
        }
    }
})

export {
    useLoginStore
}