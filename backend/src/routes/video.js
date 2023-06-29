const express = require("express");
const {
	postVideo,
	getVideo,
	getVideos,
} = require("../controllers/videoController");

const router = express.Router();

router.route("/video").post(postVideo);
router.route("/videos").get(getVideos);
router.route("/videos/:videoId/:filename?").get(getVideo);

module.exports = router;
