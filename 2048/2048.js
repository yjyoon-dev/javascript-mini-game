var board = Array(Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0));
var tableID = Array(Array("00","01","02","03"),Array("10","11","12","13"),Array("20","21","22","23"),Array("30","31","32","33"));
var score;

// 키보드 입력 처리
document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e){
    switch(e.keyCode){
        case 38: moveDir(0); break; //up
        case 40: moveDir(1); break; //down
        case 37: moveDir(2); break; //left
        case 39: moveDir(3); break; //right
    }
}

// 초기 설정
init();
function init(){
    score=0;
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            board[i][j]=0;
    for(var i=0;i<2;i++){
        var rand = parseInt(Math.random()*16);
        var y = parseInt(rand / 4);
        var x = rand % 4;
        if(board[y][x]==0) board[y][x]=getNewNum();
        else i--;
    }
    update();
}

// 게임 화면 업데이트
function update(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var cell = document.getElementById(tableID[i][j]);
            cell.innerHTML = board[i][j]==0?"":board[i][j];
            coloring(cell);
        }
    }
    document.getElementById("score").innerHTML=score;
}

// 칸 색칠
function coloring(cell){
    var cellNum = parseInt(cell.innerHTML);
    switch(cellNum){
        case 0:
        case 2:
            cell.style.color="#684A23";
            cell.style.background="#FBEDDC";
            break;
        case 4:
            cell.style.color="#684A23";
            cell.style.background="#F9E2C7";
            break;
        case 8:
            cell.style.color="#684A23";
            cell.style.background="#F6D5AB";
            break;
        case 16:
            cell.style.color="#684A23";
            cell.style.background="#F2C185";
            break;
        case 32:
            cell.style.color="#684A23";
            cell.style.background="#EFB46D";
            break;
        case 64:
            cell.style.color="#FFFFFF";
            cell.style.background="#EBA24A";
            break;
        case 128:
            cell.style.color="#FFFFFF";
            cell.style.background="#E78F24";
            break;
        case 256:
            cell.style.color="#FFFFFF";
            cell.style.background="#E87032";
            break;
        case 512:
            cell.style.color="#FFFFFF";
            cell.style.background="#E85532";
            break;
        case 1024:
            cell.style.color="#FFFFFF";
            cell.style.background="#E84532";
            break;
        case 2048:
            cell.style.color="#FFFFFF";
            cell.style.background="#E83232";
            break;
        default:
            if(cellNum>2048){
                cell.style.color="#FFFFFF";
                cell.style.background="#E51A1A";
            }
            else{
                cell.style.color="#684A23";
                cell.style.background="#FBEDDC";
            }
            break;
    }
}

// 보드판 이동 방향에 따른 회전 컨트롤
function moveDir(opt){
    switch(opt){
        case 0: move(); break; //up
        case 1: rotate(2); move(); rotate(2); break; //down
        case 2: rotate(1); move(); rotate(3); break; //left
        case 3: rotate(3); move(); rotate(1); break; //right
    }
    update();
}

// 보드판 회전
function rotate(n){
    while(n--){
        var tempBoard = Array(Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0));
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                tempBoard[i][j]=board[i][j];
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                board[j][3-i]=tempBoard[i][j];

    }
}

// 보드판 이동
function move(){
    var isMoved=false;
    var isPlused = Array(Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0));
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0) continue;
            var tempY = i-1;
            while(tempY>0 && board[tempY][j]==0) tempY--;
            if(board[tempY][j]==0){
                board[tempY][j]=board[i][j];
                board[i][j]=0;
                isMoved=true;
            }
            else if(board[tempY][j]!=board[i][j]){
                if(tempY+1==i) continue;
                board[tempY+1][j]=board[i][j];
                board[i][j]=0;
                isMoved=true;
            }
            else{
                if(isPlused[tempY][j]==0){
                    board[tempY][j]*=2;
                    score+=board[tempY][j];
                    board[i][j]=0;
                    isPlused[tempY][j]=1;
                    isMoved=true;
                }
                else{
                    board[tempY+1][j]=board[i][j];
                    board[i][j]=0;
                    isMoved=true;
                }
            }
        }
    }
    if(isMoved) generate();
    else checkGameOver();
}

// 신규 숫자 생성
function generate(){
    var zeroNum=0;
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            if(board[i][j]==0)
                zeroNum++;
    while(true){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    var rand = parseInt(Math.random()*zeroNum);
                    if(rand==0){
                        board[i][j]=getNewNum();
                        return;
                    }
                }
            }
        }
    }
}

// 숫자 생성 확률
function getNewNum(){
    var rand = parseInt(Math.random()*10);
    if(rand==0) return 4;
    return 2;
}

// 최대 점수 반환
function getMaxNum(){
    var ret=0;
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            if(board[i][j]>ret)
                ret=board[i][j];
    return ret;
}

// 게임오버 체크
function checkGameOver(){
    for(var i=0;i<4;i++){
        var colCheck = board[i][0];
        if(colCheck==0) return;
        for(var j=1;j<4;j++){
            if(board[i][j]==colCheck || board[i][j]==0) return;
            else colCheck = board[i][j];
        }
    }
    for(var i=0;i<4;i++){
        var rowCheck = board[0][i];
        if(rowCheck==0) return;
        for(var j=1;j<4;j++){
            if(board[j][i]==rowCheck || board[j][i]==0) return;
            else rowCheck = board[j][i];
        }
    }
    gameover();
}

// 게임오버 처리
function gameover(){
    alert("[Game Over]\nMax: "+getMaxNum()+"\nScore"+score);
    init();
}