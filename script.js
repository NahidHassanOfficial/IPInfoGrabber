let api = "https://api.techniknews.net/ipgeo/";
let input = document.querySelector("input");
let searchCont = document.querySelector(".icon-cont");
let value = document.querySelectorAll(".value");
let errorMsg = document.querySelector(".result-msg");
let titles = document.querySelectorAll(".title");
let map = document.querySelector("iframe");
let map_div = document.querySelector("map");
let msg = document.querySelector(".msg-visitor");

const visitorInfoGrabber = async () => {
  let infoFetch = await fetch(api);
  let response = await infoFetch.json();

  let typedStrings;
  if (response["country"] === "Israel") {
    typedStrings = [
      `Hello, ${response["ip"]}`,
      "We Hate Israel",
      "Free Palestine ❤️",
    ];
  } else {
    typedStrings = [
      `Hello, ${response["ip"]}`,
      `I Love ${response["country"]} ❤️`,
    ];
  }

  let typed = new Typed(".msg-visitor", {
    strings: typedStrings,
    typeSpeed: 150,
    backSpeed: 150,
    loop: true,
  });
  //msg.innerText = `Hello, ${response["ip"]}`;
};

document.addEventListener("DOMContentLoaded", function () {
  visitorInfoGrabber();

  function handleClick(event) {
    if (
      (event.type === "keydown" && event.key === "Enter") ||
      event.type === "click"
    ) {
      grabInformation(input.value);
    }
  }

  searchCont.addEventListener("click", handleClick);
  input.addEventListener("keydown", handleClick);
});

function blurInfo(radius) {
  value.forEach((element) => {
    element.style.filter = `blur(${radius}px)`;
  });
  map_div.style.filter = `blur(${radius}px)`;
}

function verifyInput(response) {
  if (response["status"] == "fail" || response == "") {
    errorMsg.innerText = "Something Wrong! verify input again";
    blurInfo(4);
    return false;
  } else {
    errorMsg.innerText = "IP Address Information";
    blurInfo(0);
    return true;
  }
}

const grabInformation = async (ip) => {
  let infoFetch = await fetch(`${api}${ip}`);
  let response = await infoFetch.json();

  let judge = verifyInput(response);
  if (judge) {
    titles.forEach((title) => {
      let valueElement = title.nextElementSibling;

      if (title.textContent == "Organization") {
        if (response["org"] == "") value.innerText = "N/A";
        else valueElement.innerText = response["org"];
      } else {
        let data = response[title.textContent.toLowerCase()];
        if (data == "") value.innerText = "N/A";
        else valueElement.innerText = data;
      }
    });

    let lat = response["lat"];
    let lon = response["lon"];

    let mapSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSyAVn6ea2iJcMq9Wp0pKGlr3RpA8SVK1MCM&center=${lat},${lon}&zoom=20`;
    console.log(mapSrc);
    map.src = mapSrc;
  }
};
