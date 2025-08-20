// 
import React, { useState, useEffect, useCallback } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Clock, Trophy, RotateCcw, Code2, Database, Wifi, Pause, Play, Square } from 'lucide-react'

const WORDS_DATA = [
  {
    word: "HTML",
    hint: "Markup language used to create web pages",
    revealedPositions: [ 1, 3], 
  },
  
  {
    word: "MALWARE",
    hint: "What is the term for malicious software",
    revealedPositions: [0, 3], 
  },
  {
    word: "MICROSOFT",
    hint: "Which company created Windows OS",
    revealedPositions: [0, 4, 8], 
  },
  {
    word: "BINARY",
    hint: "Computer understands which language",
    revealedPositions: [0,4], 
  },
  {
    word: "VIRUS",
    hint: "Harmful software that can damage your computer",
    revealedPositions: [0, 4], 
  },
  {
    word: "CLOUD",
    hint: "Online storage where you can save files remotely",
    revealedPositions: [0,4], 
  },
  {
    word: "CSS",
    hint: "Language used to style and design web pages",
    revealedPositions: [0], 
  },
  {
    word: "PORTABLE",
    hint: "P in PDF stands for",
    revealedPositions: [0, 4], 
  },
  {
    word: "BACKUP",
    hint: "Copy of important files saved for safety",
    revealedPositions: [2, 5],
  },
  {
    word: "404",
    hint: "Which HTTP status code means Page Not Found",
    revealedPositions: [ ], 
  },
   {
    word: "BARD",
    hint: "What was Google's AI chatbot before Gemini",
    revealedPositions: [0], 
  },
   {
    word: "GITHUB",
    hint: "What app is commonly used to host code collaboratively",
    revealedPositions: [ 2,6], 
  },
   {
    word: "SPAM",
    hint: "What is the term for junk email",
    revealedPositions: [ 3], 
  },
   {
    word: "ENCRYPTION",
    hint: "What is the process of converting data into secret code",
    revealedPositions: [ 0,4,10], 
  },
   {
    word: "HARDWARE",
    hint: "What is the physical part of a computer called",
    revealedPositions: [ 2,5], 
  },
   {
    word: "HOMEPAGE",
    hint: "What is the term for the first page of a website",
    revealedPositions: [ 0,5], 
  },
   {
    word: "ANTIVIRUS",
    hint: "What is the name for a program that detects and removes viruses",
    revealedPositions: [ 2,7], 
  },
   {
    word: "HACKING",
    hint: "What is the act of illegally accessing a computer system",
    revealedPositions: [ 3,6], 
  },
   {
    word: "HYPERLINK",
    hint: "What is the term for text that links to another webpage",
    revealedPositions: [ 0,7], 
  },
    {
    word: "SPEEDTEST",
    hint: "Which device is used to measure internet speed",
    revealedPositions: [ 0,5], 
  },
]

// Shuffle function to randomize questions
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Floating animation component
const FloatingElement = ({ children, delay = 0, duration = 3 }) => (
  <div
    className="absolute animate-bounce opacity-20 text-slate-400"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  >
    {children}
  </div>
)

