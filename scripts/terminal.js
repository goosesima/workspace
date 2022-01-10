var terminal = {
    lines: [],
    log: function(text, api) {
        var line = api.wm.createElement('p');
        terminal.lines.push(line);
        line.innerText = text;
        terminal.display.appendChild(line);
    },
    clear: function(api) {
        for (var i = 0; i < terminal.lines.length; i++) {
            terminal.display.removeChild(terminal.lines[i]);
            terminal.lines.splice(i, 1);
        }
    },
    init: function (imports, api) {
        // Import implementation
        for (var i = 0; i < imports.length; i++) {
            const permission = imports[i];
            terminal[permission.name] = permission.import;
        }

        var win = api.wm.createWindow('Terminal');
        terminal.display = api.wm.createElement('div');
        win.add(terminal.display);
        var input = api.wm.createElement('input');
        input.onkeydown = function (e) {
            if (e.key == 'Enter'){
                terminal.log(terminal.system.user + ' in ' + api.shell.getPath() + ' > ' + input.value, api);
                if (input.value == 'clear'){
                    terminal.clear();
                    return;
                }
                const out = api.shell.command(input.value);
                terminal.log(out, api);
            }
        }
        win.add(input);
    },
    exit: function () {

    }
}
try {
    return { exit: terminal.exit, init: terminal.init };
} catch (error) {
    console.log('Hello World!');
}