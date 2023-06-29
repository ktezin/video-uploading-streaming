import { useEffect, useRef } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }) {
	const response = await fetch(
		"http://localhost:5173/api/videos/" + params.videoId,
		{
			method: "GET",
		}
	);
	const json = await response.json();
	return { video: json.video };
}

export default function Video() {
	const { video } = useLoaderData();
	const videoRef = useRef(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.removeAttribute("src");
			videoRef.current.load();
		}
	});

	return (
		<>
			{video && (
				<div className="flex flex-col items-center">
					<p>{video.title}</p>
					<video ref={videoRef} width="1280" height="720" controls autoPlay>
						<source
							src={
								"http://localhost:4000/api/videos/" +
								video._id +
								"/" +
								video.file
							}
							type="video/mp4"
						></source>
						Your browser does not support the video tag.
					</video>
				</div>
			)}
		</>
	);
}
