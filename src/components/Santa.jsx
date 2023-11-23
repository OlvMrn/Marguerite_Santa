import React, { useEffect, useRef, useState } from "react";
import "./santa.css";

function Santa() {
  const santaRef = useRef();
  const [cacti, setCacti] = useState([]);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const jump = () => {
    if (!!santaRef.current && !santaRef.current.classList.contains("jump")) {
      santaRef.current.classList.add("jump");
      setIsJumping(true);
    }
  };

  const endJump = () => {
    setIsJumping(false);
  };

  const addObstacle = () => {
    const isCactus = Math.random() < 0.5;
    const left = window.innerWidth;

    const newObstacle = {
      id: new Date().getTime(),
      type: isCactus ? "cactus" : "gift",
      animationDuration: Math.random() * 2 + 2,
      left: left,
    };

    setCacti((prevObstacles) => [...prevObstacles, newObstacle]);
  };

  const startGame = () => {
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setCacti([]); // Réinitialiser la liste des obstacles
    setScore(0); // Réinitialiser le score
  };

  useEffect(() => {
    let isAlive;

    if (isPlaying) {
      isAlive = setInterval(() => {
        const santaRect = santaRef.current.getBoundingClientRect();

        setCacti((prevObstacles) => {
          if (!isPlaying) return prevObstacles;

          const newObstacles = [...prevObstacles];

          for (let i = 0; i < newObstacles.length; i++) {
            const obstacle = newObstacles[i];
            const obstacleRect = obstacle.ref.getBoundingClientRect();

            if (
              santaRect.left + 10 < obstacleRect.right &&
              santaRect.right - 10 > obstacleRect.left &&
              santaRect.top + 10 < obstacleRect.bottom &&
              santaRect.bottom - 10 > obstacleRect.top
            ) {
              if (obstacle.type === "cactus") {
                alert("Game Over! Your Score : " + score);
                setScore(0);
                setIsPlaying(false);
                return [];
              } else if (obstacle.type === "gift") {
                setScore((prevScore) => prevScore + 1);
                newObstacles.splice(i, 1);
              }
            }
          }

          if (Math.random() < 0.005) {
            addObstacle();
          }

          return newObstacles;
        });
      }, 10);
    }

    return () => clearInterval(isAlive);
  }, [isJumping, isPlaying, score]);

  useEffect(() => {
    document.addEventListener("keydown", jump);
    document.addEventListener("keyup", endJump);
    return () => {
      document.removeEventListener("keydown", jump);
      document.removeEventListener("keyup", endJump);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      addObstacle();
    }
  }, [isPlaying]);

  return (
    <div className="game">
      Score : {score}
      <div id="santa" ref={santaRef} className={isJumping ? "jump" : ""}></div>
      {cacti.map((obstacle) => (
        <div
          key={obstacle.id}
          className={obstacle.type}
          ref={(ref) => (obstacle.ref = ref)}
          style={{
            left: obstacle.left || 0,
            animation: `move ${obstacle.animationDuration}s infinite linear`,
          }}
        ></div>
      ))}
      <div className="buttonsCtn">
        <button className="buttons" onClick={startGame}>
          Start Game
        </button>
        <button className="buttons" onClick={stopGame}>
          Stop Game
        </button>
      </div>
    </div>
  );
}

export default Santa;
