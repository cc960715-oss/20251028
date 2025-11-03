// --- 測驗資料 ---
let questions = [
  {
    q: "建立畫布應該使用哪一個函式？",
    options: ["A. createStage()", "B. canvas()", "C. createCanvas()", "D. setupCanvas()"],
    answer: "C"
  },
  {
    q: "在畫布中央畫一個圓，以下哪一行是正確的？",
    options: ["A. circle(width, height, 50);", "B. ellipse(width/2, height/2, 50, 50);", "C. drawCircle(centerX, centerY, 50);", "D. ellipse(200, 200, 50);"],
    answer: "B"
  },
  {
    q: "如果要設定背景顏色為灰色（RGB值為200），應該使用？",
    options: ["A. fill(200);", "B. paint(200);", "C. background(200);", "D. color(200);"],
    answer: "C"
  },
  {
    q: "想讓圓跟著滑鼠移動，應該怎麼寫？",
    options: ["A. ellipse(mouseX, mouseY, 50, 50);", "B. ellipse(mouse, mouse, 50, 50);", "C. ellipse(cursorX, cursorY, 50, 50);", "D. circle(moveX, moveY, 50);"],
    answer: "A"
  },
  {
    q: "想要偵測滑鼠被按下時執行某段程式，應該用哪個函式？",
    options: ["A. mouseDown()", "B. mousePressed()", "C. onClick()", "D. pressMouse()"],
    answer: "B"
  },
  {
    q: "下列哪個函式會「不斷重複執行」來更新畫面？",
    options: ["A. setup()", "B. refresh()", "C. draw()", "D. loop()"],
    answer: "C"
  },
  {
    q: "在 p5.js 中，width 和 height 分別代表什麼？",
    options: ["A. 視窗寬與高", "B. 畫布的寬與高", "C. 瀏覽器頁面的大小", "D. 畫筆粗細與長度"],
    answer: "B"
  },
  {
    q: "想要畫一條從左上角到右下角的線，應該用？",
    options: ["A. line(0, 0, width, height);", "B. drawLine(0, 0, width, height);", "C. rect(0, 0, width, height);", "D. strokeLine(0, 0, width, height);"],
    answer: "A"
  },
  {
    q: "想要讓顏色隨機變化，哪一行是正確的？",
    options: ["A. fill(random(255), random(255), random(255));", "B. colorChange(255);", "C. randomColor();", "D. fillColor(random(255));"],
    answer: "A"
  },
  {
    q: "以下哪一項會在按下鍵盤時觸發？",
    options: ["A. keyPressed()", "B. keyboardDown()", "C. pressKey()", "D. keyInput()"],
    answer: "A"
  }
];

// --- 專案變數 ---
let selectedQuestions;
let currentQuestionIndex = 0;
let score = 0;
let gameFinished = false;
let allCorrect = false;
let fireworks = [];
const TOTAL_QUESTIONS = 5; // 總題目數固定為 5

// --- 核心 P5.js 函式 ---
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 選擇 5 題
  selectedQuestions = selectFiveQuestions(questions);
  
  // 啟用 HSB 色彩模式以利煙花顏色控制
  colorMode(HSB, 360, 100, 100, 1);
  background(0); // 黑色背景
  textSize(24);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function draw() {
  // 當遊戲未結束時，背景稍微變暗以留下殘影，讓題目更清晰
  if (!gameFinished) {
    background(0, 0, 0, 10); 
    displayQuiz();
  } else {
    // 遊戲結束
    background(0, 0, 0); 
    if (allCorrect) {
        displayFireworks();
    } else {
        displayFailureMessage();
    }
  }
}

