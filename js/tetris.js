//Dom
const playground = document.querySelector(".playground >ul");
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
// 블럭의 타입과 정보 변수

const Blocks = {
  tree: [
      [[2, 1], [0, 1],[1, 1],[1, 0]],
    [],
    [],
    [],
  ],
};
// javascript object
const movingItem = {
  type: "tree",
  direction: 0,
  top: 0,
  left: 3,
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
  renderBlocks();
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

function renderBlocks() {
  /* 
    tempMovingItem.type;
    tempMovingItem.direction;
    console.log( tempMovingItem.type ,  tempMovingItem.direction )
   이런식으로 할수 있으나 코드가 복잡해지기 때문에 destructuring 을 이용 한다 */
  //destructuring
  const { type, direction, top, left } = tempMovingItem;
 // console.log(type, direction, top, left);
  Blocks[type][direction].forEach(block => {
      const x=block[0] +left;
      const y =block[1] +top;
   

      const target = playground.childNodes[y].childNodes[0].childNodes[x];
      //console.log(target); 
      target.classList.add(type)
  });
 
}
// make move block
function moveBlock(moveType , amount){
  tempMovingItem[moveType] += amount;
  renderBlocks()


}
//event handling
document.addEventListener("keydown", e =>{

  switch(e.keyCode){
    case 39:
      moveBlock("left",1);
      break;
      case 37:
        moveBlock("left",-1); 
break;

  }


})