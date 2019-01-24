"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const readline = __importStar(require("readline"));
const fs = __importStar(require("fs"));
var OAuth2 = googleapis_1.google.auth.OAuth2;
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        }
        else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client, authorize);
        }
    });
}
exports.authorize = authorize;
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}
/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    }
    catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err)
            throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
    console.log('Token stored to ' + TOKEN_PATH);
}
/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * /
function getChannel(auth) {
  var service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'GoogleDevelopers'
  }, function (err, response) {
    app.onYoutubeApiReady(credentials, authorize);
    //app.startServer(auth, authorize);
    // if (err) {
    //   console.log('The API returned an error: ' + err);
    //   return;
    // }
    // var channels = response.data.items;
    // if (channels.length == 0) {
    //   console.log('No channel found.');
    // } else {
    //   console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
    //     'it has %s views.',
    //     channels[0].id,
    //     channels[0].snippet.title,
    //     channels[0].statistics.viewCount);
    // }
  });
}*/
function initialize(callback) {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the YouTube API.
        authorize(credentials = (credentials = void 0) || JSON.parse(content), () => {
            callback(credentials, authorize);
        });
    });
}
exports.initialize = initialize;
const isNode = typeof process === 'object' && process + '' === '[object process]';
function getUrl(url, callback) {
    if (isNode) {
        var req = require('request');
        req.get(url, void 0, function (error, response, body) {
            var err = error || response.statusCode !== 200;
            callback(!err, body);
        });
    }
    else {
        fetch(url).then(r => {
            if (!r.ok)
                callback(true, void 0);
            else
                r.text().then(text => callback(false, text));
        });
    }
}
exports.getUrl = getUrl;
function saveJson(json, file, callback) {
    fs.writeFile(file, JSON.stringify(json), 'utf8', function (err) {
        callback && callback(!err, json, file);
    });
}
exports.saveJson = saveJson;
function compressVideoInfo(v, vd) {
    {
        vd = vd || {};
        vd.id = v.video_id;
        vd.title = v.title;
        vd.subtitle = v.subtitle;
        vd.captions = [];
        vd.audio = [];
        vd.videos = [];
        vd.thumbnails = { url: v.thumbnail_url, width: 0, height: 0 };
    }
    var r = v.player_response;
    if (r.streamingData) {
        if (r.streamingData.formats)
            for (const frm of r.streamingData.formats)
                vd.videos.push({
                    contentLength: parseInt(frm.contentLength),
                    mimeType: frm.mimeType,
                    qualityLabel: frm.qualityLabel,
                    url: frm.url,
                    duration: parseInt(frm.approxDurationMs)
                });
        if (r.streamingData.adaptiveFormats)
            for (const ad of r.streamingData.adaptiveFormats)
                if (ad.mimeType.startsWith('audio/'))
                    vd.audio.push({
                        url: ad.url,
                        mimeType: ad.mimeType,
                        audioQuality: ad.audioQuality,
                        contentLength: parseInt(ad.contentLength),
                        duration: parseInt(ad.approxDurationMs)
                    });
        if (r.captions && r.captions.playerCaptionsTracklistRenderer && r.captions.playerCaptionsTracklistRenderer.captionTracks)
            for (const cp of r.captions.playerCaptionsTracklistRenderer.captionTracks) {
                vd.captions.push({
                    lang: cp.languageCode,
                    url: cp.baseUrl
                });
            }
    }
    return vd;
}
exports.compressVideoInfo = compressVideoInfo;
function compressPlayList(playlistId, _info, p) {
    var videos = [];
    var info = {
        videos: videos,
        id: playlistId,
        title: _info.title,
        channelId: _info.channelId,
        channelTitle: _info.channelTitle,
        description: _info.description,
        thumnails: _info.thumbnails && _info.thumbnails.default
    };
    for (const page of p) {
        for (var video of page.items) {
            videos.push({
                id: video.contentDetails.videoId,
                pos: video.snippet.position,
                title: video.snippet.title,
                thumbnails: video.snippet.thumbnails && video.snippet.thumbnails.default,
                subtitle: video.snippet.description,
                audio: [],
                videos: [],
                captions: []
            });
        }
    }
    info.nVideos = videos.length;
    return info;
}
exports.compressPlayList = compressPlayList;
function toObject(arr) {
    if (typeof arr === 'string')
        arr = arr.split('&');
    var obj = {};
    for (const i of arr) {
        var x = i.split('=');
        try {
            x[1] = JSON.parse(decode(x[1]));
        }
        catch (_a) {
        }
        obj[x[0]] = x[1];
    }
    return obj;
}
exports.toObject = toObject;
function decode(val) {
    var encoded = val;
    return decodeURIComponent(encoded.replace(/\+/g, " "));
}
exports.decode = decode;
let credentials;
