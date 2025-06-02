"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTypingStore } from "@/lib/store"
import {
  generateWords,
  generateQuote,
  generateCode,
  generateArabicWords,
  generateArabicQuote,
} from "@/lib/text-generator"
import { cn } from "@/lib/utils"
import { Play, RotateCcw, Timer, Target } from "lucide-react"

export function TypingTest() {
  const {
    testMode,
    timeLimit,
    wordCount,
    isTestActive,
    isTestComplete,
    currentText,
    userInput,
    currentWordIndex,
    currentCharIndex,
    wpm,
    accuracy,
    errors,
    timeRemaining,
    startTest,
    resetTest,
    updateInput,
    setCurrentText,
    setTimeLimit,
    setWordCount,
  } = useTypingStore()

  const inputRef = useRef<HTMLInputElement>(null)
  const [focusedInput, setFocusedInput] = useState(false)

  // Check if current mode is Arabic
  const isArabicMode = testMode === "arabic-words" || testMode === "arabic-quotes"

  // Generate text based on mode
  useEffect(() => {
    const generateText = async () => {
      let text = ""
      switch (testMode) {
        case "words":
          text = generateWords(wordCount)
          break
        case "quotes":
          text = await generateQuote()
          break
        case "code":
          text = generateCode()
          break
        case "arabic-words":
          text = generateArabicWords(wordCount)
          break
        case "arabic-quotes":
          text = await generateArabicQuote()
          break
        case "custom":
          text = "Type your custom text here..."
          break
        default:
          text = generateWords(wordCount)
      }
      setCurrentText(text)
    }

    if (!isTestActive) {
      generateText()
    }
  }, [testMode, wordCount, isTestActive, setCurrentText])

  // Focus input when test starts
  useEffect(() => {
    if (isTestActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTestActive])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTestActive) {
      startTest()
    }
    updateInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      if (!isTestActive) {
        startTest()
      }
    }
  }

  const words = currentText.split(" ")
  const currentWord = words[currentWordIndex] || ""
  const typedWord = userInput.split(" ")[currentWordIndex] || ""

  const renderWord = (word: string, wordIndex: number) => {
    const isCurrentWord = wordIndex === currentWordIndex
    const typedWords = userInput.split(" ")
    const typedWord = typedWords[wordIndex] || ""

    if (wordIndex < currentWordIndex) {
      // Completed word
      const isCorrect = typedWord === word
      return (
        <span
          key={wordIndex}
          className={cn(
            "inline-block mr-2 mb-1 px-1 rounded",
            isArabicMode && "ml-2 mr-0",
            isCorrect
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          )}
        >
          {word}
        </span>
      )
    } else if (isCurrentWord) {
      // Current word being typed
      return (
        <span key={wordIndex} className={cn("inline-block mr-2 mb-1 relative", isArabicMode && "ml-2 mr-0")}>
          <span className="bg-blue-100 dark:bg-blue-900 px-1 rounded font-semibold">
            {word.split("").map((char, charIndex) => {
              const typedChar = typedWord[charIndex]
              let className = ""

              if (charIndex < typedWord.length) {
                className =
                  typedChar === char
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900"
              } else if (charIndex === typedWord.length) {
                className = "bg-blue-500 text-white animate-pulse"
              }

              return (
                <span key={charIndex} className={className}>
                  {char}
                </span>
              )
            })}
            {typedWord.length > word.length && (
              <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900">
                {typedWord.slice(word.length)}
              </span>
            )}
          </span>
        </span>
      )
    } else {
      // Future word
      return (
        <span
          key={wordIndex}
          className={cn("inline-block mr-2 mb-1 text-muted-foreground", isArabicMode && "ml-2 mr-0")}
        >
          {word}
        </span>
      )
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Typing Speed Test
          {isArabicMode && <span className="text-lg text-muted-foreground ml-2 font-arabic">اختبار سرعة الكتابة</span>}
        </h1>
        <p className="text-muted-foreground">
          {isArabicMode
            ? "اختبر سرعة ودقة الكتابة باللغة العربية مع التغذية الراجعة الفورية"
            : "Test your typing speed and accuracy with real-time feedback"}
        </p>
      </div>

      {/* Test Configuration */}
      {!isTestActive && !isTestComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-card rounded-lg border"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-medium">Time:</span>
              <div className="flex gap-1">
                {[15, 30, 60, 120].map((time) => (
                  <Button
                    key={time}
                    variant={timeLimit === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeLimit(time)}
                  >
                    {time}s
                  </Button>
                ))}
              </div>
            </div>

            {(testMode === "words" || testMode === "arabic-words") && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Words:</span>
                <div className="flex gap-1">
                  {[25, 50, 100, 200].map((count) => (
                    <Button
                      key={count}
                      variant={wordCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWordCount(count)}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Live Stats */}
      {(isTestActive || isTestComplete) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(wpm)}</div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(accuracy)}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-red-600">{errors}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-orange-600">{timeRemaining}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {isTestActive && (
        <div className="mb-6">
          <Progress value={((timeLimit - timeRemaining) / timeLimit) * 100} className="h-2" />
        </div>
      )}

      {/* Typing Area */}
      <div className="mb-6">
        <div
          className={cn(
            "p-6 bg-card rounded-lg border min-h-[200px] text-lg leading-relaxed",
            focusedInput && "ring-2 ring-blue-500",
            isArabicMode && "text-right font-arabic text-xl",
          )}
          onClick={() => inputRef.current?.focus()}
          dir={isArabicMode ? "rtl" : "ltr"}
        >
          <div className={cn("font-mono", isArabicMode && "font-arabic")}>
            {words.map((word, index) => renderWord(word, index))}
          </div>
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setFocusedInput(false)}
          className="opacity-0 absolute -z-10"
          disabled={isTestComplete}
          dir={isArabicMode ? "rtl" : "ltr"}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        {!isTestActive && !isTestComplete && (
          <Button
            onClick={() => {
              startTest()
              inputRef.current?.focus()
            }}
            size="lg"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isArabicMode ? "ابدأ الاختبار" : "Start Test"}
          </Button>
        )}

        <Button onClick={resetTest} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          {isArabicMode ? "إعادة تعيين" : "Reset"}
        </Button>
      </div>

      {/* Instructions */}
      {!isTestActive && !isTestComplete && (
        <div className="mt-8 text-center text-muted-foreground">
          <p>
            {isArabicMode
              ? "انقر على منطقة النص أو اضغط Tab لبدء الكتابة"
              : "Click on the text area or press Tab to start typing"}
          </p>
        </div>
      )}
    </div>
  )
}
