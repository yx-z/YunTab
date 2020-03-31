const START_DATE = new Date("Mar 26, 2020");

$(document).ready(() => {
  let days = Math.floor(new Date().getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24);
  fetch(`https://api.unsplash.com/search/photos?page=${days}&per_page=1&query=cloud&client_id=b12d733c058d96a9241a5829b3a0bd86d902b0fca341420773d51c9f2ce632d8`)
    .then(response => response.json())
    .then(json => {
      let src = json["results"][0]["urls"]["regular"];
      $(".full-screen").css("background-image", `url(${src})`);
    });
  calcTime();
  setInterval(calcTime, 1000);
});

const calcTime = () => {
  const now = new Date();
  let sal = "morning";
  let hours = now.getHours();
  let mins = now.getMinutes();

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

  renderTime(hours, mins, sal);
};

const renderTime = (hours, mins, sal) => {
  $(".content").fadeIn("slow", () => {
    $(".time").text(`${hours}:${mins}`);
    $(".greetings").text(`Good ${sal}, David`);
  });
};

