const Video = require("../models/video");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const videoFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(mp4|avi|mkv)$/)) {
		return cb(new Error("Only video files are allowed!"), false);
	}
	cb(null, true);
};

const checkFileSize = async (filePath) => {
	const stats = fs.statSync(filePath);
	const fileSizeInBytes = stats.size;
	console.log(`Video file size: ${fileSizeInBytes} bytes`);
	return fileSizeInBytes;
};

const upload = multer({
	fileFilter: videoFilter,
	storage: multer.memoryStorage(),
}).single("files");

exports.postVideo = async (req, res) => {
	try {
		upload(req, res, async function (err) {
			if (err) {
				console.error(err);
				res.status(403).send({
					message: "Error uploading document. Make sure it is a video file.",
				});
			} else {
				const inputBuffer = req.file.buffer;
				const inputFileExtension = path.extname(req.file.originalname);

				const id = Date.now();
				const inputFile = path.resolve(
					path.join(process.cwd(), "uploads", "videos"),
					`${id}-pure${inputFileExtension}`
				);
				const outputFile = path.resolve(
					path.join(process.cwd(), "uploads", "videos"),
					`${id}${inputFileExtension}`
				);

				console.log("Saving file to disk...", inputFile);

				fs.writeFileSync(inputFile, inputBuffer);
				console.log("File saved to disk.");

				console.log(`Checking input filesize in bytes`);
				const oldSize = await checkFileSize(inputFile);

				ffmpeg(inputFile)
					.output(outputFile)
					.videoCodec("libx264")
					.videoBitrate(2500)
					.audioCodec("aac")
					.audioBitrate(128)
					.autopad()
					.on("end", async function () {
						console.log("Video compression complete!");

						console.log(`Checking output filesize in bytes`);
						const compressedSize = await checkFileSize(outputFile);
						const optimization = ((oldSize - compressedSize) / oldSize) * 100;
						console.log(`Optimized file by ${optimization.toFixed(0)}%`);

						fs.unlinkSync(inputFile);

						console.log("Creating thumbnail");
						ffmpeg(outputFile).thumbnail(
							{
								count: 4,
								size: "1280x720",
								filename: id + "-%i.webp",
							},
							path.resolve(path.join(process.cwd(), "uploads", "images"))
						);

						const video = await Video.create({
							title: req.body.title,
							file: id + inputFileExtension,
						});

						res.status(200).json({
							success: true,
							video,
						});
					})
					.run();
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Something went wrong while uploading...",
		});
	}
};

exports.getVideos = async (req, res) => {
	const videos = await Video.find({});

	res.status(200).send({
		success: true,
		videos,
	});
};

exports.getVideo = async (req, res) => {
	if (!req.params.filename) {
		const video = await Video.findById(req.params.videoId);

		res.status(200).json({ success: true, video });
		return;
	}
	const fileName = req.params.filename;
	const filePath = path.resolve(
		path.join(process.cwd(), "uploads", "videos"),
		fileName
	);

	const stat = fs.statSync(filePath);
	const fileSize = stat.size;
	const range = req.headers.range;

	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		const chunksize = end - start + 1;
		const file = fs.createReadStream(filePath, { start, end });
		const head = {
			"Content-Range": `bytes ${start}-${end}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "video/mp4",
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			"Content-Length": fileSize,
			"Content-Type": "video/mp4",
		};
		res.writeHead(200, head);
		fs.createReadStream(filePath).pipe(res);
	}
};