export default function WordGuessingGame() {
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(18)
  const [userGuess, setUserGuess] = useState("")
  const [gameState, setGameState] = useState("playing")
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [gameWords, setGameWords] = useState([])

  // Initialize game with 5 random questions
  useEffect(() => {
    const randomFive = shuffleArray(WORDS_DATA).slice(0, 5);
    setGameWords(randomFive);
  }, []);

  const currentWord = gameWords[currentRound]

  const createDisplayWord = useCallback(() => {
    if (!currentWord) return ""
    return currentWord.word
      .split("")
      .map((letter, index) => (currentWord.revealedPositions.includes(index) ? letter : "_"))
      .join(" ")
  }, [currentWord])

  const nextRound = useCallback(() => {
    if (currentRound < 4) { // Changed to 4 (0-4 = 5 rounds)
      setCurrentRound((prev) => prev + 1)
      setTimeLeft(18)
      setUserGuess("")
      setGameState("playing")
      setIsTimerActive(true)
      setIsPaused(false)
    } else {
      setGameState("finished")
      setIsTimerActive(false)
      setIsPaused(false)
    }
  }, [currentRound])

  const checkAnswer = useCallback(() => {
    if (!currentWord) return

    const isCorrect = userGuess.toUpperCase() === currentWord.word.toUpperCase()

    if (isCorrect) {
      setScore((prev) => prev + 1)
      setGameState("correct")
    } else {
      setGameState("wrong")
    }

    setIsTimerActive(false)
    setIsPaused(false)

    setTimeout(() => {
      nextRound()
    }, 2000)
  }, [userGuess, currentWord, nextRound])

  // Reset entire game function
  const resetGame = () => {
    const randomFive = shuffleArray(WORDS_DATA).slice(0, 5);
    setGameWords(randomFive);
    setCurrentRound(0)
    setScore(0)
    setTimeLeft(18)
    setUserGuess("")
    setGameState("playing")
    setIsTimerActive(true)
    setIsPaused(false)
  }

  // Pause game function
  const pauseGame = () => {
    if (gameState === "playing") {
      setIsPaused(true)
      setIsTimerActive(false)
    }
  }

  // Resume game function
  const resumeGame = () => {
    if (gameState === "playing" && isPaused) {
      setIsPaused(false)
      setIsTimerActive(true)
    }
  }

  // Timer effect
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0 || isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("wrong")
          setIsTimerActive(false)
          setIsPaused(false)
          setTimeout(() => {
            nextRound()
          }, 2000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isTimerActive, isPaused, nextRound])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userGuess.trim() && gameState === "playing" && !isPaused) {
      checkAnswer()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && userGuess.trim() && gameState === "playing" && !isPaused) {
      checkAnswer()
    }
  }

  if (gameState === "finished") {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-900 via-slate-800 to-purple-900 p-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-gray-700/20 animate-pulse"></div>
          {[...Array(15)].map((_, i) => (
            <FloatingElement key={i} delay={i * 0.5} duration={3 + Math.random() * 2}>
              {i % 3 === 0 ? <Code2 size={24} /> : i % 3 === 1 ? <Database size={20} /> : <Wifi size={22} />}
            </FloatingElement>
          ))}
        </div>

        <Card className="w-full max-w-md text-center relative z-10 backdrop-blur-sm bg-slate-800/90 shadow-2xl border border-slate-600">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Trophy className="h-16 w-16 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 bg-yellow-400 rounded-full blur-xl opacity-20 animate-ping"></div>
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Game Complete!
            </CardTitle>
            <CardDescription className="text-lg text-gray-300">{"Here's how you performed"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="text-5xl font-bold text-green-400 animate-bounce">
                {score}/5
              </div>
              <div className="absolute inset-0 text-5xl font-bold text-green-500 blur-sm animate-pulse">
                {score}/5
              </div>
            </div>
            <p className="text-lg text-gray-300">
              {score === 5
                ? "🎉 Perfect score! You're a tech terminology master!"
                : score >= 4
                  ? "🚀 Great job! You know your tech terms well!"
                  : score >= 3
                    ? "💪 Good effort! Keep learning those tech terms!"
                    : "📚 Keep practicing! You'll get better with time!"}
            </p>
            <Button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 transform hover:scale-105 transition-all duration-200 text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-900 via-slate-800 to-purple-900  p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/10 to-gray-700/10 animate-pulse"></div>

        {[...Array(20)].map((_, i) => (
          <FloatingElement key={i} delay={i * 0.3} duration={4 + Math.random() * 3}>
            {i % 4 === 0 ? (
              <Code2 size={16 + Math.random() * 16} />
            ) : i % 4 === 1 ? (
              <Database size={14 + Math.random() * 14} />
            ) : i % 4 === 2 ? (
              <Wifi size={18 + Math.random() * 12} />
            ) : (
              <div className="w-3 h-3 bg-slate-400 rounded-full animate-ping"></div>
            )}
          </FloatingElement>
        ))}

        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-slate-600/10 rounded-full animate-ping"></div>
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-gray-600/10 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-slate-500/10 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Card className="w-full max-w-lg relative z-10 backdrop-blur-md bg-slate-800/95 shadow-2xl border border-slate-600 transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-700 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">🎯 Tech Word Challenge</CardTitle>
            <Badge variant="secondary" className="bg-slate-600/50 text-white border-slate-500">
              Round {currentRound + 1}/5
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className={`h-5 w-5 ${timeLeft <= 3 && !isPaused ? "animate-bounce" : ""}`} />
              <span
                className={`font-mono text-xl font-bold ${
                  isPaused ? "text-yellow-400" : timeLeft <= 3 ? "text-red-400 animate-pulse" : "text-green-400"
                }`}
              >
                {isPaused ? "⏸️ PAUSED" : `${timeLeft}s`}
              </span>
            </div>
            <div className="text-sm">
              Score:{" "}
              <span className="font-bold">
                {score}/5
              </span>
            </div>
          </div>
          <Progress
            value={(timeLeft / 10) * 100}
            className={`h-3 transition-all duration-1000 ${timeLeft <= 3 && !isPaused ? "animate-pulse" : ""}`}
          />
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Pause Overlay */}
          {isPaused && (
            <div className="text-center p-6 bg-slate-700/80 rounded-lg border-2 border-yellow-500 mb-4">
              <div className="text-3xl font-bold text-yellow-400 mb-2">⏸️ Game Paused</div>
              <p className="text-gray-300">Click "Resume" to continue playing</p>
              <p className="text-sm text-gray-400 mt-2">Time remaining: {timeLeft} seconds</p>
            </div>
          )}

          <div className="text-center">
            <CardDescription className="text-base mb-6 text-gray-300 leading-relaxed">
              💡 {currentWord?.hint}
            </CardDescription>
            <div className="text-4xl font-mono font-bold tracking-wider mb-6 p-6 bg-gradient-to-r from-slate-700 to-gray-700 rounded-xl shadow-inner border-2 border-dashed border-slate-600">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {createDisplayWord()}
              </span>
            </div>
          </div>

          {gameState === "playing" && !isPaused && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your guess..."
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-lg h-12 border-2 border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:border-blue-500 transition-all duration-200"
                autoFocus
              />
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 transform hover:scale-105 transition-all duration-200 text-lg font-semibold text-white"
                disabled={!userGuess.trim()}
              >
                🚀 Submit Guess
              </Button>
            </form>
          )}

          {/* Game Control Buttons - Moved below guessing section */}
          {gameState === "playing" && (
            <div className="flex justify-center space-x-4 mt-4">
              {/* Pause/Resume Button */}
              {!isPaused ? (
                <Button
                  onClick={pauseGame}
                  variant="outline"
                  size="sm"
                  className="bg-yellow-600 border-yellow-500 text-white hover:bg-yellow-500 transition-all duration-200 px-6"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Game
                </Button>
              ) : (
                <Button
                  onClick={resumeGame}
                  variant="outline"
                  size="sm"
                  className="bg-green-600 border-green-500 text-white hover:bg-green-500 transition-all duration-200 px-6"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Resume Game
                </Button>
              )}

              {/* Reset Game Button */}
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="bg-red-600 border-red-500 text-white hover:bg-red-500 transition-all duration-200 px-6"
              >
                <Square className="mr-2 h-4 w-4" />
                Reset Game
              </Button>
            </div>
          )}

          {gameState === "correct" && (
            <div className="text-center space-y-3 animate-bounce">
              <div className="text-3xl font-bold text-green-400">🎉 Correct!</div>
              <div className="text-xl text-gray-300">
                The answer was: <strong className="text-blue-400">{currentWord?.word}</strong>
              </div>
              <div className="text-sm text-gray-400 animate-pulse">Moving to next round...</div>
            </div>
          )}

          {gameState === "wrong" && (
            <div className="text-center space-y-3 animate-pulse">
              <div className="text-3xl font-bold text-red-400">
                {timeLeft === 0 ? "⏰ Time's Up!" : "❌ Wrong Answer!"}
              </div>
              <div className="text-xl text-gray-300">
                The answer was: <strong className="text-blue-400">{currentWord?.word}</strong>
              </div>
              <div className="text-sm text-gray-400">Moving to next round...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}