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
  picture += EXTENSION;

  // with a probability of 50% swap the two phones
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
  showLabels(false);
}

var cheating = false;
function showLabels(change = true) {
  console.log(change);
  if (change) cheating = !cheating;
  if (cheating) {
    document.getElementById("button1").innerHTML = phone1;
    document.getElementById("button2").innerHTML = phone2;
  } else {
    document.getElementById("button1").innerHTML = "First";
    document.getElementById("button2").innerHTML = "Second";
  }
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
    bcdivs = document.getElementsByClassName("button-container");
    for (var i = 0; i < bcdivs.length; i++) {
      bcdivs[i].style.display = "none";
    }
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
    // get all the divs with button-container and hide them
    bcdivs = document.getElementsByClassName("button-container");
    for (var i = 0; i < bcdivs.length; i++) {
      bcdivs[i].style.display = "none";
    }
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
  const topSectionResults = document.createElement("div");
  topSectionResults.classList.add("top-section-results");
  const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const sortedPoints = Object.entries(totalPoints).sort((a, b) => b[1] - a[1]);
  var i = 0;
  // TODO: change the bar to something nicer, like a cup icon gold/silver/bronze
  for (const [phone, point] of sortedPoints) {
    const phoneDiv = document.createElement("div");
    i++;
    phoneDiv.classList.add(`phone`);
    phoneDiv.innerHTML = `${phone} - ${point}/${maxPointsPerPhone}`;
    // add the cup.svg
    const cup = document.createElement("div");
    cup.innerHTML = `
    <svg fill="${colors[i - 1]}" height="${45 / i + 10}px" width="${
      45 / i + 10
    }px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 489.5 489.5" xml:space="preserve">
<g>
	<path d="M370.75,0h-252v40.3h-86.2v66.2c0,47.6,38.6,86.2,86.2,86.2h11.2c10.8,23.8,28.7,43.6,51,56.8
		c23.4,13.8,37.2,39.6,37.2,66.8v52.3h-30.9c-9.5,0-17.3,7.7-17.3,17.3v22.7h-26.4v80.9h202.3v-80.9h-26.4v-22.7
		c0-9.5-7.7-17.3-17.3-17.3h-30.9v-52.3c0-27.2,13.8-53,37.2-66.8c22.3-13.1,40.3-33,51-56.8h11.3c47.6,0,86.2-38.6,86.2-86.2V40.4
		h-86.2V0z M118.75,149.1c-23.5,0-42.6-19.1-42.6-42.6V84h42.6v56.8c0,2.8,0.1,5.5,0.3,8.2h-0.3V149.1z M279.75,412.5v43.3h-70
		v-43.3H279.75z M252.05,145l-22.1,22l-22-22.1l-21.2-21.4l22.1-22l21.2,21.3l50.7-50.3l22,22.1L252.05,145z M413.35,84v22.5
		c0,23.5-19.1,42.6-42.6,42.6h-0.3c0.2-2.7,0.3-5.5,0.3-8.2V84H413.35z"/>
</g>
</svg>
    `;
    phoneDiv.appendChild(cup);
    topSectionResults.appendChild(phoneDiv);
  }

  const exportButton = document.createElement("button");
  exportButton.innerHTML = "Export results";
  exportButton.onclick = exportResults;
  topSectionResults.appendChild(exportButton);
  resultsDiv.appendChild(topSectionResults);

  // show the comparisons
  for (const [phoneComp1, phoneComp2, picComp, winner] of comparisons) {
    const comparisonDiv = document.createElement("div");
    comparisonDiv.classList.add("result-comparison");
    const picName = document.createElement("h2");
    picName.innerHTML = picComp;
    comparisonDiv.appendChild(picName);
    // comparisonDiv.innerHTML = picComp;
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
