// Function to update the content of an element
function updateContent(id, content) {
  const el = document.getElementById(id);
  if (el) el.textContent = content;
}

// Helpers for the user agent parser
const uap = new UAParser();
const result = uap.getResult();

// 1-3. IP, ISP, and Location
async function getIPLocationISP() {
  try {
    const infoResponse = await fetch(
      `https://ipinfo.io/json?token=a360ac5bbb8e16`
    );
    const infoData = await infoResponse.json();

    const ip = infoData.ip;
    updateContent("ipAddress", "IP Address: " + ip);
    updateContent("isp", "ISP: " + infoData.org);

    const { city, region, country } = infoData;
    const locationString = `${city}, ${region}, ${country}`;
    updateContent("location", "Location: " + locationString);
  } catch (error) {
    console.error("Error fetching IP/location:", error);
    updateContent("ipAddress", "IP Address: error");
    updateContent("isp", "ISP: error");
    updateContent("location", "Location: error");
  }
}
getIPLocationISP();

// 4. Region
const specificTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
updateContent("specificTimeZone", "Region: " + specificTimeZone);

// 5. Timezone
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

// 6. User Time
function updateUserTime() {
  var localTime = new Date();
  updateContent("userTime", "Local Time: " + localTime.toLocaleTimeString());
}
updateUserTime();
setInterval(updateUserTime, 1000);

// 7. Language
var language = navigator.language;
updateContent("language", "Browser Language: " + language);

// 8-9. Battery & Charging
if (navigator.getBattery) {
  navigator.getBattery().then(function (battery) {
    function updateBatteryContent() {
      const level = Math.round(battery.level * 100);
      updateContent("battery", "Battery Level: " + level + "%");
      updateContent("batteryCharging", "Battery Charging: " + (battery.charging ? "Yes" : "No"));
    }
    
    updateBatteryContent();
    battery.addEventListener("levelchange", updateBatteryContent);
    battery.addEventListener("chargingchange", updateBatteryContent);
    setInterval(updateBatteryContent, 60000);
  });
} else {
  updateContent("battery", "Battery Level: unsupported");
  updateContent("batteryCharging", "Battery Charging: unsupported");
}

// 10. Orientation
function updateOrientation() {
  let orientationVal = "unsupported";
  if (screen.orientation && screen.orientation.type) {
    orientationVal = screen.orientation.type;
  } else if (typeof window.orientation === "number") {
    orientationVal = window.orientation;
  }
  updateContent("orientation", "Orientation: " + orientationVal);
}
updateOrientation(); 
window.addEventListener("orientationchange", updateOrientation);

// 11. Device Orientation
window.addEventListener('deviceorientation', function(event) {
    if (event.alpha !== null) {
        updateContent("deviceOrientationEvent", `Alpha: ${Math.round(event.alpha)}°, Beta: ${Math.round(event.beta)}°, Gamma: ${Math.round(event.gamma)}°`);
    } else {
        updateContent("deviceOrientationEvent", "Orientation Event: unsupported/no data");
    }
}, true);

// 12. Device Motion
window.addEventListener('devicemotion', function(event) {
    const acc = event.acceleration;
    if (acc && acc.x !== null) {
        updateContent("deviceMotion", `X: ${acc.x.toFixed(2)}, Y: ${acc.y.toFixed(2)}, Z: ${acc.z.toFixed(2)}`);
    } else {
        updateContent("deviceMotion", "Motion Event: unsupported/no data");
    }
}, true);

// 13. Touch Screen
var isTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
updateContent("touchScreen", "Touch Screen: " + (isTouchScreen ? "Yes" : "No"));

// 14. Screen Size
function updateScreenSize() {
  updateContent("screenSize", "Screen Size: " + screen.width + "x" + screen.height);
}
updateScreenSize();
setInterval(updateScreenSize, 60000);

// 15. Usable Space
function updateResolution() {
  const availWidth = window.screen.availWidth;
  const availHeight = window.screen.availHeight;
  updateContent("resolution", "Usable Space: " + availWidth + "x" + availHeight);
}
updateResolution();
setInterval(updateResolution, 60000);

// 16. Color Depth
const colorDepth = window.screen.colorDepth;
updateContent("colorDepth", "Color Depth: " + colorDepth + "-bit");

// 17. Dark Mode Preference
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
updateContent("colorScheme", "Prefers Dark Mode: " + (isDarkMode ? "Yes" : "No"));

// 18. Reduced Motion 
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
updateContent("reducedMotion", "Prefers Reduced Motion: " + (prefersReducedMotion ? "Yes" : "No"));

