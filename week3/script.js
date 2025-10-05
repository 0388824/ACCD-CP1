document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const resultEl  = document.getElementById("result"); 


  const START_PUZZLE = [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],

    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],

    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9]
  ];

  let puzzle = deepCopy(START_PUZZLE);
  let inputs = []; 

  function deepCopy(b){ return JSON.parse(JSON.stringify(b)); }

  
  function createSudokuGrid(board) {
    container.innerHTML = "";
    inputs = [];

    for (let r=0; r<9; r++) {
      const rowEl = document.createElement("div");
      rowEl.className = "row";
      const rowInputs = [];

      for (let c=0; c<9; c++) {
        const inp = document.createElement("input");
        inp.type = "text";
        inp.maxLength = 1;
        inp.className = `cell ${(r+c)%2===0 ? "lightBackground":"darkBackground"}`;

        if (START_PUZZLE[r][c] !== 0) {
          inp.value = START_PUZZLE[r][c];
          inp.disabled = true;       
          inp.classList.add("fixed");
        }

       
        inp.addEventListener("input", () => {
          let v = inp.value.replace(/[^1-9]/g, "");
          if (v.length > 1) v = v[0];
          inp.value = v;
          puzzle[r][c] = v ? Number(v) : 0;
          clearResult();
        });

        rowEl.appendChild(inp);
        rowInputs.push(inp);
      }

      container.appendChild(rowEl);
      inputs.push(rowInputs);
    }
  }


  function solveSudoku(board) {
    const b = deepCopy(board);

    function findEmpty(b){
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (b[r][c]===0) return [r,c];
      return null;
    }
    function valid(b,r,c,n){
      for (let i=0;i<9;i++) if (b[r][i]===n || b[i][c]===n) return false;
      const rs = Math.floor(r/3)*3, cs = Math.floor(c/3)*3;
      for (let i=rs;i<rs+3;i++) for (let j=cs;j<cs+3;j++) if (b[i][j]===n) return false;
      return true;
    }
    function helper(b){
      const spot = findEmpty(b);
      if (!spot) return true;
      const [r,c] = spot;
      for (let n=1;n<=9;n++){
        if (valid(b,r,c,n)){
          b[r][c]=n;
          if (helper(b)) return true;
          b[r][c]=0;
        }
      }
      return false;
    }

    return helper(b) ? b : null;
  }


  document.getElementById("solveButton").addEventListener("click", () => {
    const solved = solveSudoku(START_PUZZLE);
    if (!solved) { setResult("No solution.", true); return; }
    puzzle = solved;

    for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
      const inp = inputs[r][c];
      inp.value = solved[r][c];
      inp.disabled = true;
      inp.classList.add("fixed");
    }
    setResult("Solved!", false);
  });

  document.getElementById("resetButton").addEventListener("click", () => {
    puzzle = deepCopy(START_PUZZLE); 
    createSudokuGrid(puzzle);
    clearResult();
  });

  function setResult(text, error){
    resultEl.textContent = text;
    resultEl.className = "result " + (error ? "incorrect" : "correct");
  }
  function clearResult(){
    resultEl.textContent = "";
    resultEl.className = "result";
  }

  
  createSudokuGrid(puzzle);
});
