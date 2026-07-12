const matrixCanvas = document.getElementById('matrixCanvas');
const ctx = matrixCanvas.getContext('2d');

let width = matrixCanvas.width = window.innerWidth;
let height = matrixCanvas.height = window.innerHeight;

const matrix = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()<>{}[]'];
const font_size = 14;
let columns = Math.ceil(width / font_size), drops = [];

// Initializes drops and paints the background
function init() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  drops = Array.from({ length: columns }, () => Math.random() * (height / font_size));
}

function drawMatrix() {
  // Translucent fade
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);
  
  // Quantization fix for ghosting
  ctx.globalCompositeOperation = 'difference';
  ctx.fillStyle = '#010101';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
  
  // Draw the active matrix characters
  ctx.fillStyle = '#0f0';
  ctx.font = `${font_size}px monospace`;
  
  drops.forEach((drop, i) => {
    ctx.fillText(matrix[Math.floor(Math.random() * matrix.length)], i * font_size, drop * font_size);
    if (drop * font_size > height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}

init();

let animationInterval = setInterval(drawMatrix, 35), isPaused = false;

// Toggle pause/play
window.addEventListener('dblclick', () => {
  isPaused ? animationInterval = setInterval(drawMatrix, 35) : clearInterval(animationInterval);
  isPaused = !isPaused;
});

// Graceful resize logic 
window.addEventListener('resize', () => {
  const tempCanvas = document.createElement('canvas');
  const [oldW, oldH, oldCols, oldRows] = [width, height, drops.length, Math.ceil(height / font_size)];
  
  // Snapshot current state
  Object.assign(tempCanvas, { width: oldW, height: oldH }).getContext('2d').drawImage(matrixCanvas, 0, 0);
  
  width = matrixCanvas.width = window.innerWidth;
  height = matrixCanvas.height = window.innerHeight;
  columns = Math.ceil(width / font_size);
  const newRows = Math.ceil(height / font_size);

  // Clear and restore snapshot
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(tempCanvas, 0, 0);

  // Handle array resizing
  drops.length = Math.min(drops.length, columns);
  for (let x = oldCols; x < columns; x++) drops[x] = Math.random() * newRows;

  ctx.font = `${font_size}px monospace`;
  
  // Reusable streak painter for newly exposed canvas areas
  const paintStreaks = (startX, endX, startY) => {
    for (let x = startX; x < endX; x++) {
       let dropY = Math.floor(drops[x]), phase = drops[x] - dropY;
       for (let y = startY; y < newRows; y++) {
           let d = dropY - y;
           if (d < 0) d += newRows;
           let alpha = d === 0 ? 1 : (d > 30 || d < 0 ? 0 : 0.92 ** d);
           
           if (alpha > 0) {
               ctx.fillStyle = alpha === 1 ? '#0f0' : `rgba(0, 255, 0, ${alpha})`;
               ctx.fillText(matrix[Math.floor(Math.random() * matrix.length)], x * font_size, (y + phase) * font_size);
           }
       }
    }
  };

  // Paint right expansion, then bottom expansion
  paintStreaks(oldCols, columns, 0);
  if (newRows > oldRows) paintStreaks(0, oldCols, oldRows);
});