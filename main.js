const {WebClient, LogLevel} = require("@slack/web-api");


const TOKEN = "xxxx"; // your access token, which start with 'xoxp-'
const CHANNEL_ID = "C06DT55N5RB";   // Checkin-Checkout
const SEND_USER = "U06B3E47J1L";    // Mrs. Anh Nguyen
const IN_OFFICE_DAY = ["Mon", "Tue", "Wed", "Thu"];
const HOME_DAY = ["Fri"];
const IN_OUT_VALID = ["in", "out"];

const client = new WebClient(TOKEN, {
    logLevel: LogLevel.INFO
});

function getDate() {
    const currentDate = new Date();

    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    const [weekDay, date] = formattedDate.split(", ");
    const [month, day, year] = date.split('/');
    return {
        day: weekDay,
        date: `#${day}-${month}-${year} (${weekDay})`
    }
}

async function main() {
    console.log("\n---------------------------------------------------------------");
    console.log(`[${new Date()}] Starting job...`);

    if (!process.argv || process.argv.length < 3) {
        console.log("Missing argument, exit!");
        return 1;
    }

    let io = process.argv[2];
    if (!IN_OUT_VALID.includes(io)) {
        console.log("Invalid param:", io);
        return 1;
    }

    let result = getDate();
    let query = result.date;
    let day = result.day;

    let message = null;
    if (IN_OFFICE_DAY.includes(day)) {
        message = `#Check${io}Office`;
    } else if (HOME_DAY.includes(day)) {
        message = `#Check${io}Home`;
    }

    const messages = await client.search.messages({query: query, sort: "timestamp"});
    const matches = messages.messages.matches;

    if (matches && matches.length > 0) {
        for (let match of matches) {
            if (match.type === "message" && match.channel.id === CHANNEL_ID && match.user === SEND_USER) {
                if (message) {
                    const res = await client.chat.postMessage({
                        channel: CHANNEL_ID,
                        text: message,
                        thread_ts: match.ts
                    });
                    console.log(`[${new Date()}] Send message:`, res);
                }
                break;
            }
        }
    }

    console.log(`[${new Date()}] Complete job!`);
    console.log("---------------------------------------------------------------");
}

main();