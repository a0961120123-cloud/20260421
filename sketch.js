let capture;

function setup() {
  // 1. 產生全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 擷取攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML 影片元件，只讓它顯示在畫布上
  capture.hide();
}

function draw() {
  // 3. 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 4. 計算影像顯示的尺寸（畫布寬高的 60%）
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  
  // 5. 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  
  // 6. 將影像繪製在畫布中間
  image(capture, x, y, videoW, videoH);
}

// 確保視窗尺寸改變時，畫布也會跟著自動調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}