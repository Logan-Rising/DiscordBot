const QuickChart = require('quickchart-js');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const utilities = require('./utilities');
const fs = require('fs');
const logging = require('./logging.js');

async function WeeklyServer(firedb, client, info, serverId, path, serverLogCallback) {
    const filePath = path + 'servers/' + serverId + '.png';
    let mesArr = await GetLast7DayMessageArray(info);
    let channelArr = await GetTopChannels(info);
    let memberArr = await GetTopUsers(info);

    const chart = new QuickChart();
    chart.setConfig({
        type:'line',
        data:{labels:['1', '2', '3', '4', '5', '6', '7'],datasets:[{label:'Messages Over The Last 7 Days',data:mesArr,fill:false,borderColor:'blue'}]}
    });
    chart.toFile(filePath);

    await utilities.WaitForFile(filePath, 1000);

    const file = new AttachmentBuilder(filePath);

    const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Weekly Recap For ' + info.server_name)
            .setAuthor({ name: 'Sasquatch Bot'})
            .addFields(
                { name: 'Top Channels: ', value: `\`\`\`1. ${channelArr[0]}\n 2. ${channelArr[1]}\n 3. ${channelArr[2]}\n 4. ${channelArr[3]}\n 5. ${channelArr[4]}\`\`\`` },
                { name: 'Top Users: ', value: `\`\`\`1. ${memberArr[0]}\n 2. ${memberArr[1]}\n 3. ${memberArr[2]}\n 4. ${memberArr[3]}\n 5. ${memberArr[4]}\`\`\`` },
            )
            .setImage('attachment://' + serverId + '.png')
            .setFooter({ text: 'More info here: https://sasquatch-dashboard-34157.web.app/#/myserver'});ter: 'More info here: https://sasquatch-dashboard-34157.web.app/#/myserver',

    await serverLogCallback(firedb, client, serverId, { embeds: [embed], files: [file] });

    // Delete the image
    fs.unlink(filePath, error => {
        if (error) {
            logging.error(firedb, error);
            return;
        }
    });
}

async function GetLast7DayMessageArray(info) {
    const prev7Channels = info.last_7_days_channels;
    let arr = [];
    let count = 0;
    for (let i = prev7Channels.length - 1; i >= 0; i--) {
        for (key in prev7Channels[i]) {
            count += prev7Channels[i][key];
        }
        arr.push(count);
        count = 0;
    }

    return arr;
  }

  async function GetTopChannels(info) {
    const prev7Channels = info.last_7_days_channels;
    let channels = {};
    for (let i = 0; i < prev7Channels.length; i++) {
        for (key in prev7Channels[i]) {
            channels[key] ? channels[key] += prev7Channels[i][key] : channels[key] = prev7Channels[i][key];
        }
    }
  
    const top5Values = Object.values(channels).sort((a,b) => b-a).slice(0,5);
      const top5Keys = Object.keys(channels).sort((a,b) => channels[b]- channels[a]).slice(0,5);
      let top5List = [];
  
      for ( let i = 0; i < 5; i++ ){
          top5Keys[i] ? top5List.push(info.channels[top5Keys[i]] + ': ' + top5Values[i]) : top5List.push('N/A');
      }
  
      return top5List;
  }

  async function GetTopUsers(info) {
    const prev7Users = info.last_7_days_members;
    let users = {};
    for (let i = 0; i < prev7Users.length; i++) {
        for (key in prev7Users[i]) {
          users[key] ? users[key] += prev7Users[i][key] : users[key] = prev7Users[i][key];
        }
    }
  
    const top5Values = Object.values(users).sort((a,b) => b-a).slice(0,5);
      const top5Keys = Object.keys(users).sort((a,b) => users[b]- users[a]).slice(0,5);
      let top5List = [];
  
      for ( let i = 0; i < 5; i++ ){
          top5Keys[i] ? top5List.push(info.members[top5Keys[i]] + ': ' + top5Values[i]) : top5List.push('N/A');
      }
      
      return top5List;
  }

module.exports = {
    WeeklyServer,
};