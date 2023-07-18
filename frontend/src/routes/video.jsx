import { useLoaderData } from "react-router-dom";

import VideoPlayer from "../components/VideoPlayer";

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

	return (
		<>
			{video && (
				<div className="flex flex-col items-center">
					<p>{video.title}</p>
					<VideoPlayer video={video} width={1280} height={720} />
				</div>
			)}
		</>
	);
}
