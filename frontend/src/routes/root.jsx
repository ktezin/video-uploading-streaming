import { Outlet } from "react-router-dom";

function Root() {
	return (
		<div className="container mx-auto p-6 px-12">
			<header className="w-full flex items-center justify-between py-6">
				<a href="/">Home</a>
				<a href="/upload">Upload</a>
			</header>
			<Outlet />
		</div>
	);
}

export default Root;
