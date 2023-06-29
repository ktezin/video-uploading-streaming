import { Link, useLoaderData } from "react-router-dom";

export async function loader() {
	const response = await fetch("http://localhost:5173/api/videos", {
		method: "GET",
	});
	const json = await response.json();
	return { videos: json.videos };
}

export default function Home() {
	const { videos } = useLoaderData();

	return (
		<div className="grid grid-cols-4">
			{videos.length > 0 &&
				videos.map((video, key) => (
					<Link
						to={"/video/" + video._id}
						key={key}
						className="bg-gray-100 w-full h-full rounded-md hover:bg-gray-200"
					>
						<img
							src={
								"http://localhost:4000/uploads/images/" +
								video.file.replace(/\.(mp4|avi|mkv)$/, "-1.webp")
							}
							width={350}
						/>
						<span className="p-2">{video.title}</span>
					</Link>
				))}
		</div>
	);
}
