let capture;
let pg; 
let bubbles = [];
let saveBtn; // 宣告按鈕變數

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();

  // 產生一個離屏畫布作為泡泡層
  pg = createGraphics(1280, 720); 

  // 初始化泡泡
  for (let i = 0; i < 50; i++) {
    bubbles.push(new Bubble());
  }

  // --- 建立按鈕 ---
  saveBtn = createButton('擷取圖片');
  // 設定按鈕位置（放在畫布下方或旁邊）
  saveBtn.position(20, 20);
  // 當按鈕被點擊時，執行 takeScreenshot 函式
  saveBtn.mousePressed(takeScreenshot);
  
  // 幫按鈕加一點簡單的樣式
  saveBtn.style('padding', '10px 20px');
  saveBtn.style('background-color', '#ffffff');
  saveBtn.style('border', 'none');
  saveBtn.style('border-radius', '5px');
  saveBtn.style('cursor', 'pointer');
}

function draw() {
  background('#e7c6ff');

  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 更新泡泡圖層
  pg.clear(); 
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();      
    bubbles[i].display(pg);  
    if (bubbles[i].y < -bubbles[i].r) {
        bubbles[i].reset();
    }
  }

  // 繪製攝影機影像 (處理左右反轉)
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(capture, 0, 0, videoW, videoH);
  pop();

  // 將泡泡圖層覆蓋在上方
  image(pg, x, y, videoW, videoH);
}

// --- 擷取圖片的函式 ---
function takeScreenshot() {
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 使用 get(x, y, w, h) 擷取畫布中特定範圍的影像
  let img = get(x, y, videoW, videoH);
  
  // 儲存為 jpg 檔案
  save(img, 'my_snapshot.jpg');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Bubble 類別保持不變
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