"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase, type TestResult as SupabaseTestResult } from "./supabase"
import { useAuthStore } from "./auth-store"

export interface TestResult {
  wpm: number
  accuracy: number
  errors: number
  timeLimit: number
  wordsTyped: number
  charactersTyped: number
  date: string
}

interface TypingState {
  // UI State
  currentView: "test" | "analytics" | "history" | "profile"
  showResults: boolean
  showSettings: boolean

  // Test Configuration
  testMode: "words" | "quotes" | "code" | "custom" | "arabic-words" | "arabic-quotes"
  timeLimit: number
  wordCount: number

  // Test State
  isTestActive: boolean
  isTestComplete: boolean
  startTime: number | null

  // Test Content
  currentText: string
  userInput: string
  currentWordIndex: number
  currentCharIndex: number

  // Performance Metrics
  wpm: number
  accuracy: number
  errors: number
  timeRemaining: number

  // History & Profile
  testHistory: TestResult[]
  username: string

  // Settings
  soundEnabled: boolean

  // Actions
  setCurrentView: (view: "test" | "analytics" | "history" | "profile") => void
  setShowResults: (show: boolean) => void
  setShowSettings: (show: boolean) => void
  setTestMode: (mode: "words" | "quotes" | "code" | "custom" | "arabic-words" | "arabic-quotes") => void
  setTimeLimit: (limit: number) => void
  setWordCount: (count: number) => void
  setCurrentText: (text: string) => void
  startTest: () => void
  resetTest: () => void
  updateInput: (input: string) => void
  saveTestResult: (result: TestResult) => void
  clearHistory: () => void
  setUsername: (name: string) => void
  setSoundEnabled: (enabled: boolean) => void
  loadTestHistory: () => Promise<void>
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentView: "test",
      showResults: false,
      showSettings: false,
      testMode: "words",
      timeLimit: 60,
      wordCount: 50,
      isTestActive: false,
      isTestComplete: false,
      startTime: null,
      currentText: "",
      userInput: "",
      currentWordIndex: 0,
      currentCharIndex: 0,
      wpm: 0,
      accuracy: 100,
      errors: 0,
      timeRemaining: 60,
      testHistory: [],
      username: "",
      soundEnabled: true,

      // Actions
      setCurrentView: (view) => set({ currentView: view }),
      setShowResults: (show) => set({ showResults: show }),
      setShowSettings: (show) => set({ showSettings: show }),
      setTestMode: (mode) => set({ testMode: mode }),
      setTimeLimit: (limit) => set({ timeLimit: limit, timeRemaining: limit }),
      setWordCount: (count) => set({ wordCount: count }),
      setCurrentText: (text) => set({ currentText: text }),

      startTest: () => {
        const now = Date.now()
        set({
          isTestActive: true,
          isTestComplete: false,
          startTime: now,
          userInput: "",
          currentWordIndex: 0,
          currentCharIndex: 0,
          wpm: 0,
          accuracy: 100,
          errors: 0,
        })

        // Start timer
        const timer = setInterval(() => {
          const state = get()
          if (!state.isTestActive) {
            clearInterval(timer)
            return
          }

          const newTimeRemaining = state.timeRemaining - 1
          if (newTimeRemaining <= 0) {
            clearInterval(timer)
            set({
              isTestActive: false,
              isTestComplete: true,
              timeRemaining: 0,
              showResults: true,
            })
          } else {
            set({ timeRemaining: newTimeRemaining })
          }
        }, 1000)
      },

      resetTest: () => {
        const state = get()
        set({
          isTestActive: false,
          isTestComplete: false,
          startTime: null,
          userInput: "",
          currentWordIndex: 0,
          currentCharIndex: 0,
          wpm: 0,
          accuracy: 100,
          errors: 0,
          timeRemaining: state.timeLimit,
          showResults: false,
        })
      },

