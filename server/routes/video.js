const express = require('express');
const router = express.Router();
const fs = require('fs');
const torrentStream = require('torrent-stream');
const dbConn = require('../utils/dbConnection');
const config = require('../utils/config');
const https = require('https');
const path = require('path');

let filePath = '';
let fileSize = '';
let title = '';
let imdbCode = '';
let startReady = '';
let startStream = '';

let langObj = {
    en: 0,
    fi: 0,
};

const langParser = (lang) => {
    if (lang === 'en') {
        langObj.en += 1;
        if (langObj.en >= 2) return false;
        return true;
    } else if (lang === 'fi') {
        langObj.fi += 1;
        if (langObj.fi >= 2) return false;
        return true;
    }
};

const resetLangObj = () => {
    return {
        en: 0,
        fi: 0,
    };
};

const download = async (
    url,
    dest,
    imdbCode,
    subsData
) => {
    if (!fs.existsSync(`./subtitles/${imdbCode}`))
        fs.mkdirSync(`./subtitles/${imdbCode}`, {recursive: true});

    const fileName = path.basename(dest);
    const finalDest = path.join(`./subtitles/${imdbCode}`, fileName)

    //console.log('PATH', dest)
    //console.log('PATH', finalDest)
    //console.log('PATH', subsData.attributes.language)

    dbConn.pool.query(`SELECT *
                       FROM subtitles
                       WHERE path = $1`,
        [finalDest],
        (err, result) => {
            if (err)
                console.log('Sub', err)
            else if (result.rowCount === 0) {
                dbConn.pool.query(`INSERT INTO subtitles (imdb_code, language, path)
                                   VALUES ($1, $2, $3)`,
                    [imdbCode, subsData.attributes.language, finalDest],
                    (err1, result1) => {
                        if (err1)
                            console.log('subs insert', err)
                        else {
                            // console.log('subs inserted', result1)
                        }
                    })
            }
        })

    const file = fs.createWriteStream(finalDest);
    // const request =
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
        });
    });
};

