import React, { useEffect, useRef, useState } from "react";
import "./santa.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundMusic from "../assets/All.mp3"; // Assurez-vous d'importer votre fichier audio correctement

function Santa() {
  const santaRef = useRef();
  const [chim, setChim] = useState([]);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("santa");
  const audioRef = useRef(new Audio(backgroundMusic));

  const showToastMessage = () => {
    toast.error(
      <div className="gameOverContainer">
        <div className="gameOverContainer-title">GAME OVER !</div>
        <div className="gameOverContainer-detail">Votre score: {score}</div>
      </div>,
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        limit: 1,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: false,
        draggable: false,
        pauseOnHover: true,
        theme: "colored",
      }
    );
  };

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
    const isChimney = Math.random() < 0.4;
    const left = window.innerWidth;

    const newObstacle = {
      id: new Date().getTime(),
      type: isChimney ? "chimney" : "gift",
      animationDuration: Math.random() * 2 + 2,
      left: left,
    };

    setChim((prevObstacles) => [...prevObstacles, newObstacle]);
  };

  const startGame = () => {
    setIsPlaying(true);
    audioRef.current.play(); // Démarrer la musique
  };

  const stopGame = () => {
    setIsPlaying(false);
    audioRef.current.pause(); // Arrêter la musique
    audioRef.current.currentTime = 0; // Remettre la musique au début
    setChim([]); // Réinitialiser la liste des obstacles
    setScore(0); // Réinitialiser le score
  };
  const [gameOver, setGameOver] = useState(false);
  useEffect(() => {
    let isAlive;

    if (isPlaying) {
      isAlive = setInterval(() => {
        const santaRect = santaRef.current.getBoundingClientRect();

        setChim((prevObstacles) => {
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
              if (obstacle.type === "chimney") {
                setIsPlaying(false);
                setGameOver(true);
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

    if (gameOver === true) {
      /* alert("Game Over! Your Score : " + score); */
      showToastMessage();
      setGameOver(false);
      setScore(0);
    }

    return () => clearInterval(isAlive);
  }, [isJumping, isPlaying, score, gameOver]);

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
    <div>
      <ToastContainer />
      <div className="game">
        Score : {score}
        <div
          id={selectedPlayer}
          ref={santaRef}
          className={isJumping ? "jump" : ""}
        ></div>
        {chim.map((obstacle) => (
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
          <div className="player-selection">
            <div className="choice">Choose your player:</div>
            <div className="player-options">
              <button
                onClick={() => setSelectedPlayer("santa")}
                className={selectedPlayer === "santa" ? "selected" : ""}
              >
                Santa
              </button>
              <button
                onClick={() => setSelectedPlayer("elf")}
                className={selectedPlayer === "elf" ? "selected" : ""}
              >
                Elf
              </button>
              <button
                onClick={() => setSelectedPlayer("marguerite")}
                className={selectedPlayer === "marguerite" ? "selected" : ""}
              >
                Marguerite
              </button>
            </div>
          </div>
          <div>
            <button className="buttons" onClick={startGame}>
              Start Game
            </button>
            <button className="buttons" onClick={stopGame}>
              Stop Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Santa;
