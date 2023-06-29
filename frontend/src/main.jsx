import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Video, { loader as videoLoader } from "./routes/video";
import Upload from "./routes/upload";
import Home, { loader as videosLoader } from "./routes/home";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "/",
				element: <Home />,
				loader: videosLoader,
			},
			{
				path: "/upload",
				element: <Upload />,
			},
			{
				path: "/video/:videoId",
				element: <Video />,
				loader: videoLoader,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
