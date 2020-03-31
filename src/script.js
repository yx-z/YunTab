const USER = "Angela";
const START_DATE = new Date("Mar 26, 2020");

$(document).ready(() => {
	renderBackground();

	renderTime();
	setInterval(renderTime, 1000);

	chrome.bookmarks.getTree((res) => {
		console.log(res);
	});
});

const renderBackground = () => {
	let days = Math.trunc(Math.floor(new Date().getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
	console.log(`current days: ${days}`);
	chrome.storage.sync.get(["backgroundUrl", "backgroundDays"], (res) => {
		console.log(`cached days: ${res.backgroundDays}`);
		if (res.backgroundDays === days) {
			console.log(`load cached background: ${res.backgroundUrl}`);
			$("#screen").css("background-image", `url(${res.backgroundUrl})`);
		} else {
			let url = `https://api.unsplash.com/search/photos?page=${days}&per_page=1&query=cloud&client_id=b12d733c058d96a9241a5829b3a0bd86d902b0fca341420773d51c9f2ce632d8`;
			fetch(url).then(res => res.json()).then(json => {
				let src = json["results"][0]["urls"]["regular"];
				chrome.storage.sync.set({
					"backgroundDays": days,
					"backgroundUrl": src
				}, () => {
					console.log("fetch succeeded.");
					$("#screen").css("background-image", `url(${src})`)
				});
			}).catch(() => {
				console.log("fetch failed. load default background.");
				$("#screen").css("background-image", "url(res/background.jpg)");
			});
		}
	});
};

const renderTime = () => {
	const now = new Date();
	let sal = "morning";
	let hours = now.getHours();
	let mins = now.getMinutes();

	if (hours < 7) {
		sal = "night";
	}
	if (hours > 12) {
		sal = "afternoon";
	}
	if (hours > 18) {
		sal = "evening";
	}
	if (hours > 23) {
		sal = "night";
	}
	if (hours < 10) {
		hours = "0" + hours;
	}
	if (mins < 10) {
		mins = "0" + mins;
	}

	$("#time").fadeIn("slow", () => {
		$("#hour").text(hours);
		$("#colon").text(":");
		$("#minute").text(mins);
		$("#greeting").text(`Good ${sal}, ${USER}`);
	});
};

