import Request from "./Request";

const Api = {
    sourcePath: "/api/file/getResource?sourceName=",
    checkCaptcha: "/account/captcha",
    login: "/account/login",
    uploadImage: "/file/uploadImage",
    
    //分类
    loadCategory: "/category/loadCategory",
    saveCategory: "/category/saveCategory",
    delCategory: "/category/delCategory",
    changeCategorySort: "/category/changeSort",
    
    //视频
    loadVideo: "/video/loadVideoList",
    loadVideoPList: "/video/loadVideoPList",
    
    //推荐视频
    recommendVideo: "/video/recommendVideo",
    
    //互动
    loadComment: "/interact/loadComment",
    delComment: "/interact/delComment",
    
    //弹幕
    loadDanmu: "/interact/loadDanmu",
    delDanmu: "/interact/delDanmu",
    
    //用户管理
    loadUser: "/user/loadUser",
    changeStatus: "/user/changeStatus",
    
    //视频资源
    getVideoResource: "/api/file/videoResource",
    auditVideo: "/video/auditVideo",
    deleteVideo: "/video/delVideo",
    
    //设置
    getSetting: "/setting/getSetting",
    saveSetting: "/setting/saveSetting",
    
    //首页统计数据
    getActualTimeStatisticsInfo: "/index/getActualTimeStatisticsInfo",
    getWeekStatisticsInfo: "/index/getWeekStatisticsInfo"
}

//上传封面
const uploadImage = async (file, createThumbnail = false) => {
    let result = await Request({
        url: Api.uploadImage,
        params: {
            file,
            createThumbnail
        },
    })
    if (!result) {
        return;
    }
    return result.data;
}

const doUserAction = async (config, callback) => {
    let result = await Request({
        url: Api.userAction,
        params: config,
        showLoading: true,
    })
    if (!result) {
        return;
    }
    callback()
}

export {
    Api,
    uploadImage,
    doUserAction
}