// 19. Incognito Mode
if (typeof detectIncognito !== 'undefined') {
  detectIncognito().then((result) => {
    updateContent("incognito", "Incognito Mode: " + (result.isPrivate ? "Yes" : "No"));
  }).catch((error) => {
    console.error("Incognito detection error:", error);
    updateContent("incognito", "Incognito Mode: error");
  });
} else {
  updateContent("incognito", "Incognito Mode: blocked/unsupported");
}

// 20. Ad Blocker
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

// 21. Do Not Track
const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
updateContent("dnt", "Do Not Track: " + (dnt === "1" || dnt === "yes" ? "Enabled" : "Disabled"));

// 22. Cookies
updateContent("cookieEnabled", "Cookies Enabled: " + (navigator.cookieEnabled ? "Yes" : "No"));

// 23. Platform
var platform = navigator.platform;
updateContent("platform", "Platform: " + platform);

// 24. Browser
const browserName = result.browser.name;
const browserVersion = result.browser.version;
updateContent("browser", "Browser: " + browserName + " " + browserVersion);

// 25. Engine
const engineName = result.engine.name;
const engineVersion = result.engine.version;
updateContent("engine", "Engine: " + (engineName ? engineName + " " + engineVersion : "unknown"));

// 26. Operating System
const osName = result.os.name;
const osVersion = result.os.version;
updateContent("os", "Operating System: " + osName + " " + osVersion);

// 27. Device
const deviceVendor = result.device.vendor;
const deviceModel = result.device.model;
updateContent("device", "Device: " + (deviceVendor || deviceModel ? deviceVendor + " " + deviceModel : "unknown"));

// 28. User Agent
var userAgent = navigator.userAgent;
updateContent("userAgent", "User Agent: " + userAgent);

// 29-30. GPU Info
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        updateContent("gpuVendor", "GPU Vendor: " + vendor);
        updateContent("gpuRenderer", "GPU Renderer: " + renderer);
    } else {
        updateContent("gpuVendor", "GPU Vendor: extension unsupported");
        updateContent("gpuRenderer", "GPU Renderer: extension unsupported");
    }
} else {
    updateContent("gpuVendor", "GPU Vendor: WebGL unsupported");
    updateContent("gpuRenderer", "GPU Renderer: WebGL unsupported");
}

// 31. CPU Cores
const cpuCores = navigator.hardwareConcurrency;
updateContent("cpuCores", "Logical Cores: " + (cpuCores ? cpuCores : "unsupported"));

// 32. Device RAM
const deviceMemory = navigator.deviceMemory;
updateContent("ram", "Approximate RAM: " + (deviceMemory ? deviceMemory + " GB" : "unknown"));

// 33-35. Connected Hardware
if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        const counts = { videoinput: 0, audioinput: 0, audiooutput: 0 };
        devices.forEach(device => {
            if (counts[device.kind] !== undefined) counts[device.kind]++;
        });
        updateContent("mics", "Microphones: " + counts.audioinput);
        updateContent("cameras", "Cameras: " + counts.videoinput);
        updateContent("speakers", "Speakers: " + counts.audiooutput);
    }).catch(error => {
        updateContent("mics", "Microphones: blocked");
        updateContent("cameras", "Cameras: blocked");
        updateContent("speakers", "Speakers: blocked");
    });
} else {
    updateContent("mics", "Microphones: unsupported");
    updateContent("cameras", "Cameras: unsupported");
    updateContent("speakers", "Speakers: unsupported");
}

// 36-38. Network Connection
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (connection) {
    updateContent("networkType", "Effective Type: " + connection.effectiveType);
    updateContent("downlink", "Downlink Speed: " + connection.downlink + " Mbps");
    updateContent("dataSaver", "Data Saver Enabled: " + (connection.saveData ? "Yes" : "No"));
} else {
    updateContent("networkType", "Effective Type: unsupported");
    updateContent("downlink", "Downlink Speed: unsupported");
    updateContent("dataSaver", "Data Saver Enabled: unsupported");
}

// 39-41. Installed Fonts Detection
function checkFont(fontName) {
    const fontCanvas = document.createElement("canvas");
    const context = fontCanvas.getContext("2d");
    const text = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    context.font = "72px monospace";
    const baselineWidth = context.measureText(text).width;
    
    context.font = "72px '" + fontName + "', monospace";
    const fontWidth = context.measureText(text).width;
    
    return baselineWidth !== fontWidth;
}

updateContent("fontArial", "Arial: " + (checkFont("Arial") ? "Installed" : "Not Installed"));
updateContent("fontConsolas", "Consolas: " + (checkFont("Consolas") ? "Installed" : "Not Installed"));
updateContent("fontTimes", "Times New Roman: " + (checkFont("Times New Roman") ? "Installed" : "Not Installed"));