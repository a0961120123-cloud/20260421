let capture;
let pg;
let bubbles = [];
let saveBtn;
const stepSize = 20; // 定義馬賽克單位大小

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 固定攝影機輸入解析度以穩定計算
  capture.hide();

  pg = createGraphics(640, 480); 

  for (let i = 0; i < 50; i++) {
    bubbles.push(new Bubble());
  }

  saveBtn = createButton('擷取黑白影像');
  saveBtn.position(20, 20);
  saveBtn.mousePressed(takeScreenshot);
}

function draw() {
  background('#e7c6ff');

  // 計算主畫布上的顯示尺寸
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let xOffset = (width - videoW) / 2;
  let yOffset = (height - videoH) / 2;

  // --- 1. 處理馬賽克與黑白化 ---
  // 我們先將結果畫在一個暫存的畫布或直接處理
  // 這裡我們直接在主畫布的對應位置繪製
  
  capture.loadPixels(); // 載入攝影機像素資料
  
  if (capture.pixels.length > 0) {
    // 遍歷攝影機影像，每次跳 stepSize 個像素
    for (let y = 0; y < capture.height; y += stepSize) {
      for (let x = 0; x < capture.width; x += stepSize) {
        
        // 取得該像素點的顏色 (注意：這裡取的是每格左上角的顏色作為代表)
        let i = (y * capture.width + x) * 4;
        let r = capture.pixels[i];
        let g = capture.pixels[i + 1];
        let b = capture.pixels[i + 2];

        // 計算平均值取得灰階 (R+G+B)/3
        let gray = (r + g + b) / 3;

        // 繪製馬賽克方塊
        fill(gray); // 使用計算出的灰階值
        noStroke();
        
        // 處理鏡像位置：
        // 原始 x 對應到鏡像後的 (capture.width - x - stepSize)
        let mirroredX = capture.width - x - stepSize;
        
        // 將攝影機座標映射到畫布顯示區域
        let drawX = map(mirroredX, 0, capture.width, xOffset, xOffset + videoW);
        let drawY = map(y, 0, capture.height, yOffset, yOffset + videoH);
        let drawW = videoW / (capture.width / stepSize);
        let drawH = videoH / (capture.height / stepSize);

        rect(drawX, drawY, drawW, drawH);
      }
    }
  }

  // --- 2. 處理泡泡層 ---
  pg.clear();
  for (let b of bubbles) {
    b.move();
    b.display(pg);
    if (b.y < -b.r) b.reset();
  }
  // 將泡泡疊加在馬賽克影像上方
  image(pg, xOffset, yOffset, videoW, videoH);
}

function takeScreenshot() {
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  let img = get(x, y, videoW, videoH);
  save(img, 'grayscale_mosaic.jpg');
}

// Bubble 類別 (略，同前述程式碼)
class Bubble {
  constructor() { this.reset(); }
  reset() {
    this.x = random(0, pg.width);
    this.y = pg.height + random(10, 100);
    this.r = random(5, 20);
    this.speed = random(1, 4);
    this.alpha = random(100, 200);
  }
  move() {
    this.y -= this.speed;
    this.x += random(-0.5, 0.5);
  }
  display(pGraphics) {
    pGraphics.push();
    pGraphics.stroke(255, this.alpha);
    pGraphics.strokeWeight(2);
    pGraphics.fill(255, this.alpha * 0.3);
    pGraphics.ellipse(this.x, this.y, this.r * 2);
    pGraphics.pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}