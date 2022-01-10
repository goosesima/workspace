class FS {
    constructor(type){
        var vfs = {
            type: 0,
            filesystem: {},
            typesAvailable: { localStorage: 0, memory: 1 },
            nameStorage: 'workspace'
        };
        if(type){
            type = Number(type) || 1;
        }
        if (vfs.type == vfs.typesAvailable.localStorage) {
            const tempfs = localStorage[vfs.nameStorage];
            if (tempfs) {
                vfs.filesystem = JSON.parse(tempfs);
            }
        }
        if (typeof vfs.filesystem != 'object') {
            vfs.filesystem = {};
        }
        vfs.timestamp = function () {
            var now = new Date;
            var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
            return utc_timestamp;
        }
        vfs.action = function (path, data) {
            var c = vfs.filesystem;
            const array = path.split('/');
            let obj = c;
            for (let i = 0; i < array.length; i++) {
                const dir = array[i];
                if (!obj[dir]) {
                    obj[dir] = {};
                }
                if (((array.length - 1) == i) && data) {
                    obj[dir] = { data: data, time: vfs.timestamp() };
                } else {
                    obj = obj[dir];
                }
            }
            if (data) {
                if (vfs.type === vfs.typesAvailable.localStorage) {
                    localStorage[vfs.nameStorage] = JSON.stringify(vfs.filesystem);
                }
            };
            if (obj) {
                if (obj.data) {
                    const data = obj.data;
                    return data;
                }
            }
        }
        this.writeFileSync = function (path, data, config) {
            this.writeFile(path, data, config);
        }
        this.writeFile = function (path, data, config, callback) {
            vfs.action(path, data);
            if (callback) {
                callback();
            }
        }
        this.readFileSync = function (path, config) {
            return this.readFile(path, config);
        }
        this.readFile = function (path, config, callback) {
            const data = vfs.action(path);
            if (callback) {
                callback(data);
            } else {
                return data;
            }
        }
    }
}

if (typeof fs == 'undefined'){
    window.fs = fs = new FS();
}