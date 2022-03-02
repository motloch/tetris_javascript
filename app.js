document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const restartBtn = document.querySelector('#restart-button')

  const width = 10
  const initialSpeed = 500
  const speedChangeScore = 100
  const colors = ['orange', 'red', 'purple', 'green', 'blue']

  //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  //show up-next tetromino in mini-grid display
  const displaySquares = Array.from(document.querySelectorAll('.mini-grid div'))
  const displayWidth = 4
  const displayIndex = 0

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  let timerId
  let score = 0
  let speed = initialSpeed
  let currentPosition = 4
  let currentRotation = 0
  let gameState = 'over'

  //randomly select a tetromino and its first rotation
  let nextRandom = Math.floor(Math.random()*theTetrominoes.length)
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  //draw the Tetronomino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the Tetronomino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  //assign functions to KeyCodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if(e.keyCode == 38) {
      rotate()
    } else if(e.keyCode == 39) {
      moveRight()
    } else if(e.keyCode == 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  function moveDown() {
	if(gameState === 'running'){
		undraw()
		currentPosition += width
		draw()
		freeze()
	}
  }

  //freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino
      random = nextRandom
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      addScore()
      draw()
      displayShape()
      gameOver()
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
	if(gameState === 'running'){
		undraw()
		const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
		if(!isAtLeftEdge) currentPosition -= 1
		if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
		  currentPosition += 1
		draw()
	}
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
	if(gameState === 'running') {
		undraw()
		const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
		if(!isAtRightEdge) currentPosition += 1
		if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
		  currentPosition -= 1
		draw()
	}
  }

  //rotate the tetromino
  function rotate() {
	if(gameState === 'running'){
		undraw()
		currentRotation++
		if(currentRotation === current.length) { //if the currentRotation goes to 4, make it got back to 0
		  currentRotation = 0
		}
		current = theTetrominoes[random][currentRotation]
		draw()
	}
  }

  //display the next shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })

    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if(timerId) {
      clearInterval(timerId)
      timerId = null
	  gameState = 'stopped'
    } else {
      draw()
      timerId = setInterval(moveDown, speed)
	  if(gameState === 'over') {
		  nextRandom = Math.floor(Math.random()*theTetrominoes.length)
		  displayShape()
	  }
	  gameState = 'running'
    }

  })

  //add functionality to the restart button
  restartBtn.addEventListener('click', () => {
      //clear everything except the ground floor divs
      squares.forEach(square => {
		if(!square.classList.contains('ground')){
			square.classList.remove('taken')
			square.classList.remove('tetromino')
			square.style.backgroundColor = ''
		}
      })
      displaySquares.forEach(square => {
		square.classList.remove('taken')
		square.classList.remove('tetromino')
		square.style.backgroundColor = ''
      })

      //clear the score
      score = 0
      scoreDisplay.innerHTML = score
	  //set initial speed, stop the game
      speed = initialSpeed
      clearInterval(timerId)
      timerId = null

      currentPosition = 4
      currentRotation = 0
	  //randomly select a tetromino and its first rotation
	  nextRandom = Math.floor(Math.random()*theTetrominoes.length)
	  random = Math.floor(Math.random()*theTetrominoes.length)
	  current = theTetrominoes[random][currentRotation]

	  gameState = 'over'
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i+=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
		//increase difficulty
		if(score % speedChangeScore === 0) {
			speed = Math.floor(initialSpeed*speedChangeScore/score)
			clearInterval(timerId)
			timerId = setInterval(moveDown, speed)
		}

		//make sure you remove the current piece before shifting things around
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
	  gameState = 'over'
      scoreDisplay.innerHTML = score + ' (end)'
      clearInterval(timerId)
    }
  }

})
