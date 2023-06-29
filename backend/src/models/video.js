const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Lütfen video ismini girin"],
		trim: true,
		maxLength: [100, "Video ismi 100 karakteri geçmemeli"],
	},
	file: {
		type: String,
		required: [true, "Lütfen video için bir dosya girin"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Video", videoSchema);
