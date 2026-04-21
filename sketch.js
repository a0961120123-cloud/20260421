let capture;
let pg; 
let bubbles = []; // 1. 宣告一個陣列來儲存所有泡泡

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();

  // 產生一個離屏畫布，解析度設定高一點以維持清晰度
  pg = createGraphics(1280, 720); 

  // 2. 初始化一些泡泡 (例如 50 顆)
  for (let i = 0; i < 50; i++) {
    bubbles.push(new Bubble());
  }
}

function draw() {
  background('#e7c6ff');

  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // --- 在離屏畫布 (pg) 上處理泡泡 ---
  pg.clear(); // 清除上一幀，保持透明背景
  
  // 遍歷陣列中的每一顆泡泡
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();      // 讓泡泡移動
    bubbles[i].display(pg);  // 繪製泡泡到 pg 圖層上
    
    // 如果泡泡漂出了螢幕頂端，就讓它從底部重置
    if (bubbles[i].y < -bubbles[i].r) {
        bubbles[i].reset();
    }
  }
  // ---------------------------------

  // 繪製攝影機影像 (處理左右反轉)
  push();
  translate(x + videoW, y);
  scale(-1, 1);
  image(capture, 0, 0, videoW, videoH);
  pop();

  // 將有泡泡效果的圖層，覆蓋在攝影機畫面「上方」
  image(pg, x, y, videoW, videoH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 3. 定義 Bubble 類別
class Bubble {
  constructor() {
    this.reset();
  }

  // 重置泡泡的狀態 (初始化或從底部重新開始)
  reset() {
    // 讓泡泡在離屏畫布的寬度範圍內隨機出現
    this.x = random(0, pg.width);
    // 初始位置在畫布下方一點點
    this.y = pg.height + random(10, 100);
    // 隨機半徑 (5 到 20)
    this.r = random(5, 20);
    // 隨機向上速度 (1 到 4)
    this.speed = random(1, 4);
    // 隨機透明度 (100 到 200, 讓有些泡泡看起來較遠)
    this.alpha = random(100, 200);
  }

  // 移動行為
  move() {
    // 向上移動
    this.y -= this.speed;
    // 加入一點點水平晃動效果 (Jiggle)
    this.x += random(-0.5, 0.5);
  }

  // 顯示行為 (需要指定繪製在哪個 graphics 物件上)
  display(pGraphics) {
    pGraphics.push();
    // 設定白色邊框，並加上透明度
    pGraphics.stroke(255, this.alpha);
    pGraphics.strokeWeight(2);
    // 設定半透明白色填充 (更像泡泡)
    pGraphics.fill(255, this.alpha * 0.3);
    
    // 繪製圓形
    pGraphics.ellipse(this.x, this.y, this.r * 2);
    
    // 加一個小小的「高光」圓點，讓它看起來更立體
    pGraphics.noStroke();
    pGraphics.fill(255, this.alpha * 0.5);
    pGraphics.ellipse(this.x - this.r/3, this.y - this.r/3, this.r/2);
    
    pGraphics.pop();
  }
}