const querystring = require('querystring');
const http = require('http');
var { google } = require('googleapis');

function getPlayListItems(auth, playlist, page, callback) {
    var service = google.youtube('v3');
    return service.playlistItems.list({
        maxResults: 50,
        auth: auth,
        part: 'snippet,contentDetails',
        pageToken: page,
        playlistId: playlist || 'PLJFQaBvGIKsIvYocA2S19_9ypV8pK1aXI'
    }).then(callback);
}

function getAllPlayListItems(auth, playlist, callback) {
    var rslt = [];
    function callback1(p) {
        if (p) rslt.push(p.data);
        if (!p || p.data.nextPageToken)
            return getPlayListItems(auth, playlist, p && p.data.nextPageToken, callback1);
        getAllVideoUrls(rslt, callback);
        //callback(rslt);
    }
    callback1();

}
function getAllVideoUrls(playlist, callback) {
    debugger;
    var items = [];
    playlist.forEach(v => items = items.concat(v.items));
    var item = -1;
    var onlive = 6;
    function getNextItem() {
        item = ++item;
        if (item < items.length) return items[item];
        onlive--;
        if (onlive == 0) callback(playlist);
        return void 0;
    }
    function getUrlsOf(videoItem) {
        if (videoItem == void 0) return;
        getVideoUrls(videoItem.contentDetails.videoId, (ok, data) => {
            videoItem.info = data;
            getUrlsOf(getNextItem());            
        });
    }
    var t = onlive;
    while (t--) getUrlsOf(getNextItem());
}



function getVideoInfo(auth, video, callback) {
    var service = google.youtube('v3');
    service.videos.list({
        auth: auth, id: video, part: 'snippet,contentDetails,statisctics'
    }).then(callback);
}

function getVideoUrls(video, callback) {
    var request = http.get(`http://www.youtube.com/get_video_info?video_id=` + video + `&el=embedded&ps=default&eurl=&gl=US&hl=en`, function (resp) {
        let data = "";
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var f = querystring.parse(data);
            f.urls = querystring.parse(f.url_encoded_fmt_stream_map);
            delete f.url_encoded_fmt_stream_map;
            delete f.player_response;
            callback(f.status == 'ok', f);
        });
    });
}

exports.getVideoUrls = getVideoUrls;
exports.getVideoInfo = getVideoInfo;
exports.getPlayListInfo = getAllPlayListItems;
