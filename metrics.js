const metrics = [
  { id: "ipAddress", label: "IP Address" },
  { id: "isp", label: "ISP" },
  { id: "location", label: "Location" },
  { id: "specificTimeZone", label: "Region" },
  { id: "timezone", label: "Timezone" },
  { id: "userTime", label: "User Time" },
  { id: "language", label: "Language" },
  { id: "battery", label: "Battery" },
  { id: "batteryCharging", label: "Charging" },
  { id: "orientation", label: "Orientation" },
  { id: "deviceOrientationEvent", label: "Device Orientation" },
  { id: "deviceMotion", label: "Device Motion" },
  { id: "touchScreen", label: "Touch Screen" },
  { id: "screenSize", label: "Screen Size" },
  { id: "resolution", label: "Usable Size" },
  { id: "colorDepth", label: "Color Depth" },
  { id: "colorScheme", label: "Dark Mode" },
  { id: "reducedMotion", label: "Reduced Motion" },
  { id: "incognito", label: "Incognito Mode" },
  { id: "adBlocker", label: "Ad Blocker" },
  { id: "dnt", label: "Do Not Track" },
  { id: "cookieEnabled", label: "Cookies Enabled" },
  { id: "platform", label: "Platform" },
  { id: "browser", label: "Browser" },
  { id: "engine", label: "Engine" },
  { id: "os", label: "Operating System" },
  { id: "device", label: "Device" },
  { id: "userAgent", label: "User Agent" },
  { id: "gpuVendor", label: "GPU Vendor" },
  { id: "gpuRenderer", label: "GPU Renderer" },
  { id: "cpuCores", label: "CPU Cores" },
  { id: "ram", label: "Device RAM" },
  { id: "mics", label: "Microphones" },
  { id: "cameras", label: "Cameras" },
  { id: "speakers", label: "Speakers" },
  { id: "networkType", label: "Network Type" },
  { id: "downlink", label: "Downlink Speed" },
  { id: "dataSaver", label: "Data Saver" },
  { id: "fontArial", label: "Font 1" },
  { id: "fontConsolas", label: "Font 2" },
  { id: "fontTimes", label: "Font 3" }
];

// Grab the footer element from the document
const footer = document.querySelector('.footer');

// Generate the HTML for all sections
const sectionsHtml = metrics.map(metric => `
  <section>
    <h2>${metric.label}</h2>
    <p id="${metric.id}">Loading...</p>
  </section>
`).join('');

// Insert them as direct children of the body
footer.insertAdjacentHTML('beforebegin', sectionsHtml);