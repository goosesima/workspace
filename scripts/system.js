system = {};
api = {};

system.user = 'user';

system.paths = {
    config: '/home/' + system.user + '/.config/',
    home: '/home/' + system.user + '/'
};

system.processes = [];

system.random = function () {
    return Math.floor(Math.random() * 100000000000000000);
}

system.exitProcess = function (id){
    for (var i = 0; i < system.processes.length; i++) {
        const p = system.processes[i];
        if(p.id === id) {
            if (p.process.exit) {
                p.process.exit();
            }
            p.process = null;
            system.processes.splice(i, 1);
        }
    }
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


system.sandbox = function (){
    // Sandboxer start
    var window = null, document = null, system = null, fs = null;
    // Sandboxer end
}

system.getSandbox = function (processId) {
    var str = String(system.sandbox).replace('function (){', '');
    str = str.substring(0, str.length - 1);
    str += '\n';
    if(processId){
        str = str.replaceAll('processId', processId);
    }
    return str;
}

system.createProcess = function (name, address, permissions){
    const id = system.random();
    var imports = [];
    if (permissions){
        for (var i = 0; i < permissions.length; i++) {
            const permission = permissions[i].toLowerCase();
            imports.push({
                name: permission,
                import: window[permission]
            });
        }
    }
    httpGetAsync(address, function(data){
        const code = system.getSandbox(id) + data;
        const p = Function(code)();
        var obj = {
            name: name,
            id: id,
            process: p
        };
        if(p){
            if(p.init){
                p.init(imports, api);
            }
            if(p.api){
                api[name] = p.api; // TODO: Anonymize (security vulnerability)
            }
        }
        system.processes.push(obj);
    });
    return id;
}

system.loadCSS = function (address, callback){
    if(document){
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = address;
        if(callback){
            style.onload = callback;
        }
        document.body.appendChild(style);
    }
}
system.loadScript = function (address, callback){
    if(document){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = address;
        if(callback){
            script.onload = callback;
        }
        document.getElementsByTagName('body')[0].appendChild(script);
    }else{
        console.log('TODO');
    }
}

system.exit = function (){
    console.log('System: Goodbye!');
    for (var i = 0; i < system.processes.length; i++) {
        const p = system.processes[i];
        system.exitProcess(p.id);
    }
}

system.init = function () {
    const scripts = ['wm', 'shell'];
    system.loadScript('scripts/fs.js', function(){
        for (var i = 0; i < scripts.length; i++) {
            const name = scripts[i];
            system.createProcess(name, 'scripts/' + name + '.js', ['SYSTEM', 'FS', 'DOCUMENT']);
            if (window[name]) {
                name.init();
            }
        }
        system.createProcess('terminal', 'scripts/terminal.js', ['FS', 'SYSTEM']);
    });
    if(window){
        window.onbeforeunload = system.exit;
    }
}

system.init();