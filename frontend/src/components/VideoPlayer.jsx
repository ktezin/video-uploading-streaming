import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const VideoPlayer = ({ video, width, height }) => {
	const videoRef = useRef(null);

	const [playing, setPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [videoTime, setVideoTime] = useState(0);
	const [progress, setProgress] = useState(0);

	const handlePlayPause = () => {
		setVideoTime(videoRef.current?.duration);
		if (playing) {
			videoRef.current.pause();
			setPlaying(false);
		} else {
			videoRef.current.play();
			setPlaying(true);
		}
	};

	const handleForward = () => {
		videoRef.current.currentTime += 5;
	};

	const handleBack = () => {
		videoRef.current.currentTime -= 5;
	};

	const handleProgress = (event) => {
		if (isNaN(event.target.duration)) return;

		setCurrentTime(event.target.currentTime);
		setVideoTime(event.target.duration);
		setProgress(
			((event.target.currentTime / event.target.duration) * 100).toFixed(2)
		);
	};

	const handleProgressClick = (event) => {
		const x = (event.clientX * videoTime) / event.currentTarget.offsetWidth - 1;

		videoRef.current.currentTime = x.toFixed(2);
	};

	useEffect(() => {}, [progress]);

	return (
		<div className={`w-[${width}px] relative bg-black`}>
			<video
				ref={videoRef}
				className={`w-full h-full z-0 object-cover`}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(true)}
				onEnded={() => setPlaying(false)}
				onTimeUpdate={handleProgress}
			>
				<source
					src={
						"http://localhost:4000/api/videos/" + video._id + "/" + video.file
					}
					type="video/mp4"
				></source>
				Your browser does not support the video tag.
			</video>

			<div className="flex flex-col h-10 w-full relative z-10 bottom-10 px-10">
				<div className="flex flex-row items-center justify-evenly w-full h-full bg-transparent">
					<button onClick={handleBack}>
						<Icon
							iconName={"back"}
							svgProp={{ fill: "white", width: "40px", height: "40px" }}
						/>
					</button>
					<button onClick={handlePlayPause}>
						<Icon
							iconName={playing ? "pause" : "play"}
							svgProp={{ fill: "white", width: "40px", height: "40px" }}
						/>
					</button>
					<button onClick={handleForward}>
						<Icon
							iconName={"forward"}
							svgProp={{ fill: "white", width: "40px", height: "40px" }}
						/>
					</button>
				</div>

				<div className="flex items-center justify-evenly w-full h-full">
					<p className="text-white">
						{Math.floor(currentTime / 60) +
							":" +
							("0" + Math.floor(currentTime % 60)).slice(-2)}
					</p>
					<progress
						max={100}
						value={progress}
						className="rounded-2xl h-1 w-full z-30 mx-5 accent-white"
						onClick={handleProgressClick}
					/>
					<p className="text-white">
						{Math.floor(videoTime / 60) +
							":" +
							("0" + Math.floor(videoTime % 60)).slice(-2)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default VideoPlayer;
