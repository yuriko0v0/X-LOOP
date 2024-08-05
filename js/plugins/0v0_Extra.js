//-----------------------------------------------------------------------------
//文本位置偏移
//-----------------------------------------------------------------------------
Window_Message.prototype.startMessage = function() {
    const text = $gameMessage.allText();
    const textState = this.createTextState(text, 0, 0, 0);
    textState.x = this.newLineX(textState) + 60;
    textState.startX = textState.x;
    this._textState = textState;
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
    this._nameBoxWindow.start();
};

//-----------------------------------------------------------------------------
//读档修复
//-----------------------------------------------------------------------------
Scene_Load.prototype.onLoadSuccess = function() {
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
    $gameSystem.onAfterLoad();
};


//-----------------------------------------------------------------------------
//菜单改为公共事件
//-----------------------------------------------------------------------------
// 替换菜单键插件

(function() {
    // 替换菜单键的功能
    Scene_Map.prototype.isMenuEnabled = function() {
        return false; // 禁用原有的菜单功能
    };

    // 监听键盘按键事件
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.processMapSceneMenu(); // 处理按键事件
    };

    // 处理按键事件
    Scene_Map.prototype.processMapSceneMenu = function() {
        if (Input.isTriggered('escape') || Input.isTriggered('cancel')) {
            $gameTemp.reserveCommonEvent(12); // 执行公共事件12
        }
    };
})();



//-----------------------------------------------------------------------------
//文字描边
//-----------------------------------------------------------------------------
Bitmap.prototype.initialize = function(width, height) {
	
    this._canvas = null;
    this._context = null;
    this._baseTexture = null;
    this._image = null;
    this._url = "";
    this._paintOpacity = 255;
    this._smooth = true;
    this._loadListeners = [];

    // "none", "loading", "loaded", or "error"
    this._loadingState = "none";

    if (width > 0 && height > 0) {
        this._createCanvas(width, height);
    }

    /**
     * The face name of the font.
     *
     * @type string
     */
    this.fontFace = "sans-serif";

    /**
     * The size of the font in pixels.
     *
     * @type number
     */
    this.fontSize = 16;

    /**
     * Whether the font is bold.
     *
     * @type boolean
     */
    this.fontBold = false;

    /**
     * Whether the font is italic.
     *
     * @type boolean
     */
    this.fontItalic = false;

    /**
     * The color of the text in CSS format.
     *
     * @type string
     */
    this.textColor = "#ffffff";

    /**
     * The color of the outline of the text in CSS format.
     *
     * @type string
     */
    this.outlineColor = "rgba(0, 0, 0, 1)";

    /**
     * The width of the outline of the text.
     *
     * @type number
     */
    this.outlineWidth = 5;
};