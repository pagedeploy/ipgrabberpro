// Function to update the content of an element
function updateContent(id, content) {
  document.getElementById(id).textContent = content;
}

// IP, Location, and ISP
async function getIPLocationISP() {
  try {
    const infoResponse = await fetch(
      `https://ipinfo.io/json?token=a360ac5bbb8e16`
    );
    const infoData = await infoResponse.json();

    const ip = infoData.ip;
    updateContent("ipAddress", "IP Address: " + ip);

    const { city, region, country } = infoData;
    const locationString = `${city}, ${region}, ${country}`;
    updateContent("location", "Location: " + locationString);
    updateContent("isp", "ISP: " + infoData.org);
  } catch (error) {
    console.error("Error fetching IP/location:", error);
    updateContent("ipAddress", "IP Address: error");
    updateContent("location", "Location: error");
    updateContent("isp", "ISP: error");
  }
}

getIPLocationISP();

// Language
var language = navigator.language;
updateContent("language", "Browser Language: " + language);

// Timezone
var timezoneOffset = new Date().getTimezoneOffset();
var timezoneSign = timezoneOffset > 0 ? "-" : "+";
var timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
var timezoneMinutes = Math.abs(timezoneOffset) % 60;
var timezoneString =
  "GMT" +
  timezoneSign +
  timezoneHours +
  ":" +
  (timezoneMinutes < 10 ? "0" : "") +
  timezoneMinutes;
updateContent("timezone", "Timezone: " + timezoneString);

// User Time - Update every second
function updateUserTime() {
  var localTime = new Date();
  updateContent("userTime", "Local Time: " + localTime.toLocaleTimeString());
}
updateUserTime();
setInterval(updateUserTime, 1000);

// Battery - Update every minute
function updateBattery() {
  if (navigator.getBattery) {
    navigator.getBattery().then(function (battery) {
      const level = Math.round(battery.level * 100);
      updateContent("battery", "Battery Level: " + level + "%");
    });
  } else {
    updateContent("battery", "Battery Level: unsupported");
  }
}
updateBattery();
setInterval(updateBattery, 60000);

// Orientation
window.addEventListener("orientationchange", function () {
  updateContent("orientation", "Orientation: " + window.orientation);
});

// Touch Screen
var isTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
updateContent("touchScreen", "Touch Screen: " + (isTouchScreen ? "Yes" : "No"));

// Screen Size - Update every minute
function updateScreenSize() {
  updateContent(
    "screenSize",
    "Screen Size: " + screen.width + "x" + screen.height
  );
}
updateScreenSize();
setInterval(updateScreenSize, 60000);

// Incognito Mode
detectIncognito().then((result) => {
  updateContent(
    "incognito",
    "Incognito Mode: " + (result.isPrivate ? "Yes" : "No")
  );
});

// Ad Blocker
var ADS_URL = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

function checkAdsBlocked(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      callback(xhr.status === 0 || xhr.responseURL !== ADS_URL);
    }
  };
  xhr.open("HEAD", ADS_URL, true);
  xhr.send(null);
}

checkAdsBlocked(function (adBlocker) {
  updateContent("adBlocker", "Ad Blocker: " + (adBlocker ? "Yes" : "No"));
});

// Platform
var platform = navigator.platform;
updateContent("platform", "Platform: " + platform);

// UA Parser
const uap = new UAParser();
const result = uap.getResult();

// Browser
const browserName = result.browser.name;
const browserVersion = result.browser.version;
updateContent("browser", "Browser: " + browserName + " " + browserVersion);

// Operating System
const osName = result.os.name;
const osVersion = result.os.version;
updateContent("os", "Operating System: " + osName + " " + osVersion);

// Device
const deviceVendor = result.device.vendor;
const deviceModel = result.device.model;
updateContent("device", "Device: " + deviceVendor + " " + deviceModel);

// User Agent
var userAgent = navigator.userAgent;
updateContent("userAgent", "User Agent: " + userAgent);