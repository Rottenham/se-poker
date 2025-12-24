// 初始化
let submit_btn = document.getElementById("submit-btn");
submit_btn.disabled = true;
submit_btn.value = "加载中...";
var font_kaiti = new FontFace("楷体", "url(kaiti.ttf)");
font_kaiti.load().then(function (font_k) {
  document.fonts.add(font_k);
  var font_poker = new FontFace("Poker", "url(card.ttf)");
  font_poker.load().then(function (font_p) {
    document.fonts.add(font_p);
    submitForm(true);
    let submit_btn = document.getElementById("submit-btn");
    submit_btn.disabled = false;
    submit_btn.value = "生成扑克";
  });
});
var cvs = document.getElementById("myCanvas");
setDPI(cvs, 300, 1087, 720);
var ctx = cvs.getContext("2d");
ctx.textBaseline = "top";

// 提交表单
function submitForm(suppressNoImageWarning) {
  let author = getAuthors();
  if (!author) {
    return;
  }
  let name = getName();
  if (!name) {
    return;
  }
  let num = getPokerNum();
  let suit = getPokerSuit();
  let mark_type = getPokerMark();
  let stamp_type = getPokerStamp();
  let scene = getScene();
  var puzzle_img = getImage(suppressNoImageWarning);
  if (!puzzle_img) {
    generatePoker(puzzle_img, author, name, num, suit, mark_type, stamp_type, scene, true, false);
  } else {
    puzzle_img.onload = function (e) {
      let isPokerStyle = false;
      if (this.height !== 600) {
        alert("阵图高度应为600px");
        return;
      }
      if (this.width === 917) {
        isPokerStyle = true;
      }
      else if (this.width === 800) {
        isPokerStyle = false;
      } else {
        alert("阵图宽度应为800px（游戏等宽）或917px（扑克等宽）");
        return;
      }
      generatePoker(puzzle_img, author, name, num, suit, mark_type, stamp_type, scene, false, isPokerStyle);
    };
  }
}

// 获得作者字符串
function getAuthors() {
  let authors_input = document.getElementsByName("author");
  let authors = new Array();
  for (let i = 0; i < authors_input.length; i++) {
    if (!authors_input[i].value) {
      alert("第" + String(i + 1) + "名作者ID为空");
      return null;
    }
    authors[i] = authors_input[i].value;
  }
  let years_input = document.getElementsByName("year");
  let years = new Array();
  for (let i = 0; i < years_input.length; i++) {
    if (!years_input[i].value) {
      alert("第" + String(i + 1) + "个年份为空");
      return null;
    }
    years[i] = years_input[i].value;
  }
  if (authors.length != years.length) {
    alert("作者ID数与年份数不匹配");
    return null;
  }
  if (authors.length === 0) {
    alert("作者ID输入为空");
    return null;
  }
  let ans = "";
  while (authors.length > 0) {
    auth_list = "";
    let min_year = parseInt(years[0]);
    for (let i = 1; i < years.length; i++) {
      if (parseInt(years[i]) < min_year) {
        min_year = years[i];
      }
    }
    min_year = String(min_year);
    for (let i = 0; i < years.length;) {
      if (years[i] === min_year) {
        if (auth_list.length > 0) {
          auth_list += "，";
        }
        auth_list += authors[i];
        authors.splice(i, 1);
        years.splice(i, 1);
      } else {
        i++;
      }
    }
    if (ans.length > 0) {
      ans += "，";
    }
    ans += auth_list + " (" + min_year + ")";
  }
  return ans;
}

// 获得阵型名
function getName() {
  let name = document.getElementById("name").value;
  if (!name) {
    alert("阵型名为空");
    return null;
  }
  return name;
}

// 获得场地
function getScene() {
  let e = document.getElementById("scene");
  return e.options[e.selectedIndex].text.toLowerCase();
}

// 获得点数
function getPokerNum() {
  let e = document.getElementById("poker_num");
  const text = e.options[e.selectedIndex].text;
  return text === "无" ? null : text;
}

// 获得花色
function getPokerSuit() {
  let e = document.getElementById("poker_suit");
  const value = e.value;
  return value === "无" ? null : value;
}

// 获得角标
function getPokerMark() {
  let e = document.getElementById("poker_mark");
  return e.options[e.selectedIndex].text;
}

// 获得印章
function getPokerStamp() {
  let e = document.getElementById("poker_stamp");
  return e.options[e.selectedIndex].text;
}

// 获得阵图
function getImage(suppressNoImageWarning) {
  let file = document.getElementById("file");
  if (file.files.length === 0) {
    if (!suppressNoImageWarning) alert("未上传阵图，将使用默认图片");
    return null;
  }
  let img = new Image();
  img.src = URL.createObjectURL(file.files[0]);
  return img;
}

// 获得绘制坐标
function getDrawImageCoords(isPokerStyle) {
  if (!isPokerStyle) {
    return [222, 108, 675, 506];
  } else {
    return [171, 108, 774, 506];
  }
}

// 绘制
function generatePoker(puzzle_img, author, name, num, suit, mark_type, stamp_type, scene, useMockImage, isPokerStyle) {
  const [dx, dy, dw, dh] = getDrawImageCoords(isPokerStyle);
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  drawWhiteBackground(ctx);
  drawAuthor(ctx, author);
  drawName(ctx, name);
  scene_img = new Image();
  scene_img.src = `images/场地/${scene}.png`;
  scene_img.onload = function (e) {
    ctx.drawImage(scene_img, 109, 108, 871, 506);
    if (useMockImage) {
      ctx.fillStyle = "#5253b0";
      ctx.fillRect(dx, dy, dw, dh);
      ctx.fillStyle = "black";
    } else {
      ctx.drawImage(puzzle_img, dx, dy, dw, dh);
    }
    frame_img = new Image();
    frame_img.src = "images/frame.png";
    frame_img.onload = function (e) {
      ctx.drawImage(frame_img, 0, 0);
      poem_img = new Image();
      poem_img.src = "images/poem.png";
      poem_img.onload = function (e) {
        ctx.drawImage(poem_img, 0, 0);
        drawSuit(ctx, suit, num);
        drawNumber(ctx, num, suit);
        drawMark(ctx, mark_type);
        drawStamp(ctx, stamp_type);
      };
    };
  };
}

