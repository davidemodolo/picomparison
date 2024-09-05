const PICTURES = 1;
const phones = ["phone1", "phone2", "phone3"];
const EXTENSION = ".png";

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

var phone1, phone2, picture;
const comparisons = []; // list to store the comparisons with the winner

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
  picture += EXTENSION;

  if (Math.random() < 0.5) {
    [phone1, phone2] = [phone2, phone1];
  }
  console.log(phone1, phone2, picture);
  comparisons.push([phone1, phone2, picture]);
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
  //TODO: create a cheating button that shows the phone names on the images
}

loadImages();
const slider = document.querySelector(".image-comparison .slider");
const beforeImage = document.querySelector(".image-comparison .before-image");
const sliderLine = document.querySelector(".image-comparison .slider-line");
const sliderIcon = document.querySelector(".image-comparison .slider-icon");

// slider idea from "Live Blogger" on YouTube: https://www.youtube.com/watch?v=zPWVarUHFm8
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
  comparisons[comparisons.length - 1].push(phone1);
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
  comparisons[comparisons.length - 1].push(phone2);
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
  //TODO: change the way data is displayed dividing in two columns
  // 1. with the ranking and the export button
  // 2. with the comparisons

  const resultsDiv = document.getElementById("results");
  const maxPointsPerPhone = PICTURES * (phones.length - 1);

  var totalPoints = {};
  for (var j = 0; j < phones.length; j++) {
    totalPoints[phones[j]] = 0;
  }
  for (const [phoneComp1, phoneComp2, picComp, winner] of comparisons) {
    totalPoints[winner]++;
  }

  const sortedPoints = Object.entries(totalPoints).sort((a, b) => b[1] - a[1]);
  var i = 0;
  // TODO: change the bar to something nicer, like a cup icon gold/silver/bronze
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

  const exportButton = document.createElement("button");
  exportButton.innerHTML = "Export results";
  exportButton.onclick = exportResults;
  resultsDiv.appendChild(exportButton);

  for (const [phoneComp1, phoneComp2, picComp, winner] of comparisons) {
    // create a div with the two images side by side, with the phone name above. The winning image should have the "winning" class and the losing image should have the "losing" class
    const comparisonDiv = document.createElement("div");
    comparisonDiv.classList.add("result-comparison");
    comparisonDiv.innerHTML = picComp;
    const res1 = document.createElement("div");
    res1.classList.add("result-result");
    const phone1title = document.createElement("h2");
    phone1title.innerHTML = phoneComp1;
    res1.appendChild(phone1title);
    const img1 = document.createElement("img");
    img1.src = `pics/${phoneComp1}/${picComp}`;
    img1.alt = phoneComp1;

    const res2 = document.createElement("div");
    res2.classList.add("result-result");
    const phone2title = document.createElement("h2");
    phone2title.innerHTML = phoneComp2;
    res2.appendChild(phone2title);
    const img2 = document.createElement("img");
    img2.src = `pics/${phoneComp2}/${picComp}`;
    img2.alt = phoneComp2;

    if (winner === phoneComp1) {
      img1.classList.add("winning");
      img2.classList.add("losing");
    } else {
      img1.classList.add("losing");
      img2.classList.add("winning");
    }
    res1.appendChild(img1);
    res2.appendChild(img2);
    comparisonDiv.appendChild(res1);
    comparisonDiv.appendChild(res2);
    resultsDiv.appendChild(comparisonDiv);
  }
}

// csv export with index, picture, phone1, phone2, winner
function exportResults() {
  const csv = [];
  csv.push(["index", "picture", "phone1", "phone2", "winner"]);
  for (const [
    index,
    [phoneComp1, phoneComp2, picComp, winner],
  ] of comparisons.entries()) {
    csv.push([index, picComp, phoneComp1, phoneComp2, winner]);
  }
  const csvContent =
    "data:text/csv;charset=utf-8," + csv.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "picomparison_results.csv");
  document.body.appendChild(link); // Required for Firefox
  link.click();
}
