const PICTURES = 6;
const phones = ["phone1", "phone2", "phone3"];

// create a list with all possible combinations of two phones and pictures
var combinations = [];
for (var i = 1; i <= PICTURES; i++) {
  for (var j = 0; j < phones.length; j++) {
    for (var k = j + 1; k < phones.length; k++) {
      combinations.push(phones[j] + "_" + phones[k] + "_" + i);
    }
  }
}

const totalComparisons = combinations.length;
var comparison_count = 0;
function nextComparison() {
  comparison_count++;
  document.getElementById(
    "comparison-label"
  ).innerHTML = `Comparison ${comparison_count}/${totalComparisons}`;
}

// dictionary to store the number of points for each image for each phone
var points = {};
for (var j = 0; j < phones.length; j++) {
  points[phones[j]] = 0;
}

function addPoint(phone, picture) {
  points[phone]++;
}

var phone1, phone2, picture;

function drawPair() {
  if (combinations.length == 0) {
    return;
  }
  // remove the combination from the list
  const index = Math.floor(Math.random() * combinations.length);
  const pair = combinations[index];
  combinations.splice(index, 1);
  [phone1, phone2, picture] = pair.split("_");
  // with a probability of 50% swap the two phones
  picture += ".jpg";

  if (Math.random() < 0.5) {
    [phone1, phone2] = [phone2, phone1];
  }
  console.log(phone1, phone2, picture);
}

function loadImages() {
  nextComparison();
  drawPair();
  const img1 = document.getElementsByClassName("before-image")[0];
  const img2 = document.getElementsByClassName("after-image")[0];
  img1.src = `pics/${phone1}/${picture}`;
  img2.src = `pics/${phone2}/${picture}`;
  img1.alt = phone1;
  img2.alt = phone2;
}

loadImages();
const slider = document.querySelector(".image-comparison .slider");
const beforeImage = document.querySelector(".image-comparison .before-image");
const sliderLine = document.querySelector(".image-comparison .slider-line");
const sliderIcon = document.querySelector(".image-comparison .slider-icon");

slider.addEventListener("input", (e) => {
  let sliderValue = e.target.value + "%";

  beforeImage.style.width = sliderValue;
  sliderLine.style.left = sliderValue;
});

function resetSlider() {
  slider.value = 50;
  beforeImage.style.width = "50%";
  sliderLine.style.left = "50%";
}

function selectImage1() {
  addPoint(phone1, picture);
  if (combinations.length == 0) {
    document.querySelector(".image-comparison").style.display = "none";
    document.getElementById("button-container").style.display = "none";
    document.getElementById("comparison-label").style.display = "none";
    showResults();
  } else {
    loadImages();
    resetSlider();
  }
}

function selectImage2() {
  addPoint(phone2, picture);
  if (combinations.length == 0) {
    document.querySelector(".image-comparison").style.display = "none";
    document.getElementById("button-container").style.display = "none";
    document.getElementById("comparison-label").style.display = "none";
    showResults();
  } else {
    loadImages();
    resetSlider();
  }
}

function showResults() {
  document.getElementById("results_button").style.display = "none";
  const resultsDiv = document.getElementById("results");
  const maxPointsPerPhone = PICTURES * (phones.length - 1);
  const sortedPoints = Object.entries(points).sort((a, b) => b[1] - a[1]);
  var i = 0;
  for (const [phone, point] of sortedPoints) {
    const percentage = (point / maxPointsPerPhone) * 100;
    const phoneDiv = document.createElement("div");
    i++;
    phoneDiv.classList.add(`phone${i}`);
    phoneDiv.innerHTML = `
      <div class="phone-name"><h2>${phone}</h2></div>
        <div class="phone-points"><h2>${point}/${maxPointsPerPhone}</h2></div>
        <div class="phone-bar" style="width: ${percentage}%"></div>
    `;
    resultsDiv.appendChild(phoneDiv);
  }
}
