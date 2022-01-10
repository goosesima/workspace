var test = {
    init: function (imports, api){
        var win = api.wm.createWindow('Application Demo');
        var text = api.wm.createElement('p');
        text.innerText = 'Hello World!';
        win.add(text);
    },
    exit: function(){

    }
}
try {
    return { exit: test.exit, init: test.init };
} catch (error) {
    console.log('Hello World!');
}