const getLocalImage = (image) => {
    return new URL(`../assets/images/${image}`, import.meta.url).href;
}

export default {
    getLocalImage
}