// Change the following variables to customize the comparison
const PICTURES = 1; // change to the number of pictures you want to compare per device
const devices = ["phone1", "phone2", "phone3"]; // edit and add the devices you want to compare
const EXTENSION = ".png"; // change to .jpg if needed

// first we create a list with all possible combinations of devices and pictures
var combinations = [];
for (var i = 1; i <= PICTURES; i++) {
  for (var j = 0; j < devices.length; j++) {
    for (var k = j + 1; k < devices.length; k++) {
      combinations.push(devices[j] + "_" + devices[k] + "_" + i); // Yes, I know, this could be done with a list of lists
    }
  }
}

const totalComparisons = combinations.length; // used to show the progress in comparison-label
var comparison_count = 0; // current comparison

// increase the comparison count and update the label to keep track of the progress
function nextComparison() {
  comparison_count++;
  document.getElementById(
    "comparison-label"
  ).innerHTML = `Comparison ${comparison_count}/${totalComparisons}`;
}

var device1, device2, picture; // variables to store the current comparison
const comparisons = []; // list to store the comparisons with the winner

function drawPair() {
  if (combinations.length == 0) {
    return;
  }
  // remove a random combination from the list
  const index = Math.floor(Math.random() * combinations.length);
  const pair = combinations[index];
  combinations.splice(index, 1);
  [device1, device2, picture] = pair.split("_"); // update the current comparison
  picture += EXTENSION;

  // with a probability of 50% swap the two devices
  if (Math.random() < 0.5) {
    [device1, device2] = [device2, device1];
  }
  // console.log(device1, device2, picture);
  comparisons.push([device1, device2, picture]);
}

// this is the cheating mode, it shows the device names instead of First and Second
var cheating = false;
function showLabels(change = true) {
  // the change parameter is used to keep the current state when going to the next comparison
  if (change) cheating = !cheating;
  if (cheating) {
    document.getElementById("button1").innerHTML = device1;
    document.getElementById("button2").innerHTML = device2;
  } else {
    document.getElementById("button1").innerHTML = "First";
    document.getElementById("button2").innerHTML = "Second";
  }
}

// go to the next comparison
function loadImages() {
  nextComparison(); // update the comparison label
  drawPair(); // get the next comparison
  // set the two pictures
  const img1 = document.getElementsByClassName("before-image")[0];
  const img2 = document.getElementsByClassName("after-image")[0];
  img1.src = `pics/${device1}/${picture}`;
  img2.src = `pics/${device2}/${picture}`;
  img1.alt = device1;
  img2.alt = device2;
  showLabels(false);
}

// first load
loadImages();

// slider idea from "Live Blogger" on YouTube: https://www.youtube.com/watch?v=zPWVarUHFm8
const slider = document.querySelector(".image-comparison .slider");
const beforeImage = document.querySelector(".image-comparison .before-image");
const sliderLine = document.querySelector(".image-comparison .slider-line");
slider.addEventListener("input", (e) => {
  let sliderValue = e.target.value + "%";
  beforeImage.style.width = sliderValue;
  sliderLine.style.left = sliderValue;
});

// reset the slider to the middle when changing to the next comparison
function resetSlider() {
  slider.value = 50;
  beforeImage.style.width = "50%";
  sliderLine.style.left = "50%";
}

// when the user selects the first image as the winner
function selectImage1() {
  // save the winner and the comparison for the final results
  comparisons[comparisons.length - 1].push(device1);
  // if there are no more comparisons, show the results and hide the (now useless) compontents
  if (combinations.length == 0) {
    document.querySelector(".image-comparison").style.display = "none"; // hide the image comparison
    bcdivs = document.getElementsByClassName("button-container");
    for (var i = 0; i < bcdivs.length; i++) {
      bcdivs[i].style.display = "none"; // hide all the buttons
    }
    document.getElementById("comparison-label").style.display = "none"; // hide the comparison label X/N
    showResults();
  } else {
    // if there are more comparisons, load the next one and reset the slider
    loadImages();
    resetSlider();
  }
}

// when the user selects the second image as the winner (same as selectImage1 but with device2)
function selectImage2() {
  comparisons[comparisons.length - 1].push(device2);
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

// csv export with index, picture, device1, device2, winner
function exportResults() {
  const csv = [];
  csv.push(["index", "picture", "device1", "device2", "winner"]);
  for (const [index, [d1, d2, picComp, winner]] of comparisons.entries()) {
    csv.push([index, picComp, d1, d2, winner]);
  }
  const csvContent =
    "data:text/csv;charset=utf-8," + csv.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "picomparison_results.csv");
  document.body.appendChild(link); // Required for Firefox, I think
  link.click();
}

function showResults() {
  //TODO: change the way data is displayed dividing in two columns
  // Left. with the ranking and the export button
  // Right. with the comparisons

  const resultsDiv = document.getElementById("results");
  const maxPointsPerDevice = PICTURES * (devices.length - 1); // these are the comparison each device appeared

  var totalPoints = {}; // set the points for each device to 0 (this loop is needed in the case of a device not winning any comparison)
  for (var j = 0; j < devices.length; j++) {
    totalPoints[devices[j]] = 0;
  }
  // count the points for each device
  for (const [_, __, ___, winner] of comparisons) {
    totalPoints[winner]++;
  }

  const topSectionResults = document.createElement("div");
  topSectionResults.classList.add("top-section-results");

  const colors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // for the cup of the first three devices

  const sortedPoints = Object.entries(totalPoints).sort((a, b) => b[1] - a[1]);
  var i = 0; //maybe there is a better loop type for this, but I don't know JS very well
  // TODO: change phones to devices
  for (const [phone, point] of sortedPoints) {
    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add(`phone`);
    phoneDiv.innerHTML = `${phone} - ${point}/${maxPointsPerDevice}`;
    // add the cup.svg
    const cup = document.createElement("div");
    // cup svg
    cup.innerHTML = `
    <svg fill="${colors[i]}" height="${45 / (i + 1) + 10}px" width="${
      45 / (i + 1) + 10
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
    i++;
  }

  // add the export button
  const exportButton = document.createElement("button");
  exportButton.innerHTML = "Export results";
  exportButton.onclick = exportResults;
  topSectionResults.appendChild(exportButton);
  resultsDiv.appendChild(topSectionResults);

  // show the comparisons
  for (const [d1, d2, pic, winner] of comparisons) {
    const comparisonDiv = document.createElement("div");
    comparisonDiv.classList.add("result-comparison");
    const picName = document.createElement("h2");
    picName.innerHTML = pic;
    comparisonDiv.appendChild(picName);

    const res1 = document.createElement("div");
    res1.classList.add("result-result");
    const phone1title = document.createElement("h2");
    phone1title.innerHTML = d1;
    res1.appendChild(phone1title);
    const img1 = document.createElement("img");
    img1.src = `pics/${d1}/${pic}`;
    img1.alt = d1;

    const res2 = document.createElement("div");
    res2.classList.add("result-result");
    const phone2title = document.createElement("h2");
    phone2title.innerHTML = d2;
    res2.appendChild(phone2title);
    const img2 = document.createElement("img");
    img2.src = `pics/${d2}/${pic}`;
    img2.alt = d2;

    if (winner === d1) {
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
