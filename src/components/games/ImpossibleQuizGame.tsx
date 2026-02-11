import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const MAX_SCORE = 20;
const TIME_PER_QUESTION = 10;

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    question: "How many holes in a polo?",
    options: ["1", "2", "4", "0"],
    correctIndex: 2,
    explanation: "The letters p, o, l, o have 4 enclosed holes!",
  },
  {
    question: "What follows December 2nd?",
    options: ["January", "December 3rd", "The end of the year", "Christmas"],
    correctIndex: 1,
    explanation: "December 3rd follows December 2nd!",
  },
  {
    question: "Click the largest number",
    options: ["12", "120", "1", "12000"],
    correctIndex: 3,
    explanation: "12000 is the largest, regardless of font size!",
  },
  {
    question: "How many letters in 'the alphabet'?",
    options: ["26", "11", "10", "3"],
    correctIndex: 1,
    explanation: "'the alphabet' has 11 letters: t-h-e-a-l-p-h-a-b-e-t",
  },
  {
    question: "What has a head and tail but no body?",
    options: ["A snake", "A coin", "A shrimp", "A ghost"],
    correctIndex: 1,
    explanation: "A coin has a head and tail side!",
  },
  {
    question: "If you overtake 2nd place, what place are you in?",
    options: ["1st", "2nd", "3rd", "Still last"],
    correctIndex: 1,
    explanation: "You take their position: 2nd place!",
  },
  {
    question: "What goes up but never comes down?",
    options: ["A balloon", "Your age", "The sun", "A rocket"],
    correctIndex: 1,
    explanation: "Your age only goes up!",
  },
  {
    question: "How many months have 28 days?",
    options: ["1", "6", "All of them", "None"],
    correctIndex: 2,
    explanation: "Every month has at least 28 days!",
  },
  {
    question: "A farmer has 17 sheep. All but 9 die. How many left?",
    options: ["8", "17", "9", "0"],
    correctIndex: 2,
    explanation: "'All but 9' means 9 survive!",
  },
  {
    question: "Which word is spelled incorrectly in this question?",
    options: ["which", "spelled", "incorrectly", "question"],
    correctIndex: 2,
    explanation: "'incorrectly' is always spelled i-n-c-o-r-r-e-c-t-l-y!",
  },
  {
    question: "What can you catch but never throw?",
    options: ["A ball", "A cold", "A fish", "A frisbee"],
    correctIndex: 1,
    explanation: "You catch a cold but can't throw it!",
  },
  {
    question: "If there are 3 apples and you take 2, how many do YOU have?",
    options: ["1", "3", "2", "0"],
    correctIndex: 2,
    explanation: "You took 2, so you have 2!",
  },
  {
    question: "What gets wetter the more it dries?",
    options: ["The sun", "A sponge", "A towel", "Sand"],
    correctIndex: 2,
    explanation: "A towel gets wetter as it dries things!",
  },
  {
    question: "What is 2 + 2?",
    options: ["5", "22", "4", "Fish"],
    correctIndex: 2,
    explanation: "It's just 4... sometimes the obvious answer is right!",
  },
  {
    question: "What is always in front of you but can't be seen?",
    options: ["Your nose", "The future", "Air", "Your forehead"],
    correctIndex: 1,
    explanation: "The future is always ahead but unseen!",
  },
  {
    question: "How many times can you fold a paper in half?",
    options: ["7", "12", "Once", "Infinite"],
    correctIndex: 2,
    explanation: "After the first fold, you're folding it in quarters!",
  },
  {
    question: "What has keys but no locks?",
    options: ["A keyboard", "A piano", "A map", "A cipher"],
    correctIndex: 1,
    explanation: "A piano has keys but no locks!",
  },
  {
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    options: ["The letter M", "Time", "A second", "Nothing"],
    correctIndex: 0,
    explanation: "The letter 'M' appears once in 'minute', twice in 'moment'!",
  },
  {
    question: "What has hands but can't clap?",
    options: ["A statue", "A clock", "A mannequin", "A crab"],
    correctIndex: 1,
    explanation: "A clock has hands but can't clap!",
  },
  {
    question: "What can travel around the world while staying in a corner?",
    options: ["The internet", "A stamp", "A satellite", "Light"],
    correctIndex: 1,
    explanation: "A stamp stays in the corner of an envelope and travels the world!",
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function ImpossibleQuizGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<"menu" | "play" | "feedback" | "done">("menu");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const startGame = () => {
    const shuffled = shuffleArray(ALL_QUESTIONS).slice(0, MAX_SCORE);
    setQuestions(shuffled);
    setCurrentQ(0);
    setScore(0);
    setLives(3);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedIndex(null);
    setWasCorrect(false);
    setShowExplanation(false);
    setPhase("play");
  };

  const handleGameEnd = useCallback((finalScore: number) => {
    setPhase("done");
    onGameEnd({
      score: finalScore,
      maxScore: MAX_SCORE,
      normalizedScore: Math.min(1, finalScore / MAX_SCORE),
    });
  }, [onGameEnd]);

  const advanceQuestion = useCallback((currentScore: number, currentLives: number) => {
    const nextQ = currentQ + 1;
    if (nextQ >= questions.length || currentLives <= 0) {
      handleGameEnd(currentScore);
      return;
    }
    setCurrentQ(nextQ);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedIndex(null);
    setWasCorrect(false);
    setShowExplanation(false);
    setPhase("play");
  }, [currentQ, questions.length, handleGameEnd]);

  // Timer
  useEffect(() => {
    if (phase !== "play") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Time's up = wrong answer
          setLives((l) => {
            const newLives = l - 1;
            setWasCorrect(false);
            setShowExplanation(true);
            setPhase("feedback");
            feedbackTimeoutRef.current = setTimeout(() => {
              advanceQuestion(score, newLives);
            }, 2000);
            return newLives;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(feedbackTimeoutRef.current);
    };
  }, [phase, currentQ, score, advanceQuestion]);

  const handleAnswer = (index: number) => {
    if (phase !== "play" || selectedIndex !== null) return;

    clearInterval(timerRef.current);
    setSelectedIndex(index);

    const correct = index === questions[currentQ].correctIndex;
    setWasCorrect(correct);
    setShowExplanation(true);
    setPhase("feedback");

    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      onScoreChange?.(newScore);
      feedbackTimeoutRef.current = setTimeout(() => {
        advanceQuestion(newScore, lives);
      }, 1800);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      feedbackTimeoutRef.current = setTimeout(() => {
        advanceQuestion(score, newLives);
      }, 2000);
    }
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Galaxy Brain Quiz</h3>
        </div>
        <p className="text-muted-foreground mb-2">20 trick questions. 3 lives. 10 seconds each.</p>
        <p className="text-muted-foreground mb-6 text-sm">Nothing is as it seems... Think outside the box!</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl">
          Start!
        </motion.button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Galaxy Brain Quiz</h3>
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl p-8"
        >
          <p className="text-5xl mb-4">{score >= 15 ? "🧠" : score >= 10 ? "🤔" : score >= 5 ? "😅" : "💀"}</p>
          <p className="text-2xl font-bold text-foreground mb-2">
            {score >= 15 ? "Galaxy Brain!" : score >= 10 ? "Pretty Smart!" : score >= 5 ? "Not Bad!" : "Big Oof!"}
          </p>
          <p className="text-lg text-muted-foreground">
            {score}/{MAX_SCORE} correct
          </p>
          {lives <= 0 && (
            <p className="text-sm text-red-400 mt-2">You ran out of lives!</p>
          )}
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  const timerColor = timeLeft <= 3 ? "text-red-400" : timeLeft <= 5 ? "text-yellow-400" : "text-foreground";
  const timerBarWidth = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerBarColor = timeLeft <= 3 ? "bg-red-500" : timeLeft <= 5 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">Galaxy Brain Quiz</h3>
        <span className={`ml-auto text-lg font-bold ${timerColor}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">Q{currentQ + 1}/{questions.length}</span>
        <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-foreground font-bold">{score} pts</span>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 bg-black/20 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full ${timerBarColor} rounded-full`}
          animate={{ width: `${timerBarWidth}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Lives */}
      <div className="flex gap-1 mb-4 justify-center">
        {Array.from({ length: 3 }, (_, i) => (
          <motion.span
            key={i}
            animate={i >= lives ? { scale: 0.5, opacity: 0.3 } : { scale: 1, opacity: 1 }}
            className="text-2xl"
          >
            {i < lives ? "❤️" : "🖤"}
          </motion.span>
        ))}
      </div>

      {/* Question */}
      <motion.div
        key={currentQ}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl p-5 mb-4"
      >
        <p className="text-lg font-bold text-foreground text-center leading-relaxed">
          {q.question}
        </p>
      </motion.div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <AnimatePresence mode="wait">
          {q.options.map((option, i) => {
            let bgClass = "bg-black/30 border-white/10 hover:bg-black/50";
            let textClass = "text-foreground";

            if (selectedIndex !== null) {
              if (i === q.correctIndex) {
                bgClass = "bg-green-500/30 border-green-500";
                textClass = "text-green-300";
              } else if (i === selectedIndex && !wasCorrect) {
                bgClass = "bg-red-500/30 border-red-500";
                textClass = "text-red-300";
              } else {
                bgClass = "bg-black/20 border-white/5";
                textClass = "text-muted-foreground";
              }
            }

            // Special styling for "Click the largest number" question
            const isLargestQ = q.question === "Click the largest number";
            let fontSize = "text-base";
            if (isLargestQ) {
              if (option === "12") fontSize = "text-2xl";
              else if (option === "120") fontSize = "text-xs";
              else if (option === "1") fontSize = "text-3xl";
              else if (option === "12000") fontSize = "text-[10px]";
            }

            return (
              <motion.button
                key={`${currentQ}-${i}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={selectedIndex === null ? { scale: 0.92 } : undefined}
                onClick={() => handleAnswer(i)}
                disabled={selectedIndex !== null}
                className={`${bgClass} ${textClass} border-2 rounded-xl p-4 font-bold
                  transition-colors min-h-[60px] flex items-center justify-center ${fontSize}`}
              >
                {option}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Feedback / Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`rounded-xl p-4 text-center ${
              wasCorrect
                ? "bg-green-500/20 border border-green-500/50"
                : "bg-red-500/20 border border-red-500/50"
            }`}
          >
            <p className={`font-bold text-lg mb-1 ${wasCorrect ? "text-green-400" : "text-red-400"}`}>
              {wasCorrect ? "Correct!" : timeLeft <= 0 ? "Time's Up!" : "Wrong!"}
            </p>
            <p className="text-sm text-muted-foreground">{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