router.get('/play', (req, res) => {
	// console.log('PLAYALUSSA', startReady)
    const link = req.query.magnet;
		if (link) {
    let sentResponse = false;

    imdbCode = link.imdbCode

    //console.log('link', link)
    //console.log('magnet', link.magnetUrl)
    //console.log('title', link.title)

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
				startReady = false;
				startStream = false;
    });

    engine.on('torrent', () => {
        engine.files.forEach((file) => {
            //console.log('filename', file.name)
            //console.log('filepath', file.path)
            //console.log('filelength', file.length)

            if (file.name.endsWith('.mkv')) {

            }

            if (file.name.endsWith('.mp4') ||
                file.name.endsWith('.webm')) {

                file.select();
                dbConn.pool.query(`SELECT *
                                   FROM movies
                                   WHERE movie_path = $1`,
                    [`${imdbCode}/${file.path}`],
                    (err, result) => {
                        if (err)
                            console.log('movie Err', err);
                        else if (result.rowCount > 0) {
                            if (result.rows[0].downloaded === true) {
                                dbConn.pool.query(`UPDATE movies
                                                   SET date = NOW()
                                                   WHERE movie_path = $1`,
                                    [`${imdbCode}/${file.path}`],
                                    (err3) => {
                                        if (err3) {
                                            console.log('date update err', err3)
                                        }
                                    })
                                if (!sentResponse) {
                                    sentResponse = true
                                    startReady = true
                                    return res.send({downloaded: true, result: result.rows[0]})
                                }
                            }
                        } else {
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
            // console.log('TAA', filePath)
        });
    })

    engine.on('download', () => {
        if (fs.existsSync(`./downloads/${imdbCode}/${link.title}/${filePath}`)) {
            if (!sentResponse) {
                // console.log(`alle 5 ${link.title}`, (fs.statSync(`./downloads/${imdbCode}/${link.title}/${filePath}`).size / fileSize * 100).toFixed(2),'%')
                if (fs.statSync(`./downloads/${imdbCode}/${link.title}/${filePath}`).size / fileSize * 100 > 5) {

                    dbConn.pool.query(`SELECT *
                                       FROM movies
                                       WHERE movie_path = $1`,
                        [`${imdbCode}/${filePath}`],
                        (err2, result2) => {
                            if (err2)
                                console.log('stream err', err2)
                            else {
															startStream = true;
															sentResponse = true;
                              res.send({streamIt: true, result: result2.rows[0]});
                            }
                        })
                }
            }
            if (fs.statSync(`./downloads/${imdbCode}/${link.title}/${filePath}`).size / fileSize * 100 <= 100) {
                console.log(`${link.title}`, (fs.statSync(`./downloads/${imdbCode}/${link.title}/${filePath}`).size / fileSize * 100).toFixed(2), '%')
            }
        }
    });

    engine.on('idle', () => {

        if (fs.existsSync(`./downloads/${imdbCode}/${link.title}/${filePath}`)) {
            dbConn.pool.query(`UPDATE movies
                               SET downloaded = $1
                               WHERE movie_path = $2`,
                [true, `${imdbCode}/${filePath}`],
                (err5) => {
                    if (err5)
                        console.log('Downloaded ERRR', err5)
                    else {
                        console.log(`${link.title} downloaded.`)
                        engine.destroy(() => {
                            sentResponse = false;
                        });
                    }
                })
        }
    })
	}
	else {
		res.redirect('/')
	}
})

router.get(`/ready`, (req, res) => {
	console.log('READYSSA', startReady)
	if (startReady) {
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
	}
	else {
		res.redirect('/');
	}

});

router.get(`/stream`, (req, res) => {
	if (startStream) {
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
    start = 0;
    // const end =  Math.min(start + chunksize, fsize - 1);
    const end = fsize1 - 1
    // const end = (parts[1] ? parseInt(parts[1], 10) : fsize -1)
    const contentLength = end - start + 1;

    if (end >= fsize) {
        res.status(416).send('Requested range not satisfiable');
        return;
    }

    const stream = fs.createReadStream(file, {start, end});
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fsize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);
    stream.pipe(res);
	}
	else {
		res.redirect('/');
	}
});

// SUBTITLES
router.get('/subtitles', (req, res) => {
    const imdb = req.query.code

    const regex = /\D/g;
    let newImdb = Number(imdb.imdbCode.replace(regex, ''));

    const subOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': `${config.OPENSUB_API}`
        }
    }
    fetch(`https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${newImdb}`, subOptions)
        .then((response) => response.json())
        .then(subtitles => {
            //console.log('Subtitles', subtitles.data.filter(sub => sub.attributes.language === 'en'))
            const filterSubs = subtitles.data.filter(sub => {
                if (
                    (sub.attributes.language === 'en' ||
                        sub.attributes.language === 'fi') &&
                    langParser(sub.attributes.language) === true
                ) {
                    return sub;
                }
            })
            langObj = resetLangObj();
            //res.json(filterSubs)
            if (filterSubs !== null) {
                filterSubs.forEach(subtitle => {

                        const optionsDownload = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Api-Key': `${config.OPENSUB_API}`
                            },
                            body: `{"file_id":${subtitle.attributes.files[0].file_id},
						"sub_format": "webvtt"}`,
                        };

                        fetch(
                            'https://api.opensubtitles.com/api/v1/download',
                            optionsDownload
                        )
                            .then((response) => response.json())
                            .then((response) => {
                                download(
                                    response.link,
                                    `./subtitles/${imdb.imdbCode}/${imdb.imdbCode}-${subtitle.id}.vtt`,
                                    imdb.imdbCode,
                                    subtitle
                                );
                            })
                            .catch((err) => console.error(err));
                    }
                );
            }
        })
})

router.get('/getSubs', (req, res) => {
    const code = req.query.code;
    console.log('HALOOO', code.imdbCode)
    dbConn.pool.query('SELECT * FROM subtitles WHERE imdb_code = $1',
        [code.imdbCode],
        (err, result) => {
            if (err)
                console.log('getSubs err', err)
            else {
                //console.log('hohoo', result.rows)
                res.send(result.rows);
            }
        })
})

router.get('/subtitles/:code/:filename', (req, res) => {
    const {code, filename} = req.params;
    //console.log('HIHIHIHIHIHI', code)
    //console.log('HIHIHIHIHIHI2', filename)

// const filePath = `subtitles/${code}/${filename}`;
    const filePath = path.join(process.cwd(), 'subtitles', code, filename)
    console.log('FILEPAAAHT', filePath)

    res.sendFile(filePath);
})

module.exports = router;

// luo tracks array react playeria varten /src/pages/api/subtitles
// kokeile toimiiko tracks[{src: path}] ilman että luo endpointin subi streamausta varten
