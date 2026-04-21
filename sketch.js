let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();
}

function draw() {
  background('#e7c6ff');
  
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  
  // 開始調整座標系統
  push();
  
  // 為了讓影像水平翻轉，我們需要：
  // 1. 將座標原點移到影像的右邊緣
  // 2. 將 X 軸縮放為 -1 (反轉)
  translate(x + videoW, y); 
  scale(-1, 1);
  
  // 此時繪製的影像會是鏡像後的正確畫面
  image(capture, 0, 0, videoW, videoH);
  
  // 結束調整，恢復預設狀態
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}