const { Message, RichEmbed } = require('discord.js')

module.exports = function (message = new Message(), check_type, modeicon, supporter, modename, name, id, pp, rank, country, ct_rank, acc, playcount, level, playstyle, ss, s, a, stat_text, stat_icon, refresh) {
    // Setup for modes
    let embedcolor = (message.guild == null ? "#7f7fff": message.guild.me.displayColor)
    let profile_link = ''
    let pfp_link = ''
    if (check_type == 'Bancho') {
        profile_link = `https://osu.ppy.sh/users/${id}`
        pfp_link = `http://s.ppy.sh/a/${id}.png?date=${refresh}`
    } else if (check_type == 'Ripple') {
        profile_link = `https://ripple.moe/u/${id}`
        pfp_link = `http://a.ripple.moe/${id}?date=${refresh}`
    } else if (check_type == 'Akatsuki') {
        profile_link = `https://akatsuki.pw/u/${id}`
        pfp_link = `http://a.akatsuki.pw/${id}?date=${refresh}`
    } else if (check_type == 'Horizon') {
        profile_link = `https://lemres.de/u/${id}`
        pfp_link = `http://a.lemres.de/${id}?date=${refresh}`
    } else if (check_type == 'Enjuu') {
        profile_link = `https://enjuu.click/u/${id}`
        pfp_link = `http://a.enjuu.click/${id}?date=${refresh}`
    }
    // Description
    let desc = ''
    if (modeicon) {
        desc += `${modeicon} `
    }
    if (supporter) {
        desc += `${supporter} `
    }
    if (modename && name && id) {
        desc += `**Osu!${modename} status for: [${name}](${profile_link})**`
        
    }
    // Field 1
    let field1 = ''
    if (pp) {
        field1 += `--- **${pp}pp**\n`
    }
    if (rank) {
        field1 += `**Global Rank:** #${rank}`
        if (country && ct_rank) {
            field1 += ` (:flag_${country}:: #${ct_rank})\n`
        } else {
            field1 += `\n`
        }
    }
    if (acc) {
        field1 += `**Accuracy:** ${acc}%\n`
    }
    if (playcount) {
        field1 += `**Play count:** ${(playcount).toLocaleString('en')}\n`
    }
    if (level) {
        field1 += `**Level:** ${level}\n`
    }
    if (playstyle) {
        field1 +=   `**Play Style:**\n${playstyle}`
    }
    if (field1.substr(field1.length-1, 1) == "\n") {
        field1 = field1.substring(0, field1.length-1)
    }
    // Field 2
    let field2 = ''
    if (ss !== undefined && s !== undefined && a !== undefined) {
        field2 += `<:rankingX:520932410746077184>: ${ss}\n<:rankingS:520932426449682432>: ${s}\n<:rankingA:520932311613571072>: ${a}`
    }
    let embed = new RichEmbed()
    embed.setColor(embedcolor)
    embed.setThumbnail(pfp_link)
    if (desc !== '') {
        embed.setDescription(desc)
    }
    if (field1 !== '') {
        embed.addField('Performance:', field1, true)
    }
    if (field2 !== '') {
        embed.addField('Rank:', field2, true)
    }
    if (stat_text) {
        embed.setFooter(stat_text, stat_icon)
    }
    return embed
}