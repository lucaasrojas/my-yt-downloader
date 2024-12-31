const ytdl = require("ytdl-core");
const fs = require("fs");
const process = require("process");
const SpinnerManager = require("./spinnerManager");

const args = process.argv;

const SM = SpinnerManager()

const getArgumentIndex = (argString) => {
  return args.findIndex((arg) => arg === argString);
};
const getArgument = (argString) => {
  const index = getArgumentIndex(argString);
  const argument = args[index + 1];
  const isArgument = !argument.includes("-");
  return index > -1 && isArgument ? argument : null;
};

const alreadyExists = (name) => {
  return fs.existsSync(name)
}

const video = getArgumentIndex("-v") > -1;
const audio = getArgumentIndex("-a") > -1;
const filePath = getArgument("-f");

const getVideo = async (title, link) => {
  if(alreadyExists(`${title}.mp4`)) fs.unlinkSync(`${title}.mp4`)

  if (!alreadyExists(`${title}.mp4`)) {
    SM.addSpinner(title)
    const videoStream = ytdl(link);

    const writeStream = fs.createWriteStream(`${title}.mp4`);

    writeStream.on("error", (err) => {
      console.log("ERR", err);
    });

    writeStream.on("close", () => {
      SM.completeSpinner.byMessage(title)
    });

    await videoStream.pipe(writeStream);
  } else {
    console.log(`File ${title}.mp4 already exists`);
  }
};

const getAudio = async (title, link) => {
  if (!fs.existsSync(`${title}.mp3`)) {
    const videoStream = ytdl(link, {
      quality: "highestaudio",
      filter: "audioonly",
    });
    console.log("title", title);
    const writeStream = fs.createWriteStream(`${title}.mp3`);
    writeStream.on("error", (err) => {
      console.log("ERR", err);
    });
    await videoStream.pipe(writeStream);
  } else {
    console.log(`File ${title}.mp3 already exists`);
  }
};

// Descargar el video
const downloadVideo = async (link) => {
  try {
    const basicInfo = await ytdl.getBasicInfo(link);
    let title = basicInfo.videoDetails.title;

    if (audio) {
      await getAudio(title, link);
    }
    if (video) {
      await getVideo(title, link);
    }
  } catch (error) {
    console.log("ERR - getBasicInfo", error);
  }
};

// ===================================================




if (!video && !audio) {
  throw new Error("Please specify -v or -a");
}
if (getArgumentIndex("-f") > -1 && !filePath) {
  throw Error("When using -f you have to specify path");
}
fs.readFile(filePath, "utf8", async (err, data) => {
  const videoList = data.replace(/(\r\n|\n|\r)/gm, "").split(",");
  console.log("file data", videoList);

  for (let link of videoList) {
    downloadVideo(link)
  }
});
