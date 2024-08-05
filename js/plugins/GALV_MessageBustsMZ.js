//-----------------------------------------------------------------------------
//  Galv's Message Busts
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_MessageBustsMZ.js
//-----------------------------------------------------------------------------
//  2020-10-10 - Version 1.2 - added bust X and Y offsets to plugin settings
//                             fixed error in text command
//  2020-09-27 - Version 1.1 - fixed error in code when busts disabled and only
//                             on certain priority setting
//  2020-09-22 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_MessageBusts = true;

var Galv = Galv || {};        // Galv's main object
Galv.MB = Galv.MB || {};      // Plugin object
Galv.MB.pluginName = "GALV_MessageBustsMZ";

Galv.Mstyle = Galv.Mstyle || {};  // compatibility

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.2) 显示一个角色图像，而不是选择的脸孔图像
 * @url http://galvs-scripts.com
 * @target MZ
 * @author Galv
 * @orderAfter MessageStylesMZ
 *
 * @param bPriority
 * @text 角色图优先级
 * @desc 可以是0或1。0 = 角色图出现在消息窗口后面。1 = 角色图出现在其前面
 * @default 0
 *
 * @param bPosition
 * @text  角色图位置
 * @desc 可以是0或1。0 = 角色图出现在窗口消息上方。1 = 角色图出现在屏幕底部
 *
 * @param bX
 * @text 角色图X偏移
 * @desc 将角色图水平偏移这么多像素
 * @default 0
 *
 * @param bY
 * @text 角色图Y偏移
 * @desc 将角色图垂直偏移这么多像素
 * @default 0
 *
 * @param xOffset
 * @text 文本X偏移
 * @desc 当在左侧显示角色图时，文本向右推动的像素数。
 * @default 390
 *
 * @param fileAppend
 * @text 文件名附加
 * @desc 要附加到插件搜索的正常文件路径的文本。
 * @default
 *
 * @param mStyleBusts
 * @text 弹出窗口角色图
 * @desc 如果使用消息样式插件，在弹出窗口中显示角色图？true或false
 * @type boolean
 * @default false
 *
 *
 * @command bustPosition
 * @text 角色图对齐
 * @desc 
 *
 * @arg align
 * @text 角色图对齐
 * @type select
 * @desc 角色图的位置，左侧或右侧。
 * @default left
 * @option 左对齐
 * @value left
 * @option 右对齐
 * @value right
 *
 * @arg mirror
 * @text 角色图镜像
 * @type boolean
 * @default false
 * @desc 如果角色图从默认图像镜像（true或false）
 *
 *
 * @command bustStatus
 * @text 角色图状态
 * @desc 启用或禁用角色图功能。true为启用，false为禁用。
 *
 * @arg status
 * @text 启用角色图
 * @type boolean
 * @default true
 * @desc  true为启用角色图，false为禁用角色图
 *
 * @help
 *   Galv's Message Busts
 * ----------------------------------------------------------------------------
 * 该插件根据“显示文本”事件命令中选择的脸孔，在/img/pictures/文件夹中显示对应的角色图像。例如：
 * 如果您的“显示文本”使用了“Actor1”脸孔文件中的第二张脸图，那么插件将使用/img/pictures/Actor1_2.png作为角色图像
 *
 * 插件设置中的“文件名附加”
 * --------------------------------------------
 * 将此设置中放入的内容将添加到文件名的末尾。
 * 使用上述示例，如果“文件名附加”设置为“_bust”，那么插件将使用/img/pictures/Actor1_2_bust.png。
 *
 * 在不同角色图之间的消息中使用“等待”以获得更好的过渡效果。
 * 使用“插件”事件命令来更改角色图设置。这些设置将一直有效，直到再次更改，因此它们可以用于多个消息。
 *
 * NOTES
 * ------
 * 您需要自己找到要使用的角色图像。我无法为您提供帮助。演示中的图像仅用于演示目的。
 *
 * 所有文件名区分大小写，因此请确保对于您的脸孔和角色图使用正确的大写形式。
 *
 
 *
 * ----------------------------------------------------------------------------
 *   插件命令（用于更改角色图位置/可见性）
 * ----------------------------------------------------------------------------
 *
 *   角色图对齐 // right（右）或 left（左）以在右侧或左侧显示
 *
 *   角色图镜像 // 是否镜像角色图（true或false）
 *
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   文本转义代码（在“显示文本”期间）
 * ----------------------------------------------------------------------------
 * 注意：这些代码在使用Galv的消息样式插件的\pop消息中无法正确工作。只在普通显示消息框中使用。
 *
 * \BST[x]            // 在消息中间更改角色图。X是脸孔的编号，不更改脸孔名称

 *
 * \BST[x,face]       // 将角色图更改为不同的文件名
 *
 * ----------------------------------------------------------------------------
 * 示例：
 * 如果一个“显示文本”事件命令使用了“Actor1”的第3个脸孔...
 * \BST[7]  将继续使用“Actor1”脸孔文件，但将3更改为7
 * \BST[7,Actor2]   将更改脸孔文件为“Actor2”并使用脸孔7
 * ----------------------------------------------------------------------------
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

	Galv.MB.prio = Number(PluginManager.parameters(Galv.MB.pluginName)["bPriority"]);
	Galv.MB.pos = Number(PluginManager.parameters(Galv.MB.pluginName)["bPosition"]);
	Galv.MB.bX = Number(PluginManager.parameters(Galv.MB.pluginName)["bX"]);
	Galv.MB.bY = Number(PluginManager.parameters(Galv.MB.pluginName)["bY"]);
	Galv.MB.w = Number(PluginManager.parameters(Galv.MB.pluginName)["xOffset"]);
	Galv.MB.f = PluginManager.parameters(Galv.MB.pluginName)["fileAppend"];
	Galv.MB.popWindow = PluginManager.parameters(Galv.MB.pluginName)["mStyleBusts"] == "true" && Imported.Galv_MessageStyles;
	Galv.MB.msgWindow = null;
	Galv.MB.bustHeight = 0;
	
