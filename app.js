document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  const doodler = document.createElement('div')
  const startBtn = document.querySelector('.start')
  let doodlerLeftSpace = 50
  let startPoint = 150
  let doodlerBottomSpace = startPoint
  let isGameOver = false
  let platformCount = 4
  let platforms = []
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId
  let score = 0
 

  function createDoodler() {
    grid.appendChild(doodler)
    doodler.classList.add('doodler')
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px'
    doodler.style.bottom = doodlerBottomSpace + 'px'

  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom
      this.left = Math.random() * 315
      this.visual = document.createElement('div')

      const visual = this.visual
      visual.classList.add('platform')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'
      grid.appendChild(visual)
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount
      let newPlatformBottom = 100 + i * platformGap
      let newPlatform = new Platform(newPlatformBottom)
      platforms.push(newPlatform)
      
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach(platform => {
        platform.bottom -= 3
        let visual = platform.visual
        visual.style.bottom = platform.bottom + 'px'

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual
          firstPlatform.classList.remove('platform')
          platforms.shift()
          score++
          let newPlatform = new Platform(600)
          platforms.push(newPlatform)
        }

      })
    }
  }

  function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 20
      doodler.style.bottom = doodlerBottomSpace + 'px'
      if (doodlerBottomSpace > startPoint + 200) {
        fall()
      }
    }, 30)
  }

  function fall() {
    clearInterval(upTimerId)
    isJumping = false
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 5
      doodler.style.bottom = doodlerBottomSpace + 'px'
      if (doodlerBottomSpace <= 0) {
        gameOver()
      }
      platforms.forEach(platform => {
        if (
          (doodlerBottomSpace >= platform.bottom) &&
          (doodlerBottomSpace <= platform.bottom + 15) &&
          ((doodlerLeftSpace + 60) >= platform.left) &&
          (doodlerLeftSpace <= (platform.left + 85)) &&
          !isJumping
        ) {
          startPoint = doodlerBottomSpace
          jump()
        }
      })
    }, 30)
  };

  function gameOver() {
    isGameOver = true
    document.querySelector('.score').innerHTML = score

    grid.removeChild(doodler)
    const deadPlatforms = document.getElementsByClassName('platform')
    while (deadPlatforms.length > 0) {
      deadPlatforms[0].remove();
    }

    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    platforms = []

    //const replay = document.createElement('div')
    //replay.classList.add('start')
    //replay.innerHTML = "replay";
    //grid.appendChild(replay)
    startBtn.style.display = "block";
  };

  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft()
    } else if (e.key === "ArrowRight") {
      moveRight()
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId)
      isGoingRight = false
    }
    isGoingLeft = true
    clearInterval(leftTimerId)
    leftTimerId = setInterval(function() {
      if (doodlerLeftSpace >= 0) {
      doodlerLeftSpace -= 5
      doodler.style.left = doodlerLeftSpace + 'px'
      } else {
        moveRight()
      }
    },30)
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId)
      isGoingLeft = false
    }
    isGoingRight = true
    clearInterval(rightTimerId)
    rightTimerId = setInterval(function() {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5
        doodler.style.left = doodlerLeftSpace + 'px'
      } else {
        moveLeft()
      }
    },30)
  }

  function start() {
    isGameOver = false
    if (!isGameOver) {
      createPlatforms()
      createDoodler()
      setInterval(movePlatforms, 30)
      jump()
      document.addEventListener('keydown', control)
    }
  }

  (startBtn).addEventListener("click", function() {
    this.style.display = "none";
    start()
  })

})