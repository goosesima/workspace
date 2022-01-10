var wm = {};
var apiWm = {};

wm.config = {
    backgroundImage: null
};

wm.exit = function(){
    wm.fs.writeFileSync(wm.configPath, JSON.stringify(wm.config), 'utf8');
}

wm.init = function (imports){
    // Import implementation
    for (var i = 0; i < imports.length; i++) {
        const permission = imports[i];
        wm[permission.name] = permission.import;
    }
    wm.windows = [];
    wm.configPath = wm.system.paths.config + '/wm.json';
    const config = wm.fs.readFileSync(wm.configPath, 'utf8');
    if(config){
        var cfg;
        try {
            cfg = JSON.parse(config);
        } catch (error) {
            
        }
        if(cfg){
            wm.config = Object.assign(wm.config, cfg);
        }
    }
    if(wm.config.backgroundImage){
        apiWm.setBackground(wm.config.backgroundImage);
    }
    var space = wm.document.createElement('div');
    space.className = 'wm-space';
    wm.document.body.appendChild(space);
    wm.system.loadCSS('styles/wm.css');
    wm.space = space;
}

apiWm.createElement = function (name){
    if(name == 'script') return
    if(name == 'style') return
    return wm.document.createElement(name);
}
apiWm.createWindow = function (name){
    var win = wm.document.createElement('div');
    win.className = 'wm-window';
    var content = wm.document.createElement('div');
    content.className = 'wm-content';
    var bar = wm.document.createElement('div');
    bar.className = 'wm-bar';
    var closeButton = wm.document.createElement('p');
    closeButton.innerText = '❌';
    closeButton.className = 'wm-closeButton';
    var hideButton = wm.document.createElement('p');
    hideButton.innerText = '━';
    hideButton.className = 'wm-hideButton';
    var title = wm.document.createElement('p');
    bar.style.cursor = 'grab';
    title.ondragstart = title.onselectstart = function(){
        return false;
    }
    title.innerText = name;
    bar.appendChild(title);
    bar.appendChild(hideButton);
    bar.appendChild(closeButton);
    win.appendChild(bar);
    win.appendChild(content);
    wm.space.appendChild(win);
    wm.windows.push({
        name: name,
        win: win,
        id: wm.system.random()
    });

    let currentDroppable = null;

    bar.onmousedown = function (event) {

        bar.style.cursor = 'grabbing';

        let shiftX = event.clientX - win.getBoundingClientRect().left;
        let shiftY = event.clientY - win.getBoundingClientRect().top;


        wm.document.body.append(win);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            win.style.left = pageX - shiftX + 'px';
            win.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            if(event.pageX < shiftX) return;
            if(event.pageY < shiftY) return;
            // console.log(shiftX);
            moveAt(event.pageX, event.pageY);
        }

        wm.document.addEventListener('mousemove', onMouseMove);

        wm.document.onmouseup = function () {
            wm.document.removeEventListener('mousemove', onMouseMove);
            bar.style.cursor = 'grab';
            win.onmouseup = null;
        };

    };

    return {
        add: function (element) {
            content.appendChild(element);
        }
    };
}

apiWm.setBackground = function (imgAddress){
    wm.document.body.style.backgroundImage = 'url(' + imgAddress + ')';
    wm.config.backgroundImage = imgAddress;
}

try{
    return { exit: wm.exit, init: wm.init, api: apiWm };
}catch(error){
    console.log('You can not run wm.js in this environment!');
}