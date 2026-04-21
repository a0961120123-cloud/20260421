let capture;
let pg; // 宣告離屏畫布變數

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();

  // 1. 產生一個與影像比例相同的離屏畫布
  // 這裡預先設定一個初始大小，draw 裡面會根據畫布縮放比例調整
  pg = createGraphics(640, 480); 
}

function draw() {
  background('#e7c6ff');

  // 計算影像在主畫布顯示的尺寸
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 2. 在離屏畫布上繪製內容（這部分不會直接顯示在主畫布）
  pg.clear(); // 清除上一幀內容，保持透明背景
  pg.fill(255, 0, 0);
  pg.noStroke();
  pg.ellipse(pg.width / 2, pg.height / 2, 50, 50); // 在圖層中間畫一個紅點
  pg.fill(0);
  pg.textAlign(CENTER);
  pg.text("這是覆蓋在影像上的圖層", pg.width / 2, pg.height / 2 + 40);

  // 3. 繪製攝影機影像（處理左右反轉）
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(capture, 0, 0, videoW, videoH);
  pop();

  // 4. 將離屏畫布（pg）顯示在攝影機畫面「上方」
  // 這裡座標跟影像一致，尺寸也設為 videoW, videoH
  image(pg, x, y, videoW, videoH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}