if (Galv.MB.prio == 1 && Galv.MB.pos == 0) {
	Galv.MB.prio = 0; // Change prio if settings are this
};

PluginManager.registerCommand(Galv.MB.pluginName, "bustPosition", args => {
	Galv.MB.bustPos(args.align,args.mirror == "true");
});

PluginManager.registerCommand(Galv.MB.pluginName, "bustStatus", args => {
	Galv.MB.bustStatus(args.status == "true");
});

Galv.MB.bustPos = function(pos,mirror) {
	if (pos == "left") {
		$gameSystem.bustPos = 0;
	} else if (pos == "right") {
		$gameSystem.bustPos = 1;
	};
	$gameSystem.bustMirror = mirror;
};

Galv.MB.bustStatus = function(status) {
	$gameSystem.bustDisable = !status;
};


// GAME SYSTEM
//-----------------------------------------------------------------------------

Game_System.prototype.isBustDisabled = function() {
	// More options for disabling busts here
	if (Galv.Mstyle.target && !Galv.MB.popWindow) return true;
	return this.bustDisable;
};


// WINDOW MESSAGE
//-----------------------------------------------------------------------------

Galv.MB.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
	Galv.MB.msgWindow = this;
	$gameSystem.bustPos = $gameSystem.bustPos || 0;
	$gameMessage.bustOffset = $gameMessage.bustOffset || Galv.MB.w;
	Galv.MB.Window_Message_startMessage.call(this);
	Galv.MB.msgWindow.tempPosType = this._positionType;
};

Galv.MB.Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'BST':
        this.obtainBustParam(textState);
        break;
    }
	Galv.MB.Window_Message_processEscapeCharacter.call(this, code, textState);
};

Window_Message.prototype.obtainBustParam = function(textState) {
    const arr = /^\[[^\]]*\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        const txt = arr[0].slice(1).slice(0, - 1);
		const array = txt.split(",");
		$gameMessage.setFaceImage(array[1] || $gameMessage._faceName,Number(array[0] - 1));
    } else {
        return '';
    }
};

Galv.MB.Window_Message_drawMessageFace = Window_Message.prototype.drawMessageFace;
Window_Message.prototype.drawMessageFace = function() {
	if (!$gameSystem.isBustDisabled()) return;
	Galv.MB.Window_Message_drawMessageFace.call(this);
};


// CONDITIONAL FUNCTIONS BASED ON SETTINGS
//-----------------------------------------------------------------------------

if (Galv.MB.prio == 0) {
// UNDER MESSAGE
	Galv.MB.Spriteset_Map_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
	Spriteset_Base.prototype.createUpperLayer = function() {
		Galv.MB.Spriteset_Map_createUpperLayer.call(this);
		this.createBusts();
	};
	
	// SPRITESET MAP CREATE MSG BG
	Spriteset_Base.prototype.createBusts = function() {
		// Create bust image
		if (this._msgBustSprite) return;
		this._msgBustSprite = new Sprite_GalvBust();
		this.addChild(this._msgBustSprite);
	};
	
	Galv.MB.Window_Message_newLineX = Window_Message.prototype.newLineX;
	Window_Message.prototype.newLineX = function(textState) {
		if ($gameSystem.isBustDisabled()) {
			return Galv.MB.Window_Message_newLineX.call(this,textState);
		} else {
			return Imported.Galv_MessageStyles ? Galv.Mstyle.padding[3] : 0;
		};
	};
	
} else {
// OVER MESSAGE
	
	// Add to window_message as child instead, so it displays above
	Galv.MB.Window_Message_initialize = Window_Message.prototype.initialize;
	Window_Message.prototype.initialize = function(rect) {
		Galv.MB.Window_Message_initialize.call(this,rect);
		if (this._msgBustSprite) return;
		this._msgBustSprite = new Sprite_GalvBust();
		this.addChild(this._msgBustSprite);
	};

	Galv.MB.Window_Message_newLineX = Window_Message.prototype.newLineX;
	Window_Message.prototype.newLineX = function(textState) {
		if ($gameSystem.isBustDisabled()) {
			return Galv.MB.Window_Message_newLineX.call(this,textState);
		} else if ($gameMessage.faceName() && Galv.MB.prio == 1 && $gameMessage._positionType == 2 && $gameSystem.bustPos == 0) {
			return $gameMessage.bustOffset;
		} else {
			return Imported.Galv_MessageStyles ? Galv.Mstyle.padding[3] : 0;
		};
	};

	Galv.MB.Window_Message_galvExtraWidths = Window_Message.prototype.galvExtraWidths;
	Window_Message.prototype.galvExtraWidths = function() {
		let w = Galv.MB.Window_Message_galvExtraWidths.call(this);
		if (!$gameSystem.isBustDisabled() && $gameMessage.faceName()) w += Galv.MB.w / 2;
		return w;
	};
};


