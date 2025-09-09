export enum WEB_RENDER_TYPES { 
    DEFAULT,
    YOUTUBE,
}

export const detectWebRenderType = (url: string) : WEB_RENDER_TYPES => {
    if(url.toLowerCase().includes("//www.youtube.com")){
        return WEB_RENDER_TYPES.YOUTUBE;
    }
    return WEB_RENDER_TYPES.DEFAULT;
}
