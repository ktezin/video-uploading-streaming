function Upload() {
	async function handleUpload(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		await fetch("http://localhost:5173/api/video", {
			method: "POST",
			body: formData,
		});
	}

	return (
		<form onSubmit={handleUpload}>
			<input
				type="text"
				name="title"
				placeholder="Title..."
				className="w-full"
			/>
			<input type="file" name="files" accept="video/*" className="w-full" />
			<button
				type="submit"
				className="w-full p-1 bg-red-500 text-white rounded-sm hover:bg-red-600"
			>
				Upload video
			</button>
		</form>
	);
}

export default Upload;