// SPRITE GALVBUST
//-----------------------------------------------------------------------------

function Sprite_GalvBust() {
    this.initialize.apply(this, arguments);
}

Sprite_GalvBust.prototype = Object.create(Sprite.prototype);
Sprite_GalvBust.prototype.constructor = Sprite_GalvBust;

Sprite_GalvBust.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
	this.name = "";
	this.opacity = 0;
    this.update();
};

Sprite_GalvBust.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (Galv.MB.msgWindow) {
		this.controlBitmap();
		Galv.MB.bustHeight = this.height;
	} else {
		Galv.MB.bustHeight = 0;
	}
};

Sprite_GalvBust.prototype.loadBitmap = function() {
	const name = $gameMessage.faceName() + "_" + ($gameMessage.faceIndex() + 1);
	let img;
	if ($gameSystem.isBustDisabled()) {
		img = ImageManager.loadPicture('');
	} else {
		img = ImageManager.loadPicture(name + Galv.MB.f);
	};
	if (img.isReady()) {
		if (this.bitmap) {
			//this._destroyCachedSprite();
			this.bitmap = null;
		};
		this.bitmap = img;
		this.name = name;
		this.hasBust = true;
	};
};

Sprite_GalvBust.prototype.controlBitmap = function() {
	if ($gameMessage.faceName() && this.name !== $gameMessage.faceName() + "_" + ($gameMessage.faceIndex() + 1)) {
    	this.loadBitmap();  // If image changed, reload bitmap
	};
	
	if (Galv.MB.msgWindow.openness <= 0 || !this.hasBust || $gameSystem.isBustDisabled()) {
		this.opacity = 0;
		this.name = "";
		this.hasBust = false;
		return;
	};
	
	

	this.opacity = $gameMessage.faceName() ? Galv.MB.msgWindow._openness : this.opacity - 32;
	
	// Y POSITION
	switch (Galv.MB.msgWindow.tempPosType) {
	case 0:
		this.y = this.baseY() + Galv.MB.bY;
		break;
	case 1:
	//top and middle
		this.y =  this.baseY() - Galv.MB.msgWindow.y + Galv.MB.bY;
		break;
	case 2:
	//bottom
		if (Galv.MB.prio == 1) {
			this.y = Galv.MB.msgWindow.height - this.bitmap.height;
		} else if (Galv.MB.pos === 1) {
			this.y = this.baseY();
		} else {
			this.y = this.baseY() - Galv.MB.msgWindow.height;
		};
		
		this.y += Galv.MB.bY; // modify by plugin setting offset Y
		break;
	};
	
	// X POSITION
	let offset = 0;
	if ($gameSystem.bustMirror) {
		this.scale.x = -1;
		offset = this.bitmap.width;
	} else {
		this.scale.x = 1;
		offset = 0;
	};
	
	if ($gameSystem.bustPos == 1) {
		// if on the right
		offset -= Galv.MB.bX; // modify by offset in plugin settings
		
		if (Galv.MB.prio == 1) {
			this.x = Galv.MB.msgWindow.width - this.bitmap.width + offset;
		} else {
			this.x = Galv.MB.msgWindow.x + Galv.MB.msgWindow.width - this.bitmap.width + offset;
		};
	} else {
		// else on the left
		offset += Galv.MB.bX; // modify by offset in plugin settings
		
		if (Galv.MB.prio == 1) {
			this.x = 0 + offset;
		} else {
			this.x = Galv.MB.msgWindow.x + offset;
		};
	};
};

Sprite_GalvBust.prototype.baseY = function() {
	return Galv.MB.msgWindow.y + Galv.MB.msgWindow.height - this.bitmap.height;
};