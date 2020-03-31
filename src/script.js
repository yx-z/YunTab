const USER = "Angela";
const BACKGROUND_START_DATE = new Date("Mar 26, 2020");

$(document).ready(() => {
	renderBackground();

	$("#colon").text(":");
	renderTime();
	setInterval(renderTime, 1000);

	chrome.bookmarks.getTree((res) => {
		console.log(res);
	});
});

const renderBackground = () => {
	let days = Math.trunc(Math.floor(new Date().getTime() - BACKGROUND_START_DATE.getTime()) / (1000 * 60 * 60 * 24));
	console.log(`current days: ${days}`);
	chrome.storage.sync.get(["backgroundUrl", "backgroundDays"], (res) => {
		console.log(`cached days: ${res.backgroundDays}`);
		if (res.backgroundDays === days) {
			console.log(`load cached background: ${res.backgroundUrl}`);
			$("#screen").css("background-image", `url(${res.backgroundUrl})`);
		} else {
			let url = `https://api.unsplash.com/search/photos?page=${days}&per_page=1&query=cloud&client_id=b12d733c058d96a9241a5829b3a0bd86d902b0fca341420773d51c9f2ce632d8`;
			fetch(url).then(res => {
				let src = res.json()["results"][0]["urls"]["regular"];
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

let fadedOut = false;
const renderTime = () => {
	const now = new Date();

	let hours = now.getHours();
	if (hours <= 9) {
		hours = "0" + hours;
	}

	let mins = now.getMinutes();
	if (mins <= 9) {
		mins = "0" + mins;
	}

	let range = "night";
	if (hours >= 7) {
		range = "morning";
	}
	if (hours >= 12) {
		range = "afternoon";
	}
	if (hours >= 18) {
		range = "evening";
	}
	if (hours >= 23) {
		range = "night";
	}

	$("#hour").text(hours);
	if (fadedOut) {
		$("#colon").animate({opacity: 1}, 500);
	} else {
		$("#colon").animate({opacity: 0}, 500);
	}
	fadedOut = !fadedOut;
	$("#minute").text(mins);
	$("#greeting").text(`Good ${range}, ${USER} :)`);
};