function mousePressed() {
  if (gameFinished) return; 

  let q = selectedQuestions[currentQuestionIndex];
  let yStart = height * 0.3;

  for (let i = 0; i < q.options.length; i++) {
    let yPos = yStart + (i + 2) * 60;
    let boxWidth = width * 0.6;
    let boxHeight = 40;
    let xBox = width / 2;

    // 檢查滑鼠是否在選項的矩形區域內
    if (mouseX > xBox - boxWidth / 2 && 
        mouseX < xBox + boxWidth / 2 &&
        mouseY > yPos - boxHeight / 2 && 
        mouseY < yPos + boxHeight / 2) {
          
      // 解析使用者選擇的答案 (A, B, C, D)
      let choice = q.options[i].charAt(0);
      
      if (choice === q.answer) {
        score++;
      }

      // 進入下一題
      currentQuestionIndex++;

      // 檢查是否完成所有題目
      if (currentQuestionIndex >= selectedQuestions.length) {
        gameFinished = true;
        if (score === TOTAL_QUESTIONS) { // 答對五題
          allCorrect = true;
          // 啟動煙花
          for(let i = 0; i < 5; i++) {
             fireworks.push(new Firework());
          }
        }
      }
      break; 
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- 測驗畫面邏輯 ---

function selectFiveQuestions(arr) {
  // 隨機排序並取出前 5 個
  return arr.sort(() => 0.5 - Math.random()).slice(0, TOTAL_QUESTIONS);
}

function displayQuiz() {
  if (currentQuestionIndex < selectedQuestions.length) {
    let q = selectedQuestions[currentQuestionIndex];
    let yStart = height * 0.3;

    // 顯示題目編號和分數
    fill(255);
    textSize(24);
    text(`第 ${currentQuestionIndex + 1} 題 / 共 ${selectedQuestions.length} 題`, width / 2, height * 0.1);
    text(`目前分數: ${score} 分`, width / 2, height * 0.15);

    // 顯示題目
    textSize(32);
    text(q.q, width / 2, yStart);

    // 顯示選項
    textSize(24);
    for (let i = 0; i < q.options.length; i++) {
      let optionText = q.options[i];
      let yPos = yStart + (i + 2) * 60; 
      
      // 繪製可點擊的選項區域
      fill(255, 150); // 半透明白
      let boxWidth = width * 0.6;
      let boxHeight = 40;
      let xBox = width / 2;
      let yBox = yPos;
      
      rect(xBox, yBox, boxWidth, boxHeight, 10); // 圓角矩形

      fill(0); // 黑色文字
      text(optionText, xBox, yBox);
    }
  }
}

// --- 失敗訊息顯示 ---

function displayFailureMessage() {
    let message = "";
    let messageColorHue = 0; // HSB color for the main message

    if (score === 0 || score === 1 || score === 2) {
        message = "菜就多練";
        messageColorHue = random(360); // 隨機閃爍色
    } else if (score === 3) {
        message = "再接再厲，你可以更好";
        messageColorHue = 45; // 黃色
    } else if (score === 4) {
        message = "太棒了！只差一點點！";
        messageColorHue = 30; // 橙色
    }

    // 繪製背景框
    fill(0, 0, 100, 0.8); // 半透明白
    rect(width / 2, height / 2, width * 0.8, height * 0.3, 20); 

    // 顯示分數
    textSize(50);
    fill(0); // 黑色
    text(`最終得分: ${score} / ${selectedQuestions.length}`, width / 2, height / 2 - 50);
    
    // 顯示結果訊息
    textSize(60);
    if (score <= 2) {
        fill(messageColorHue, 100, 100); // 閃爍的隨機顏色
    } else {
        fill(messageColorHue, 100, 100); // 固定顏色
    }
    
    text(message, width / 2, height / 2 + 50);
}


// --- 煙花特效相關類別 (Particle/Firework) ---

class Particle {
  constructor(x, y, hu, firework) {
    this.pos = createVector(x, y);
    this.firework = firework; 
    this.lifespan = 255; 
    this.hu = hu; 

    if (this.firework) {
      this.vel = createVector(0, random(-15, -8)); 
    } else {
      this.vel = p5.Vector.random2D(); 
      this.vel.mult(random(2, 10)); 
    }
    
    this.acc = createVector(0, 0); 
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9); 
      this.lifespan -= 4; 
      this.applyForce(createVector(0, 0.2)); // 重力
    }
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); 
  }

  show() {
    colorMode(HSB, 360, 100, 100, 1);
    strokeWeight(this.firework ? 4 : 2);
    // 設置顏色，爆炸粒子會隨生命週期變淡
    stroke(this.hu, 100, 100, this.lifespan / 255); 
    point(this.pos.x, this.pos.y);
  }
  
  done() {
    return this.lifespan < 0;
  }
}

class Firework {
  constructor() {
    this.hu = random(360); // 隨機色調
    this.firework = new Particle(random(width), height, this.hu, true); 
    this.exploded = false;
    this.particles = [];
    this.gravity = createVector(0, 0.2); 
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(this.gravity);
      this.firework.update();
      
      // 當煙花上升速度轉為向下時，觸發爆炸
      if (this.firework.vel.y >= 0) {
        this.explode();
        this.exploded = true;
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1); 
      }
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) { 
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    
    for (let p of this.particles) {
      p.show();
    }
  }
  
  done() {
    return this.exploded && this.particles.length === 0;
  }
}

// 繪製煙花及勝利訊息
function displayFireworks() {
  // 不斷更新和繪製煙花
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    
    if (fireworks[i].done()) {
      fireworks.splice(i, 1); 
    }
  }
  
  // 顯示勝利訊息
  textSize(50);
  fill(120, 100, 100); // 綠色 (HSB)
  text("恭喜您！全數答對！", width / 2, height / 2 - 50);
  textSize(30);
  fill(255);
  text("您是 P5.js 大師！", width / 2, height / 2 + 50);

  // 如果所有煙花都結束了，持續發射新的煙花以保持特效
  if (fireworks.length < 5) {
      if (frameCount % 60 === 0) { // 每隔 1 秒 (60 幀/秒) 重新發射一個煙花
          fireworks.push(new Firework());
      }
  }
}