const express = require('express');
const router = express.Router();
const fs = require('fs');
const torrentStream = require('torrent-stream');

const dbConn = require('../utils/dbConnection');

let filePath = '';
let fileSize = '';
let sentResponse = false;

const streamFile = () => {
	router.get('/stream/:file', (req, res) => {
		// const file = encodeURIComponent(req.params.file);
		res.setHeader('Content-Type', 'video/mp4');
		res.setHeader('Content-Length', contentLength);
		fs.createReadStream(`./downloads/${link.title}/${filePath}` , {
			start: 0,
			end: file.length - 1
		}).pipe(res);
	})
}

router.get('/play', (req, res) => {
	const link = req.query.magnet;

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
		path: `./downloads/${link.title}`, // path oikeeks
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
					[file.path],
					(err, result) => {
						if (err)
							console.log('movie Err', err);
						else if (result.rowCount > 0) {
							if (result.rows[0].downloaded === true) {
								// streamFile(file, filePath);
								// return res.send({ theLink: `http://localhost:3001/movies/${filePath}` })
								//  return res.send({ theLink: `http://localhost:3001/movies/${link.title}/${filePath}` })
								const encodedTitle = link.title.replace(/ /g, '%20');
								const encodedPath = file.path.replace(/ /g, '%20');
								const encodedName = encodeURIComponent(file.name);
								return res.send(result.rows[0])
							}
						}
						else {
							dbConn.pool.query(`
							INSERT INTO movies (movie_path, size, downloaded, date)
							VALUES ($1, $2, $3, NOW())`,
								[file.path, file.length, 0],
								(err1, result) => {
									if (err1)
										console.log('insert movie ERRR', err1);
								})
						}
					})
				filePath = file.path;
				fileSize = file.length;
			}
			console.log('TAA', filePath)
		})
	})

	engine.on('download', () => {
		// console.log('pelkka engine', engine.swarm.downloaded)
		// console.log('filesize', fileSize)
		// console.log('whatsthis', (engine.swarm.downloaded / fileSize * 100))

		if (fs.existsSync(`./downloads/${link.title}/${filePath}`)) {
			if (!sentResponse) {
				console.log(`alle 5 ${link.title}`, (fs.statSync(`./downloads/${link.title}/${filePath}`).size / fileSize * 100).toFixed(2),'%')

				if (fs.statSync(`./downloads/${link.title}/${filePath}`).size / fileSize * 100 > 5) {
					streamFile();
					dbConn.pool.query(`SELECT * FROM movies WHERE movie_path = $1`,
						[filePath],
						(err2, result2) => {
							if (err2)
								console.log('stream err', err2)
							else {
								res.send(result2.rows[0]);
								// streamFile();
							}
						})
					// res.setHeader('Content-Type', 'application/octet-stream');
					// res.setHeader('Content-Disposition', `attachment; filename=${filePath}`);
					// fs.createReadStream(`./movies/${link.title}/${filePath}`).pipe(res);

					sentResponse = true;
				}
			}
			console.log(`${link.title}`, (fs.statSync(`./downloads/${link.title}/${filePath}`).size / fileSize * 100).toFixed(2),'%')
		}
	});

	engine.on('idle', () => {
		console.log('after idle')

		dbConn.pool.query(`UPDATE movies SET downloaded = $1 WHERE movie_path = $2`,
			[true, filePath],
			(err5) => {
				if (err5)
					console.log('Downloaded ERRR', err5)
				else {
					console.log('updated')
					sentResponse = false;
					engine.destroy(() => {});
				}
			})
	})
})


module.exports = router;
