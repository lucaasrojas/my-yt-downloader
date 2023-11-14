const ytdl = require('ytdl-core');
const fs = require('fs');
const { error } = require('console');

// Opciones para la descarga
const options = {
  quality: 'highestaudio',
  filter: 'audioonly'
};

// Descargar el video
const downloadVideo = (link) => {
  ytdl.getBasicInfo(link).then(async (basicInfo) => {
    let title = basicInfo.videoDetails.title
    if (!fs.existsSync(`${title}.mp3`)) {

      const videoStream = ytdl(link, options);
      console.log("title", title)
      const writeStream = fs.createWriteStream(`${title}.mp3`)
      writeStream.on("error", (err) => {
        console.log("ERR", err)
      })
      await videoStream.pipe(writeStream)
    }
  })
}

const args = process.argv
const getArgument = (argString) => {
  return args[args.findIndex(arg => arg === argString) + 1]
}

const filePath = getArgument("-f")

fs.readFile(filePath, 'utf8', (err, data) => {
  const videoList = data.replace(/(\r\n|\n|\r)/gm, "").split(",")
  console.log("file data", videoList)
  videoList.forEach(async (link) => {
    await downloadVideo(link)
  })
})