      updateInput: (input) => {
        const state = get()
        if (!state.isTestActive || state.isTestComplete) return

        const words = state.currentText.split(" ")
        const userWords = input.split(" ")
        const currentWordIndex = Math.min(userWords.length - 1, words.length - 1)

        // Calculate metrics
        let correctChars = 0
        let totalChars = 0
        let errors = 0

        for (let i = 0; i < userWords.length && i < words.length; i++) {
          const userWord = userWords[i]
          const originalWord = words[i]

          for (let j = 0; j < Math.max(userWord.length, originalWord.length); j++) {
            totalChars++
            if (j < userWord.length && j < originalWord.length) {
              if (userWord[j] === originalWord[j]) {
                correctChars++
              } else {
                errors++
              }
            } else if (j >= originalWord.length) {
              errors++ // Extra characters
            }
          }
        }

        const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100
        const timeElapsed = state.startTime ? (Date.now() - state.startTime) / 1000 / 60 : 0
        const wpm = timeElapsed > 0 ? correctChars / 5 / timeElapsed : 0

        set({
          userInput: input,
          currentWordIndex,
          wpm,
          accuracy,
          errors,
        })

        // Check if test is complete
        if (currentWordIndex >= words.length - 1 && userWords[currentWordIndex] === words[currentWordIndex]) {
          set({
            isTestActive: false,
            isTestComplete: true,
            showResults: true,
          })
        }
      },

      saveTestResult: async (result) => {
        // Save to local state
        set((state) => ({
          testHistory: [...state.testHistory.slice(-49), result],
        }))

        // Save to Supabase if user is authenticated
        const authStore = useAuthStore.getState()
        if (authStore.user) {
          try {
            const supabaseResult: SupabaseTestResult = {
              user_id: authStore.user.id,
              wpm: result.wpm,
              accuracy: result.accuracy,
              errors: result.errors,
              time_limit: result.timeLimit,
              words_typed: result.wordsTyped,
              characters_typed: result.charactersTyped,
              test_mode: get().testMode, // Use current test mode
            }

            const { error } = await supabase.from("test_results").insert([supabaseResult])

            if (error) {
              console.error("Error saving test result:", error)
            } else {
              // Update user profile stats
              const { data: profile } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", authStore.user.id)
                .single()

              if (profile) {
                const newTotalTests = profile.total_tests + 1
                const newAvgWpm = Math.round((profile.avg_wpm * profile.total_tests + result.wpm) / newTotalTests)
                const newBestWpm = Math.max(profile.best_wpm, result.wpm)

                await supabase
                  .from("user_profiles")
                  .update({
                    total_tests: newTotalTests,
                    avg_wpm: newAvgWpm,
                    best_wpm: newBestWpm,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", authStore.user.id)

                // Refresh the auth store profile
                authStore.fetchProfile()
              }
            }
          } catch (error) {
            console.error("Error saving to Supabase:", error)
          }
        }
      },

      loadTestHistory: async () => {
        const authStore = useAuthStore.getState()
        if (authStore.user) {
          try {
            const { data, error } = await supabase
              .from("test_results")
              .select("*")
              .eq("user_id", authStore.user.id)
              .order("created_at", { ascending: false })
              .limit(50)

            if (error) {
              console.error("Error loading test history:", error)
              return
            }

            // Convert Supabase results to local format
            const localResults = data.map((result) => ({
              wpm: result.wpm,
              accuracy: result.accuracy,
              errors: result.errors,
              timeLimit: result.time_limit,
              wordsTyped: result.words_typed,
              charactersTyped: result.characters_typed,
              date: result.created_at || new Date().toISOString(),
            }))

            set({ testHistory: localResults })
          } catch (error) {
            console.error("Error loading test history:", error)
          }
        }
      },

      clearHistory: () => set({ testHistory: [] }),
      setUsername: (name) => set({ username: name }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    }),
    {
      name: "typing-test-storage",
      partialize: (state) => ({
        testHistory: state.testHistory,
        username: state.username,
        soundEnabled: state.soundEnabled,
        testMode: state.testMode,
        timeLimit: state.timeLimit,
        wordCount: state.wordCount,
      }),
    },
  ),
)
