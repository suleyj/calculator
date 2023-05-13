class multiply{
  constructor(){
    this.precedence = 1;
    this.numOfArg = 2;
  }
  
  perform(args){
    return args[1] * args[0];
  }

}

class subtract{
  constructor(){
    this.precedence = 0;
    this.numOfArg = 2;
  }
  
  perform(args){
    return args[1] - args[0];
  }
}

class divide{
  constructor(){
    this.precedence = 1;
    this.numOfArg = 2;
  }
  
  perform(args){
    if(args[0] === 0){
      return false;
    }
    return args[1] / args[0];
  }
}

class add{
  constructor(){
    this.precedence = 0;
    this.numOfArg = 2;
  }
  
  perform(args){
    return args[1] + args[0];
  }
}


function outputToScreen(e){
  const screen = document.querySelector('#display p');
  if(screen.innerText === "Error Clear Screen")
  {
    return;
  }
  const regex = /(\d+\.\d+|\d+\.|\d+|-|\+|x|÷)/g;
  let str = screen.innerText;
  let found = str.match(regex);
  if(e.target.value === '.' && (str === '' || str.charAt(str.length -1) == '\u00A0')){
    return;
  }
  if(e.target.value === "." && str!='' && found[found.length-1].includes('.')){
    return;
  } 
  if(e.target.value === "+" || e.target.value === "-" || e.target.value === "x" || e.target.value === "÷"){
    if(str == ''){
      return;
    }
    if(found[found.length -1] === "+" || found[found.length -1] === "-" || found[found.length -1] === "÷" || found[found.length -1] === "x"){
      return;
    }
    
  }
  if(e.target.value === "+" || e.target.value === "-" || e.target.value === "x" || e.target.value === "÷"){
    screen.innerText += '\u00A0';
    screen.innerText += e.target.value;
    screen.innerText += '\u00A0';
  }
  else{
    screen.innerText += e.target.value;
  }
}

function clear(){
  const screen = document.querySelector('#display p');
  screen.innerText = '';
}

function deleteLast(){
  
  const screen = document.querySelector('#display p');
  if(screen.innerText === "Error Clear Screen")
  {
    return;
  }
  const str = screen.innerText;
  screen.innerText = str.substring(0,str.length -1);
}

function operator(str){
  if(str === '+')
    return new add();
  else if(str === '-')
    return new subtract();
  else if(str === '÷')
    return new divide();
  else if(str === 'x')
    return new multiply();
}

function lexer(str){
  const regex = /(\d+\.\d+|\d+|-\d|-|\+|x|÷)/g;
  let found = str.match(regex);
  for (let i = 0; i < found.length; i++) {
    if(isNaN(+found[i])){
      found[i] = operator(found[i])
    }
    else{
      found[i] = +found[i];
    }
  }
  return found;
}

function parser(){
  const screen = document.querySelector('#display p');
  let str = screen.innerText;
  let tokenArr = lexer(str);
  let queue = [];
  let stack = [];
  for (let i = 0; i < tokenArr.length; i++) {
    if(!isNaN(tokenArr[i])){
      queue.push(tokenArr[i]);
    }
    else {
      const op = tokenArr[i];
      while(stack.length != 0 && stack[stack.length-1].precedence >= op.precedence ){
        queue.push(stack.pop());
      }
      stack.push(op);
    }
  }
  while(stack.length != 0){
    queue.push(stack.pop());
  }
  return queue;
}

function evaluate(){

  const screen = document.querySelector('#display p');
  if(screen.innerText === "Error Clear Screen")
  {
    return;
  }
  let str = screen.innerText;
  const regex = /(\d+\.\d+|\d+|-|\+|x|÷)/g;
  let found = str.match(regex);
  if(str === ''){
    return;
  }

  if(found.length === 1){
    return;
  }

  if(found[found.length -1] === '+'|| found[found.length -1] === '-'|| found[found.length -1] === '÷'|| found[found.length -1] === 'x'){
    return;
  }
  let queue = parser();
  let stack = [];
  for (let i = 0; i < queue.length; i++) {
    if(!isNaN(queue[i])){
      stack.push(queue[i]);
    }
    else{
      let args = [];
      for (let j = 0; j < queue[i].numOfArg; j++) {
        args.push(stack.pop());
      }
      let result = queue[i].perform(args);
      if(result === false){
        return;
      }
      stack.push(result);
    }
  }
  
  let num = stack[0];
  if(stack[0] % 1 !== 0){
    num = num.toFixed(3);
  }

  let numStr = num.toString();
  const maxLength = 15;
  if(numStr.length > maxLength || numStr.includes("e")){
    screen.innerText = "Error Clear Screen"
  }
  else{
    screen.innerText = numStr;
  }
}

const btns = document.querySelectorAll(".btn");

btns.item(0).addEventListener('click', clear);
btns.item(1).addEventListener('click', deleteLast);
for(let i = 2; i < btns.length - 1; ++i){
  btns.item(i).addEventListener('click', outputToScreen);
}

btns.item(btns.length-1).addEventListener('click', evaluate);