// 绘制白底
function drawWhiteBackground(ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = "black";
}

// 绘制阵型作者
function drawAuthor(ctx, author) {
  ctx.textAlign = "left";
  ctx.font = "25px 楷体";
  ctx.fillText(author, 103, 72);
}

// 绘制阵型名
function drawName(ctx, name) {
  ctx.textAlign = "right";
  ctx.font = "29.17px 楷体";
  ctx.fillText(name, 984, 632);
  ctx.textAlign = "left";
}

// 绘制花色
function drawSuit(ctx, suit, num) {
  if (!suit || ["小王", "大王"].includes(num)) {
    console.log("无需绘制花色");
    return;
  }
  suit_img = new Image();
  suit_img.src = "images/花色/" + suit.toLowerCase() + ".png";
  suit_img.onload = function (e) {
    ctx.save();
    ctx.translate(936, 60);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(suit_img, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(151, 660);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(suit_img, 0, 0);
    ctx.restore();
  }
}

// 绘制角标
function drawMark(ctx, mark_type) {
  if (mark_type === "无") {
    console.log("无需绘制角标");
    return;
  }
  mark_img = new Image();
  mark_img.src = `images/角标/${mark_type}.png`;
  mark_img.onload = function (e) {
    ctx.drawImage(mark_img, 1027 - mark_img.width, 660 - mark_img.height);
  };
}

// 绘制印章
function drawStamp(ctx, stamp_type) {
  if (stamp_type === "无") {
    console.log("无需绘制印章");
    return;
  }
  stamp_img = new Image();
  stamp_img.src = `images/印章/${stamp_type}.png`;
  stamp_img.onload = function (e) {
    ctx.drawImage(stamp_img, 1027 - stamp_img.width - 80, 660 - stamp_img.height - 80);
  };
}

// 绘制数字
function drawNumber(ctx, num, suit) {
  if (!num) {
    console.log("无需绘制数字");
    return;
  }
  const is_red = suit === "HEART" || suit === "DIAMOND";
  if (["10", "小王", "大王"].includes(num)) {
    let filename = num;
    if (num === "10") {
      filename += is_red ? "_red" : "_black";
    }
    number_img = new Image();
    number_img.src = `images/特殊数字/${filename}.png`;
    number_img.onload = function (e) {
      ctx.drawImage(number_img, 0, 0);
    }
  } else {
    ctx.save();
    ctx.fillStyle = is_red ? "#fc0303" : "#000000";
    ctx.translate(1027, 60);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = "left";
    ctx.font = "75px Poker";
    ctx.fillText(num, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = is_red ? "#fc0303" : "#000000";
    ctx.translate(60, 660);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "left";
    ctx.font = "75px Poker";
    ctx.fillText(num, 0, 0);
    ctx.restore();
  }
}

// 设置分辨率
function setDPI(canvas, dpi, width, height) {
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width / 2 + "px";
  canvas.style.height = height / 2 + "px";
  // Resize canvas and scale future draws.
  var scaleFactor = dpi / 72;
  canvas.width = Math.ceil(canvas.width * scaleFactor);
  canvas.height = Math.ceil(canvas.height * scaleFactor);
  var ctx = canvas.getContext("2d");
  ctx.scale(scaleFactor, scaleFactor);
}

// 如果阵名里包含场景，自动设定场景
function handleName() {
  const name = document.getElementById("name").value;
  const scenes = Object.fromEntries([...document.querySelectorAll("#scene option")].map(o => [o.value, o.text]));
  scenes["D6E"] = "PE";
  scenes["N6E"] = "FE";
  for (const [sceneInName, sceneOption] of Object.entries(scenes)) {
    if (name.toUpperCase().includes(sceneInName)) {
      document.getElementById("scene").value = sceneOption;
      return;
    }
  }
}

// 如果点数为大/小王，禁用花色
function handleNum() {
  let e = document.getElementById("poker_suit");
  e.disabled = getPokerNum() === "小王" || getPokerNum() === "大王";
}

// 增加一个作者/年份
function add_one() {
  let size = document.getElementsByName("author").length;
  if (size >= 5) {
    return;
  }
  var new_item = document.createElement("li");
  new_item.setAttribute("id", "author_item_" + String(size + 1));
  var author = document.createElement("input");
  author.setAttribute("type", "text");
  author.setAttribute("name", "author");
  new_item.appendChild(author);
  var year = document.createElement("input");
  year.setAttribute("type", "number");
  year.setAttribute("name", "year");
  new_item.appendChild(year);
  var authors = document.getElementById("authors");
  authors.insertBefore(new_item, document.getElementById("anchor"));
}

// 减少一个作者/年份
function delete_one() {
  let size = document.getElementsByName("author").length;
  if (size === 1) {
    return;
  }
  document.getElementById("author_item_" + size).remove();
}

// 清空作者输入栏与阵型名
function delete_until_one() {
  let size = document.getElementsByName("author").length;
  for (let i = 2; i <= size; i++) {
    document.getElementById("author_item_" + i).remove();
  }
  document.getElementsByName("author")[0].value = "";
  document.getElementsByName("year")[0].value = "";
  document.getElementById("name").value = "";
}
