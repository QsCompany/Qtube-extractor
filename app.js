"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="./interfaces.d.ts" />
const http = __importStar(require("http"));
const googleapis = __importStar(require("googleapis"));
const fs = __importStar(require("fs"));
const url = __importStar(require("url"));
const appx_1 = require("./appx");
let authorize;
let token;
var MyYoutube;
(function (MyYoutube) {
    function getVideoInfo(video_id, callback, vd) {
        let url = "https://www.youtube.com/get_video_info?html5=1&video_id=" + video_id + "&cpn=DiI28mNSwfItbdhK&eurl=https%3A%2F%2Fvideo.genyoutube.net%2Fj3XpfBChLyk&el=embedded&hl=en_US&sts=17915&lact=150684&c=WEB_EMBEDDED_PLAYER&cver=20190119&cplayer=UNIPLAYER&cbr=Chrome&cbrver=71.0.3578.98&cos=Windows&cosver=10.0&width=780&height=439&splay=1&authuser=0&ei=mFJIXJ3kFs_MV8iQhZgO&iframe=1&embed_config=%7B%7D&co_rel=1&ancestor_origins=https%3A%2F%2Fvideo.genyoutube.net";
        appx_1.getUrl(url, (err, data) => {
            callback(err, appx_1.compressVideoInfo(data && appx_1.toObject(data.split('&')), vd));
        });
    }
    MyYoutube.getVideoInfo = getVideoInfo;
    function getAllPlayListItems(auth, playlistId, callback) {
        let rslt = [];
        let info;
        getPlayListInfo(auth, playlistId, void 0, (val) => {
            info = val.items.length && val.items[0].snippet;
            callback1(void 0);
        });
        function callback1(p) {
            if (p)
                rslt.push(p.data);
            if (!p || p.data.nextPageToken)
                return getPlayListItems(auth, playlistId, p && p.data.nextPageToken, callback1);
            getAllVideoUrls(playlistId, rslt, info, callback);
            //callback(rslt);
        }
        // callback1(void 0);
    }
    MyYoutube.getAllPlayListItems = getAllPlayListItems;
    function getPlayListItems(auth, playlist, page, callback) {
        var service = googleapis.google.youtube('v3');
        return service.playlistItems.list({
            maxResults: 50,
            auth: auth,
            part: 'snippet,contentDetails',
            pageToken: page,
            playlistId: playlist || 'PLJFQaBvGIKsIvYocA2S19_9ypV8pK1aXI'
        }).then(callback);
    }
    MyYoutube.getPlayListItems = getPlayListItems;
    function getPlayListInfo(auth, playlistId, page, callback) {
        var service = googleapis.google.youtube('v3');
        service.playlists.list({
            maxResults: 50,
            auth: auth,
            part: 'snippet,contentDetails',
            pageToken: page,
            id: playlistId || 'PLJFQaBvGIKsIvYocA2S19_9ypV8pK1aXI'
        }).then((v) => {
            callback(v.data);
        });
    }
})(MyYoutube || (MyYoutube = {}));
function getVideoUrls(video_id, callback) {
    MyYoutube.getVideoInfo(video_id, (err, data) => {
        callback(err, data);
    }, void 0);
}
exports.getVideoUrls = getVideoUrls;
function getAllVideoUrls(playlistId, playlist, info, callback) {
    var _playlist = appx_1.compressPlayList(playlistId, info, playlist);
    var result = _playlist.videos;
    var item = -1;
    var onlive = 6;
    function getNextItem() {
        item = ++item;
        if (item < result.length)
            return result[item];
        onlive--;
        if (onlive == 0)
            callback(_playlist);
        return undefined;
    }
    function getUrlsOf(videoItem) {
        if (videoItem == void 0)
            return;
        MyYoutube.getVideoInfo(videoItem.id, () => {
            //compressVideoInfo(data, videoItem);
            getUrlsOf(getNextItem());
        }, videoItem);
    }
    var t = onlive;
    while (t--)
        getUrlsOf(getNextItem());
}
exports.getAllVideoUrls = getAllVideoUrls;
function startServer(token, authorize) {
    http.createServer((req, res) => {
        if (!req || !req.url)
            return;
        var urls = req.url.split('/')[1];
        if (!urls)
            return res.end();
        var rurl = url.parse(req.url);
        var query = {};
        (rurl.query || "").split('&').forEach((v) => {
            var c = v.split('=');
            query[c[0]] = c[1];
        });
        if (query.playlist || query.video)
            authorize(token, (auth) => {
                var d = Date.now();
                var e;
                if (query.playlist)
                    MyYoutube.getAllPlayListItems(auth, query.playlist, (f) => {
                        saveFileTo(['store', f.channelTitle || ('channel-' + f.channelId)], (f.title || ('playlist' + f.id)) + '.json', f, () => { });
                        console.log(d, e = Date.now(), e - d);
                        res.write(JSON.stringify(f));
                        res.end();
                    });
                else if (query.video)
                    MyYoutube.getVideoInfo(query.video, (err, data) => {
                        res.write(JSON.stringify(data));
                        res.end();
                    }, void 0);
            });
    }).listen(parseInt(global.process.execArgv[0]) || 80);
}
exports.startServer = startServer;
appx_1.initialize((_token, _authorize) => {
    authorize = _authorize;
    token = _token;
    startServer(token, authorize);
});
function vaidatePath(path) {
    let unvalid_chars = /[\\\<\>\*\!\/\:\?\"\|]+/;
    while (path.match(unvalid_chars))
        path = path.replace(unvalid_chars, '_');
    return path;
}
function saveFileTo(path, file, json, callback) {
    for (let i = 0; i < path.length; i++)
        path[i] = vaidatePath(path[i]);
    var cpath = "./" + (path.length ? path.join('/') + '/' : '');
    file = vaidatePath(file);
    try {
        if (!fs.existsSync(cpath))
            fs.mkdirSync(cpath, { recursive: true });
    }
    catch (e) { }
    cpath += file;
    appx_1.saveJson(json, cpath, callback);
}
