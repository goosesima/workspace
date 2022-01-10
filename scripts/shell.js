var shell = {};
var shellApi = {};

shellApi.getPath = function (){
    return shell.path;
}

shellApi.command = function (command) {
    var args = command.split(' ');
    const name = args[0];
    switch (name) {
        case 'ls':
            
            break;
        
        default:
            return 'Unknown command!'
    }
}

shell.init = function (imports, api){
    // Import implementation
    for (var i = 0; i < imports.length; i++) {
        const permission = imports[i];
        shell[permission.name] = permission.import;
    }
    shell.path = shell.system.paths.home;

}

try {
    return { exit: shell.exit, init: shell.init, api: shellApi };;
} catch (error) {
    console.log('Hello World!');
}