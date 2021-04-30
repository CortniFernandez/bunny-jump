document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  const bunny = document.createElement('div')
  const startBtn = document.querySelector('.start')
  let bunnyLeftSpace = 50
  let startPoint = 115
  let bunnyBottomSpace = startPoint
  let isGameOver = false
  let cloudCount = 4
  let clouds = []
  let upTimerId
  let downTimerId
  let isJumping = false
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId
  let score = 0
 

  function createBunny() {
    grid.appendChild(bunny)
    bunny.classList.add('bunny')
    bunnyLeftSpace = clouds[0].left
    bunny.style.left = bunnyLeftSpace + 'px'
    let startPoint = 115
    bunnyBottomSpace = startPoint
    bunny.style.bottom = bunnyBottomSpace + 'px'

  }

  class Cloud {
    constructor(newCloudBottom) {
      this.bottom = newCloudBottom
      this.left = Math.random() * 315
      this.visual = document.createElement('div')

      const visual = this.visual
      visual.classList.add('cloud')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'
      grid.appendChild(visual)
    }
  }

  function createClouds() {
    for (let i = 0; i < cloudCount; i++) {
      let cloudGap = 600 / cloudCount
      let newCloudBottom = 100 + i * cloudGap
      let newCloud = new Cloud(newCloudBottom)
      clouds.push(newCloud)
      
    }
  }

  function moveClouds() {         
    if (bunnyBottomSpace > 200) {
      clouds.forEach(cloud => {
        cloud.bottom -= 3
        let visual = cloud.visual
        visual.style.bottom = cloud.bottom + 'px'

        if (cloud.bottom < 10) {
          let firstCloud = clouds[0].visual
          firstCloud.classList.remove('cloud')
          clouds.shift()
          score++
          let newCloud = new Cloud(600)
          clouds.push(newCloud)
        }

      })
    }
  }

  function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      bunnyBottomSpace += 20
      bunny.style.bottom = bunnyBottomSpace + 'px'
      if (bunnyBottomSpace > startPoint + 200) {
        fall()
      }
    }, 30)
  }

  function fall() {
    clearInterval(upTimerId)
    isJumping = false
    downTimerId = setInterval(function () {
      bunnyBottomSpace -= 5
      bunny.style.bottom = bunnyBottomSpace + 'px'
      if (bunnyBottomSpace <= 0) {
        gameOver()
      }
      clouds.forEach(cloud => {
        if (
          (bunnyBottomSpace >= cloud.bottom) &&
          (bunnyBottomSpace <= cloud.bottom + 25) &&
          ((bunnyLeftSpace + 60) >= cloud.left) &&
          (bunnyLeftSpace <= (cloud.left + 60)) &&
          !isJumping
        ) {
          startPoint = bunnyBottomSpace
          jump()
        }
      })
    }, 20)
  };

  function gameOver() {
    isGameOver = true
    isJumping = false
    document.querySelector('.score').innerHTML = score
    document.querySelector('.score').style.display = "block"
    startBtn.style.display = "block"

    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    while (clouds[0]) {
      clouds.shift()
    }

    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    clearInterval(cloudTimerId)

    startPoint = 115
    bunnyBottomSpace = startPoint
  };

  function control(e) {
    if (e.key === "ArrowLeft") {
      flipBunnyLeft()
      moveLeft()
    } else if (e.key === "ArrowRight") {
      flipBunnyRight()
      moveRight()
    }
  }

  function flipBunnyRight() {
    bunny.style.transform = "rotateY(180deg)";
  }

  function flipBunnyLeft() {
    bunny.style.transform = "rotateY(360deg)";
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId)
      isGoingRight = false
    }
    isGoingLeft = true
    clearInterval(leftTimerId)
    leftTimerId = setInterval(function() {
      if (bunnyLeftSpace >= 0) {
      bunnyLeftSpace -= 5
      bunny.style.left = bunnyLeftSpace + 'px'
      } else {
        moveRight()
      }
    },30)
    //setTimeout(function(){
    //  clearInterval(leftTimerId)
    //  isGoingLeft = false
    //},600)
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId)
      isGoingLeft = false
    }
    isGoingRight = true
    clearInterval(rightTimerId)
    rightTimerId = setInterval(function() {
      if (bunnyLeftSpace <= 340) {
        bunnyLeftSpace += 5
        bunny.style.left = bunnyLeftSpace + 'px'
      } else {
        moveLeft()
      }
    },30)
    //setTimeout(function(){
    //  clearInterval(rightTimerId)
    //  isGoingRight = false
    //},600)
  }

  function start() {
    isGameOver = false
    if (!isGameOver) {
      score = 0
      createClouds()
      createBunny()
      cloudTimerId = setInterval(moveClouds, 30)
      jump()
      document.addEventListener('keydown', control)
    }
  }

  (startBtn).addEventListener("click", function() {
    this.style.display = "none";
    document.querySelector('.score').style.display = "none";
    start()
  })

})