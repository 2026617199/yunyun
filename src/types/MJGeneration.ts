export interface submitMjImagineResponse {
    /**
     * 状态码，1(提交成功), 22(排队中), 23(队列已满，请稍后尝试),24(prompt包含敏感词),other(错误)
     */
    code: number;
    /**
     * 描述
     */
    description: string;
    /**
     * 任务id
     */
    result: string;
    [property: string]: any;
}



/**
 * Request
 */
export interface fetchMjTaskResponse {
    /**
     * 任务类型，可用值:IMAGINE,UPSCALE,VARIATION,ZOOM,PAN,DESCRIBE,BLEND,SHORTEN,SWAP_FACE
     */
    action: string;
    /**
     * 按钮数组，图片下方对应的各个按钮数组，需要点击按钮的时候，把customId传给action接口即可
     */
    buttons: Button[];
    /**
     * 任务耗费积分
     */
    cost: number;
    /**
     * 描述
     */
    description: string;
    /**
     * 失败原因
     */
    failReason: null;
    /**
     * 结束时间
     */
    finishTime: number;
    /**
     * 任务id
     */
    id: string;
    /**
     * 图片地址
     */
    // imageUrls: string[]; 这里的图片展示不出来，但是test里面的是可以展示出来的
    imageUrl: string;
    /**
     * 任务进度
     */
    progress: string;
    /**
     * 提示词
     */
    prompt: string;
    /**
     * 提示词英文
     */
    promptEn: string;
    /**
     * 额外信息，任务的额外信息
     */
    properties: Properties;
    /**
     * 种子值，任务的种子值，没有的时候需要执行seed接口获取，可用于生成相似的图片
     */
    seed: string;
    /**
     * 开始执行时间
     */
    startTime: number;
    /**
     * 自定义参数
     */
    state: string;
    /**
     * 任务状态，可用值:NOT_START,SUBMITTED,MODAL,IN_PROGRESS,FAILURE,SUCCESS,CANCEL
     */
    status: string;
    /**
     * 提交时间
     */
    submitTime: number;
    [property: string]: any;
}

export interface Button {
    /**
     * customId，customId对应具体的按钮，执行action接口的时候，需要传对应的参数
     */
    customId: string;
    /**
     * 图标，按钮对应图标
     */
    emoji: string;
    /**
     * 文本，按钮对应文本
     */
    label: string;
    /**
     * 样式，按钮对应样式
     */
    style: number;
    /**
     * 类型，按钮对应类型
     */
    type: number;
    [property: string]: any;
}

/**
 * 额外信息，任务的额外信息
 */
export interface Properties {
    botType: string;
    discordChannelId: string;
    discordInstanceId: string;
    finalPrompt: string;
    flags: number;
    messageContent: string;
    messageHash: string;
    messageId: string;
    nonce: string;
    notifyHook: string;
    progressMessageId: string;
    [property: string]: any;
}