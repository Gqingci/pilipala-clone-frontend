import moment from 'moment'

const getLocalImage = (image) => {
    return new URL(`../assets/images/${image}`, import.meta.url).href;
}

const formatDate = (timestamp) => {
    const now = moment();
    const time = moment(timestamp);
    const diffMinutes = now.diff(time, "minutes");
    const diffHours = now.diff(time, "hours");
    const diffDays = now.diff(time, "days");

    // 1小时内：xx分钟前
    if (diffMinutes < 60) {
        return diffMinutes <= 0 ? "刚刚" : `${diffMinutes} 分钟前`;
    }

    // 一天内：xx小时前
    if (diffHours < 24) {
        return `${diffHours} 小时前`;
    }

    // 昨天
    if (diffDays === 1) {
        return "昨天";
    }

    // 2天～7天：xx天前
    if (diffDays >= 2 && diffDays < 7) {
        return `${diffDays} 天前`;
    }

    // 超过7天
    // 如果不是本年 -> 显示 YYYY-MM-DD
    // 如果是本年 -> 显示 MM-DD
    if (now.year() !== time.year()) {
        return time.format("YYYY-MM-DD");
    } else {
        return time.format("MM-DD");
    }
};

const getFileName = (fileName) => {
    if (!fileName) {
        return fileName;
    }
    return fileName.lastIndexOf(".") == -1 ? fileNmae : fileName.substring(0, fileName.lastIndexOf("."));
}

const size2Str = (limit) => {
    var size = "";
    if (limit < 0.1 * 1024) {                     // 小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B";
    } else if (limit < 1024 * 1024) {             // 小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 1024 * 1024 * 1024) {      // 小于1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else {                                       // 其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    var sizeStr = size + "";                      // 转成字符串
    var index = sizeStr.indexOf(".");            // 获取小数点处的索引
    var dou = sizeStr.substring(index + 1, index + 3); // 获取小数点后两位的值

    if (dou == "00") {                            // 判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
    }
    return size;
};

const convertSecondsToHMS = (seconds) => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    }
}

const resetHtmlContent = (data)=> {
    if(!data) {
        return data;
    }
    data = data.replace(/\r\n/g, "<br>");
    data = data.replace(/\n/g, "<br>");
    return data;
}

export default {
    getLocalImage,
    getFileName,
    convertSecondsToHMS,
    size2Str,
    formatDate,
    resetHtmlContent
}