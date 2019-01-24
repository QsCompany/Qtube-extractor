///<reference path="./interfaces.d.ts" />
import * as http from 'http';
import * as googleapis from 'googleapis';
import * as fs from "fs";
import * as url from 'url';
import { initialize, toObject, getUrl, saveJson, compressVideoInfo, compressPlayList, IPlayListInfo, IVideo } from './appx';
import * as ais from './interfaces';
import { IPlayListResultItems, IVideoInfo } from './interfaces';
let authorize: (credentials: any, callback: Function) => void;
let token: any;

module MyYoutube {
    export function getVideoInfo(video_id: string, callback: (err: boolean, data: IVideo) => void, vd: IVideo) {
        let url = "https://www.youtube.com/get_video_info?html5=1&video_id=" + video_id + "&cpn=DiI28mNSwfItbdhK&eurl=https%3A%2F%2Fvideo.genyoutube.net%2Fj3XpfBChLyk&el=embedded&hl=en_US&sts=17915&lact=150684&c=WEB_EMBEDDED_PLAYER&cver=20190119&cplayer=UNIPLAYER&cbr=Chrome&cbrver=71.0.3578.98&cos=Windows&cosver=10.0&width=780&height=439&splay=1&authuser=0&ei=mFJIXJ3kFs_MV8iQhZgO&iframe=1&embed_config=%7B%7D&co_rel=1&ancestor_origins=https%3A%2F%2Fvideo.genyoutube.net"
        getUrl(url, (err, data) => {
            callback(err, compressVideoInfo(data && toObject(data.split('&')), vd));
        });
    }
    export function getAllPlayListItems(auth: any, playlistId: any, callback: (data: IPlayListInfo) => void) {
        let rslt: ais.IPlayListResultItems[] = [];
        let info: googleapis.youtube_v3.Schema$PlaylistSnippet;
        getPlayListInfo(auth, playlistId, void 0, (val: googleapis.youtube_v3.Schema$PlaylistListResponse) => {
            info = val.items.length && val.items[0].snippet;
            callback1(void 0);
        });
        function callback1(p: any): any {
            if (p) rslt.push(p.data);
            if (!p || p.data.nextPageToken)
                return getPlayListItems(auth, playlistId, p && p.data.nextPageToken, callback1);
            getAllVideoUrls(playlistId, rslt, info, callback);
            //callback(rslt);
        }
        // callback1(void 0);

    }


    export function getPlayListItems(auth: any, playlist: any, page: any, callback: (p: any) => any) {
        var service = googleapis.google.youtube('v3');

        return service.playlistItems.list({
            maxResults: 50,
            auth: auth,
            part: 'snippet,contentDetails',
            pageToken: page,
            playlistId: playlist || 'PLJFQaBvGIKsIvYocA2S19_9ypV8pK1aXI'
        }).then(callback);
    }
    function getPlayListInfo(auth: any, playlistId: string, page: any, callback: (p: any) => any) {
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
}
export function getVideoUrls(video_id: string, callback: (err: boolean, data: IVideoInfo) => void) {
    MyYoutube.getVideoInfo(video_id, (err, data) => {
        callback(err, data as any);
    }, void 0);
}
export declare type Schema$PlaylistSnippet = googleapis.youtube_v3.Schema$PlaylistSnippet;
export function getAllVideoUrls(playlistId, playlist: IPlayListResultItems[], info: googleapis.youtube_v3.Schema$PlaylistSnippet, callback: (data: IPlayListInfo) => void) {

    var _playlist = compressPlayList(playlistId, info, playlist);
    var result: IVideo[] = _playlist.videos;
    var item = -1;
    var onlive = 6;
    function getNextItem(): IVideo {
        item = ++item;
        if (item < result.length) return result[item];
        onlive--;
        if (onlive == 0) callback(_playlist);
        return <any>undefined;
    }
    function getUrlsOf(videoItem: IVideo) {
        if (videoItem == void 0) return;
        MyYoutube.getVideoInfo(videoItem.id, () => {
            //compressVideoInfo(data, videoItem);
            getUrlsOf(getNextItem());
        }, videoItem);
    }
    var t = onlive;
    while (t--) getUrlsOf(getNextItem());
}
export function startServer(token: any, authorize: (credentials: any, callback: Function) => void) {
    
    http.createServer((req, res) => {

        if (!req || !req.url) return;
        var urls = req.url.split('/')[1]; if (!urls) return res.end();
        var rurl = url.parse(req.url);
        var query: any = {};
        (rurl.query || "").split('&').forEach((v: { split: (arg0: string) => void; }) => {
            var c: any = v.split('=');
            query[c[0]] = c[1];
        });
        if (query.playlist || query.video)
            authorize(token, (auth: any) => {
                var d = Date.now();
                var e;
                if (query.playlist)

                    MyYoutube.getAllPlayListItems(auth, query.playlist,
                        (f) => {
                            saveFileTo(['store', f.channelTitle || ('channel-' + f.channelId)], (f.title || ('playlist' + f.id)) + '.json', f, () => { });
                            console.log(d, e = Date.now(), e - d);
                            res.write(JSON.stringify(f));
                            res.end();
                        }
                    );
                else if (query.video)
                    MyYoutube.getVideoInfo(query.video, (err: boolean, data: IVideo) => {
                        res.write(JSON.stringify(data));
                        res.end();
                    }, void 0);
            });

    }).listen(parseInt(global.process.execArgv[0]) || 80);

}

initialize((_token, _authorize) => {
    authorize = _authorize;
    token = _token;
    startServer(token, authorize);
});

function vaidatePath(path: string) {
    let unvalid_chars = /[\\\<\>\*\!\/\:\?\"\|]+/;
    while (path.match(unvalid_chars))
        path = path.replace(unvalid_chars, '_');
    return path;
}
function saveFileTo(path: string[], file: string, json, callback) {
    for (let i = 0; i < path.length; i++)
        path[i] = vaidatePath(path[i]);
    var cpath = "./" + (path.length ? path.join('/') + '/' : '');
    file = vaidatePath(file);
    try {
        if (!fs.existsSync(cpath))
            fs.mkdirSync(cpath, { recursive: true });
    } catch (e) { }
    cpath += file;
    saveJson(json, cpath, callback);
}