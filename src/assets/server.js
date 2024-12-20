class Server {
    constructor(memberList, channelList, guildName) {
        this.filter_status = false;
        this.filtered_words = [];
        this.reaction_role_messages = 0;
        this.today_channels = {};
        this.last_7_days_channels = [{}, {}, {}, {}, {}, {}, {}];
        this.filtered_messages = 0,
        this.commands_today = 0,
        this.last_7_days_commands = 0,
        this.today_members = {},
        this.last_7_days_members = [{}, {}, {}, {}, {}, {}, {}],
        this.channels = channelList,
        this.members = memberList,
        this.log_channel = '',
        this.server_name = guildName,
        this.filter_violations = {},
        this.max_violations = 10,
        this.violation_penalty = 'mute';
    }
}

module.exports = {
    Server,
}