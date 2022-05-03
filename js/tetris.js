//Dom
const playground = document.querySelector(".playground >ul");
const gameText= document.querySelector(".game-text");
const scoreDisplay =document.querySelector(".score");
const restartButton= document.querySelector(".game-text > button");
//Setting   상수
const Game_Rows = 20;
const Game_Cols = 10;

//variable 변수
let score = 0;
//drop speed
let duration = 500;
let downInterval;
//무빙아이템 실행전 잠시  담아 둠
let tempMovingItem;

// javascript object
const movingItem = {
  type: "",
  direction: 3,
  top: 0,
  left: 0,
};
const Blocks = {
  tree: [
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 1],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 1],
      [1, 2],
      [1, 1],
      [1, 0],
    ],
  ],
  square: [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ],
  bar: [
    [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    [
      [2, -1],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    [
      [2, -1],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  ],
  zee: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [0, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  elLeft: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ],
  ],
  elRight: [
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
  ],
};
init();

function init() {
  /*     spread operator
    만약 
    tempMovingItem =movingItem;
    이런식으로 하면 temp 에 moving 의 값이 전부 들어온다.
    moving 이 변경되면 temp 또한 변경된다
    하지만  spread operator 를 하면  moving 값이 변경되어도 temp값은 변경이 안된다 
    ex) 
    tempMovingItem = movingItem;
    movingItem.left=3          :탬프아이템도 변경
    
    tempMovingItem ={...movingItem};
    movingItem.left=3       : movingItem 은 변경 tempMovingItem 은  변경되지 않는다 
     tempMovingItem 이 펑션에 들어가서 안맞으면 다시 movingItem 으로 복구 가능  */

  tempMovingItem = { ...movingItem };
  for (let i = 0; i < Game_Rows; i++) {
    prependNewLine();
  }
  generateNewBlock();
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < Game_Cols; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }

  li.prepend(ul);
  playground.prepend(li);
}

function renderBlocks(moveType = "") {
  /* 
    tempMovingItem.type;
    tempMovingItem.direction;
    console.log( tempMovingItem.type ,  tempMovingItem.direction )
   이런식으로 할수 있으나 코드가 복잡해지기 때문에 destructuring 을 이용 한다 */
  //destructuring
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });

  // console.log(type, direction, top, left);
  Blocks[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;
    // console.log(playground.childNodes[y])
    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);
    if (isAvailable) {
 
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem };
      // if no more room for empty line(?) 끝 줄에 다다랐을때 
      if(moveType === 'retry'){
        clearInterval(downInterval)
        showGameOverText()
      }
      setTimeout(() => {
        renderBlocks('retry');
        if (moveType === "top") {
          seizeBlock();
        }
      }, 0);
      return true;
    }
  });
  movingItem.direction = direction;
  movingItem.left = left;
  movingItem.top = top;
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkMatch();
}
// if full one line remove
function checkMatch() {
  const childNodes = playground.childNodes;
  childNodes.forEach((child) => {
    let matched = true;
    child.childNodes[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });
    if(matched){
      child.remove();
      prependNewLine()
      score ++;
      scoreDisplay.innerText =score;
    }
  });

  generateNewBlock();
}
// make new block
function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(
    () => {
      moveBlock("top", 1);
    },

    duration
  );
  const blockArray = Object.entries(Blocks);
  const randomIndex = Math.floor(Math.random() * blockArray.length);

  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}

// make move block
function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}
function changeDirection() {
  const direction = tempMovingItem.direction;
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);
  renderBlocks();
}
// space bar drop function
function dorpBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

function showGameOverText(){
 gameText.style.display ="flex";
}


//event handling
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dorpBlock();
      break;
    default:
      break;
  }
});
restartButton.addEventListener("click",() =>{
playground.innerHTML ="";
gameText.style.display="none";
init();

})