const nodeosu = require('node-osu');
const request = require('request-promise-native');
const { Osutop } = require('./../../Classes/osu')
// Function
const getServerLink = require('./get_server_link')

let osuApi = new nodeosu.Api(process.env.OSU_KEY, {
    notFoundAsError: false,
    completeScores: true
});

let osuApi_no_bm = new nodeosu.Api(process.env.OSU_KEY, {
    notFoundAsError: false,
    completeScores: false
});

module.exports = async function (name, mode, limit, type, no_bm = false) {
    let top = []
    if (mode >= 0 && mode <= 3) {
        let best = ''
        if (type == 'best') {
            best = no_bm == false ? await osuApi.getUserBest({u: name, m: mode, limit: limit}) : await osuApi_no_bm.getUserBest({u: name, m: mode, limit: limit}) 
        } else if (type == 'recent') {
            best = no_bm == false ? await osuApi.getUserRecent({u: name, m: mode, limit: limit}) : await osuApi_no_bm.getUserRecent({u: name, m: mode, limit: limit})
        }
        for (var i = 0; i < best.length; i++) {
            if (no_bm == false) {
                let count300 = Number(best[i].counts['300'])
                let count100 = Number(best[i].counts['100'])
                let count50 = Number(best[i].counts['50'])
                let countmiss = Number(best[i].counts.miss)
                let countgeki = Number(best[i].counts.geki)
                let countkatu = Number(best[i].counts.katu)
                let acc = Number((300 * count300 + 100 * count100 + 50 * count50) / (300 * (count300 + count100 + count50 + countmiss)) * 100)
                let accdetail = `[${count300}/${count100}/${count50}/${countmiss}]`
                let star = 0
                if (mode == 1 || mode == 2 || mode == 3) {
                    star = Number(best[i].beatmap.difficulty.rating).toFixed(2)
                }
                if (mode == 1) {
                    acc = Number((0.5 * count100 + count300) / (count300 + count100 + countmiss) * 100)
                    accdetail = `[${count300}/${count100}/${countmiss}]`
                }
                if (mode == 2) {
                    acc = Number((count50 + count100 + count300) / (countkatu + countmiss + count50 + count100 + count300) * 100)
                }
                if (mode == 3) {
                    acc = Number((50 * count50 + 100 * count100 + 200 * countkatu + 300 * (count300 + countgeki)) / (300 * (countmiss + count50 + count100 + countkatu + count300 + countgeki)) * 100)
                    accdetail = `[${countgeki}/${count300}/${countkatu}/${count100}/${count50}/${countmiss}]`
                }
                top[i] = new Osutop([
                                    //Score
                                    Number(i+1),
                                    Number(best[i].score),
                                    Number(best[i].user.id),
                                    count300,
                                    count100,
                                    count50,
                                    countmiss,
                                    countgeki,
                                    countkatu,
                                    acc,
                                    accdetail,
                                    Number(best[i].maxCombo),
                                    best[i].perfect,
                                    best[i].date,
                                    best[i].rank,
                                    type == 'best' ? Number(best[i].pp) : 0,
                                    best[i].raw_mods,
                                    // Beatmap
                                    Number(best[i].beatmap.id),
                                    best[i].beatmap.title,
                                    best[i].beatmap.creator,
                                    best[i].beatmap.version,
                                    best[i].beatmap.source,
                                    best[i].beatmap.artist,
                                    Number(best[i].beatmap.bpm),
                                    Number(best[i].beatmap.beatmapSetId),
                                    (mode == 0 || mode == 2) ? Number(best[i].beatmap.maxCombo) : '',
                                    star,
                                    Number(best[i].beatmap.length.total),
                                    Number(best[i].beatmap.length.drain)])
            } else {
                let count300 = Number(best[i].counts['300'])
                let count100 = Number(best[i].counts['100'])
                let count50 = Number(best[i].counts['50'])
                let countmiss = Number(best[i].counts.miss)
                let countgeki = Number(best[i].counts.geki)
                let countkatu = Number(best[i].counts.katu)
                let acc = Number((300 * count300 + 100 * count100 + 50 * count50) / (300 * (count300 + count100 + count50 + countmiss)) * 100)
                let accdetail = `[${count300}/${count100}/${count50}/${countmiss}]`
                if (mode == 1) {
                    acc = Number((0.5 * count100 + count300) / (count300 + count100 + countmiss) * 100)
                    accdetail = `[${count300}/${count100}/${countmiss}]`
                }
                if (mode == 2) {
                    acc = Number((count50 + count100 + count300) / (countkatu + countmiss + count50 + count100 + count300) * 100)
                }
                if (mode == 3) {
                    acc = Number((50 * count50 + 100 * count100 + 200 * countkatu + 300 * (count300 + countgeki)) / (300 * (countmiss + count50 + count100 + countkatu + count300 + countgeki)) * 100)
                    accdetail = `[${countgeki}/${count300}/${countkatu}/${count100}/${count50}/${countmiss}]`
                }
                top[i] = new Osutop([
                                    //Score
                                    Number(i+1),
                                    Number(best[i].score),
                                    Number(best[i].user.id),
                                    count300,
                                    count100,
                                    count50,
                                    countmiss,
                                    countgeki,
                                    countkatu,
                                    acc,
                                    accdetail,
                                    Number(best[i].maxCombo),
                                    best[i].perfect,
                                    best[i].date,
                                    best[i].rank,
                                    type == 'best' ? Number(best[i].pp) : 0,
                                    best[i].raw_mods,
                                    // Beatmap
                                    Number(best[i].beatmapId)])
            }
        }
    }
    if (mode >= 4 && mode <= 12) {
        let serverlink = getServerLink(mode)
        let linkoption = (mode == 12) ? '&rx=1' : ''
        let data1 = await request.get(`https://${serverlink}/api/v1/users/scores/${type}?name=${name}${linkoption}&l=${limit}`)
        let data2 = await request.get(`https://${serverlink}/api/v1/users?name=${name}`)
        let best = JSON.parse(data1)
        let user = JSON.parse(data2)
        for (var i = 0; i < best.scores.length; i++) {
            let count300 = Number(best.scores[i].count_300)
            let count100 = Number(best.scores[i].count_100)
            let count50 = Number(best.scores[i].count_50)
            let countmiss = Number(best.scores[i].count_miss)
            let acc = Number((300 * count300 + 100 * count100 + 50 * count50) / (300 * (count300 + count100 + count50 + countmiss)) * 100)
            let accdetail = `[${count300}/${count100}/${count50}/${countmiss}]`
            let song_name = best.scores[i].beatmap.song_name
            let diff = song_name.split('[')[1].slice(0, -1)
            let artist = song_name.split('[')[0].split('-')[1].substring(1)
            let title = song_name.split('[')[0].split('-')[0].slice(0, -1)
            top[i] = new Osutop([
                                //Score
                                Number(i+1),
                                Number(best.scores[i].score),
                                Number(user.id),
                                count300,
                                count100,
                                count50,
                                countmiss,
                                undefined,
                                undefined,
                                acc,
                                accdetail,
                                Number(best.scores[i].max_combo),
                                best.scores[i].full_combo == true ? 1 : 0,
                                best.scores[i].time,
                                best.scores[i].rank,
                                Number(best.scores[i].pp),
                                best.scores[i].mods,
                                // Beatmap
                                Number(best.scores[i].beatmap.beatmap_id),
                                title,
                                undefined,
                                diff,
                                undefined,
                                artist,
                                undefined,
                                Number(best.scores[i].beatmap.beatmapset_id),
                                best.scores[i].beatmap.max_combo,
                                best.scores[i].beatmap.difficulty,
                                undefined,
                                undefined])
        }
    }
    return top
}