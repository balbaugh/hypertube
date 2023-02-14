const express = require('express');
const router = express.Router();
const fs = require('fs');
const torrentStream = require('torrent-stream');

const dbConn = require('../utils/dbConnection');

let filePath = '';
let fileSize = '';
let title = '';
let imdbCode = '';
let sentResponse = false;

router.get('/play', (req, res) => {
	const link = req.query.magnet;

	imdbCode = link.imdbCode

	console.log('link', link)
	console.log('magnet', link.magnetUrl)
	console.log('title', link.title)

	const torrentStreamOptions = {
		trackers: [
			'udp://open.demonii.com:1337/announce',
			'udp://tracker.openbittorrent.com:80',
			'udp://tracker.coppersurfer.tk:6969',
			'udp://glotorrents.pw:6969/announce',
			'udp://tracker.opentrackr.org:1337/announce',
			'udp://torrent.gresille.org:80/announce',
			'udp://p4p.arenabg.com:1337',
			'udp://tracker.leechers-paradise.org:6969',
		],
		path: `./downloads/${imdbCode}/${link.title}`, // path oikeeks
	};

	const engine = torrentStream(
		link.magnetUrl,
		torrentStreamOptions
	);

	engine.on('ready', () => {
		sentResponse = false;
	});

	 engine.on('torrent', () => {
		engine.files.forEach((file) => {
			console.log('filename', file.name)
			console.log('filepath', file.path)
			console.log('filelength', file.length)

			if (file.name.endsWith('.mp4') ||
				file.name.endsWith('.webm')) {

					file.select();
					dbConn.pool.query(`SELECT * FROM movies WHERE movie_path = $1`,
					[`${imdbCode}/${file.path}`],
					(err, result) => {
						if (err)
							console.log('movie Err', err);
						else if (result.rowCount > 0) {
							if (result.rows[0].downloaded === true) {
								sentResponse = true
								// return res.send(result.rows[0])
								return res.send({ downloaded: true, result })
							}
						}
						else {
							dbConn.pool.query(`
							INSERT INTO movies (movie_path, size, downloaded, date)
							VALUES ($1, $2, $3, NOW())`,
							[`${imdbCode}/${file.path}`, file.length, 0],
							(err1, result) => {
								if (err1)
									console.log('insert movie ERRR', err1);
							})
						}
					})
				filePath = file.path;
				fileSize = file.length;
				title = link.title;
				}
				console.log('TAA', filePath)
		});
	 })

	 engine.on('download', () => {
		// console.log('pelkka engine', engine.swarm.downloaded)
		// console.log('filesize', fileSize)
		// console.log('whatsthis', (engine.swarm.downloaded / fileSize * 100))

		if (fs.existsSync(`./downloads/${imdbCode}/${link.title}/${filePath}`)) {
			if (!sentResponse) {
				console.log(`alle 5 ${link.title}`, (fs.statSync(`./downloads/${imdbCode}/${link.title}/${filePath}`).size / fileSize * 100).toFixed(2),'%')

				if (fs.statSync(`./downloads/${imdbCode}/${link.title}/${filePath}`).size / fileSize * 100 > 5) {

					dbConn.pool.query(`SELECT * FROM movies WHERE movie_path = $1`,
					[`${imdbCode}/${filePath}`],
					(err2, result2) => {
						if (err2)
							console.log('stream err', err2)
						else {
							res.send({ streamIt: true, result: result2.rows[0] });
						}
					})
					sentResponse = true;
				}
			}
			console.log(`${link.title}`, (fs.statSync(`./downloads/${imdbCode}/${link.title}/${filePath}`).size / fileSize * 100).toFixed(2),'%')
		}
	 });

	engine.on('idle', () => {
		console.log('after idle')

		if (fs.existsSync(`./downloads/${imdbCode}/${link.title}/${filePath}`)) {
				dbConn.pool.query(`UPDATE movies SET downloaded = $1 WHERE movie_path = $2`,
				[true, `${imdbCode}/${filePath}`],
				(err5) => {
					if (err5)
						console.log('Downloaded ERRR', err5)
					else {
						console.log('updated')
						sentResponse = false;
						engine.destroy(() => {});
					}
				})
		}
	 })
 })

// router.get(`/subtitles`, (req, res) => {
//   const imdbid = imdbCode;
// 	const apiOptions = {
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Api-Key': 'YF2CcQBsm159bPwSh3GUlFHDCbQhYzEs',
// 		}
// 	}

//   fetch(`https://api.opensubtitles.org/v1/subtitles?imdb_id=${imdbid}`, apiOptions)
//   // fetch(`https://api.opensubtitles.org/v1/`)
// 	.then((response) => {
// 		res.send(response)
// 	})
// });

router.get(`/ready`, (req, res) => {
	const file = `./downloads/${imdbCode}/${title}/${filePath}`
	const stream = fs.createReadStream(file);

	const start = 0;
	const end = fileSize - 1;
	const chunkSize = end - start + 1;

	const headers = {
		'Content-Range': `bytes ${start}-${end}/${fileSize}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': chunkSize,
		'Content-Type': 'video/mp4',
	}
	res.writeHead(200, headers)
	stream.pipe(res)
});

 router.get(`/stream`, (req, res) => {
  const file = `./downloads/${imdbCode}/${title}/${filePath}`;
  const fsize = fileSize
  const fsize1 = fs.statSync(file).size

	console.log('fsize1', fsize1)
	console.log('req range : ', req.headers.range);
  const range = req.headers.range || `bytes=0-${fsize - 1}`;
  const parts = range.replace(/bytes=/, "").split("-");
	console.log('PARTS', parts);
	const chunksize = 30e6;
  // const start = parseInt(parts[0], 10);
	const start = 0;
  // const end =  Math.min(start + chunksize, fsize - 1);
	const end = fsize1
	// const end = (parts[1] ? parseInt(parts[1], 10) : fsize -1)
	const contentLength = end - start + 1;

  if (end >= fsize) {
    res.status(416).send('Requested range not satisfiable');
    return;
  }

  const stream = fs.createReadStream(file, { start, end });
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fsize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  };

  res.writeHead(206, headers);
  stream.pipe(res);
 });

module.exports = router;
