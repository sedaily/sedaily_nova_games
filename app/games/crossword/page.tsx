
"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Grid3X3,
  Target,
  Play,
  Pause,
  RotateCcw,
  Home,
  ArrowUp,
  Delete,
} from "lucide-react"
import Link from "next/link"
import { GameCountdown } from "@/components/game-countdown"
import { generateCrossword, type GeneratedCrossword } from "../../../lib/crossword-generator"
type RawEntry = { hint: string; answer: string; aliases?: string[] }

type GameState = "start" | "countdown" | "playing" | "completed"
type Direction = "across" | "down"
type ClueKey = `${number}-${Direction}`

interface Clue {
  number: number
  direction: Direction
  row: number
  col: number
  length: number
  hint: string
  answer: string
}

interface CellState {
  value: string
  isCorrect: boolean
  isRevealed: boolean
}

const createInitialGrid = (size: number): CellState[][] => {
  return Array(size)
    .fill(null)
    .map(() =>
      Array(size)
        .fill(null)
        .map(() => ({
          value: "",
          isCorrect: false,
          isRevealed: false,
        })),
    )
}

// Helper: safely read a cell
const safeGetCell = (g: CellState[] | CellState[][], row: number, col: number): CellState | undefined => {
  // g may be the grid (2D array); provide defensive typing
  const gridAny = g as CellState[][]
  return gridAny?.[row]?.[col]
}

// Helper: update a single cell in the grid safely
const updateGridCell = (setGridFn: React.Dispatch<React.SetStateAction<CellState[][]>>, row: number, col: number, updater: (cell: CellState) => CellState) => {
  setGridFn((prevGrid) => {
    const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })))
    if (newGrid[row] && newGrid[row][col]) {
      newGrid[row][col] = updater(newGrid[row][col])
    }
    return newGrid
  })
}

const toClueKey = (number: number, direction: Direction): ClueKey => `${number}-${direction}`

const getCellsForClue = (clue: Clue): Array<{ row: number; col: number }> => {
  const cells = []
  for (let i = 0; i < clue.length; i++) {
    if (clue.direction === "across") {
      cells.push({ row: clue.row, col: clue.col + i })
    } else {
      cells.push({ row: clue.row + i, col: clue.col })
    }
  }
  return cells
}

const readFromGrid = (grid: CellState[][], clue: Clue): string => {
  const cells = getCellsForClue(clue)
  return cells.map((cell) => grid[cell.row]?.[cell.col]?.value || "").join("")
}

export default function CrosswordGame() {

  const [gameState, setGameState] = useState<GameState>("start")
  const [crosswordData, setCrosswordData] = useState<GeneratedCrossword | null>(null)
  const [grid, setGrid] = useState<CellState[][]>([])
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null)
  const [completedClues, setCompletedClues] = useState<Set<ClueKey>>(new Set())
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const [gameTime, setGameTime] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [hintsUsed, setHintsUsed] = useState<number>(0)

  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const handleBackspaceRef = useRef<() => void | null>(null)

  const { usedCellsMap, cellNumberMap } = useMemo(() => {
    if (!crosswordData) return { usedCellsMap: new Map(), cellNumberMap: new Map() };

  const usedCells = new Map<string, boolean>();
  const cellNumbers = new Map<string, number>();

  ;((crosswordData?.clues ?? []) as Array<Clue>).forEach((clue: Clue) => {
      const cells = getCellsForClue(clue)
      cells.forEach((cell) => {
        const key = `${cell.row}-${cell.col}`
        usedCells.set(key, true)
      })

      // Store clue number at starting position
      const startKey = `${clue.row}-${clue.col}`
      cellNumbers.set(startKey, clue.number)
    })

    return { usedCellsMap: usedCells, cellNumberMap: cellNumbers }
  }, [crosswordData])

  const isCellUsed = useCallback(
    (row: number, col: number): boolean => {
      return usedCellsMap.has(`${row}-${col}`)
    },
    [usedCellsMap],
  )

  const getClueNumber = useCallback(
    (row: number, col: number): number | null => {
      return cellNumberMap.get(`${row}-${col}`) ?? null
    },
    [cellNumberMap],
  )

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setGameTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning])

  useEffect(() => {
    const loadData = async () => {
    try {
  const response = await fetch("/crossword-entries.json")
  const entriesData = await response.json() as { id?: string; maxSize: number; entries: RawEntry[] }
      const generatedData = generateCrossword(entriesData)
      setCrosswordData(generatedData)
      setGrid(createInitialGrid(generatedData.size))
      } catch (error) {
        console.error("Failed to load crossword data:", error)
        const fallbackData = {
          maxSize: 7,
          entries: [
            { hint: "중앙은행이 경기 조절을 위해 조정하는 정책금리", answer: "기준금리" },
            { hint: "기업이 자금 조달을 위해 발행하는 채무증서", answer: "회사채" },
            { hint: "국가가 발행하는 장기 채권으로 안전자산의 대표", answer: "국고채" },
          ],
        }
        const fallbackTyped: { maxSize: number; entries: RawEntry[] } = {
          maxSize: fallbackData.maxSize,
          entries: fallbackData.entries as RawEntry[],
        }
        const generatedData = generateCrossword(fallbackTyped)
  setCrosswordData(generatedData)
  setGrid(createInitialGrid(generatedData.size))
      }
    }

    loadData()
  }, [])

  const moveNext = useCallback(() => {
    if (!selectedClue) return
    const cells = getCellsForClue(selectedClue)
    const nextIndex = Math.min(activeIndex + 1, cells.length - 1)
    setActiveIndex(nextIndex)
  }, [selectedClue, activeIndex])

  const movePrev = useCallback(() => {
    if (!selectedClue) return
    const prevIndex = Math.max(activeIndex - 1, 0)
    setActiveIndex(prevIndex)
  }, [activeIndex, selectedClue])

  const switchDirection = useCallback(() => {
    if (!selectedClue || !crosswordData) return

    const oppositeDirection = selectedClue.direction === "across" ? "down" : "across"
    const alternateClue = crosswordData.clues.find(
      (c) => c.row === selectedClue.row && c.col === selectedClue.col && c.direction === oppositeDirection,
    )

    if (alternateClue) {
      selectClue(alternateClue)
    }
  }, [selectedClue, crosswordData])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing" || !selectedClue || isComposing) return

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (selectedClue.direction === "down") movePrev()
          break
        case "ArrowDown":
          e.preventDefault()
          if (selectedClue.direction === "down") moveNext()
          break
        case "ArrowLeft":
          e.preventDefault()
          if (selectedClue.direction === "across") movePrev()
          break
        case "ArrowRight":
          e.preventDefault()
          if (selectedClue.direction === "across") moveNext()
          break
        case " ":
          e.preventDefault()
          switchDirection()
          break
        case "Backspace":
          e.preventDefault()
          handleBackspaceRef.current?.()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [gameState, selectedClue, isComposing, moveNext, movePrev, switchDirection])

  useEffect(() => {
    if (gameState === "playing" && hiddenInputRef.current) {
      hiddenInputRef.current.focus()
    }
  }, [gameState, selectedClue])

  const startGame = () => {
    setGameState("countdown")
  }

  const handleCountdownComplete = () => {
    setGameState("playing")
    setIsTimerRunning(true)
    requestAnimationFrame(() => hiddenInputRef.current?.focus())
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetGame = () => {
    setGameState("start")
    setGameTime(0)
    setIsTimerRunning(false)
    setHintsUsed(0)
    setCompletedClues(new Set())
    setSelectedClue(null)
    setActiveIndex(0)

    if (crosswordData) {
      setGrid(createInitialGrid(crosswordData.size))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const selectClue = (clue: Clue) => {
    setSelectedClue(clue)
    setActiveIndex(0)
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = ""
      hiddenInputRef.current.focus()
    }
  }

  const isCellInSelectedClue = (row: number, col: number): boolean => {
    if (!selectedClue) return false
    const cells = getCellsForClue(selectedClue)
    return cells.some((cell: { row: number; col: number } | undefined) => !!cell && cell.row === row && cell.col === col)
  }

  // Keep a stable ref for handleBackspace so keydown handler doesn't need it in deps

  const isActiveCursor = (row: number, col: number): boolean => {
    if (!selectedClue) return false
    const cells = getCellsForClue(selectedClue)
    const activeCell = cells[activeIndex]
    return !!(activeCell && activeCell.row === row && activeCell.col === col)
  }

  const handleInput = useCallback(
    (inputValue: string) => {
      if (!selectedClue || isComposing) return

      const sanitized = inputValue.replace(/[^가-힣a-zA-Z0-9]/g, "")
      const cells = getCellsForClue(selectedClue)

      if (sanitized.length > 0) {
        const lastChar = sanitized[sanitized.length - 1]
        const targetCell = cells[activeIndex]
        if (targetCell && safeGetCell(grid, targetCell.row, targetCell.col)) {
          updateGridCell(setGrid, targetCell.row, targetCell.col, (prevCell) => ({
            ...prevCell,
            value: lastChar || "",
            isCorrect: prevCell.isCorrect ?? false,
            isRevealed: prevCell.isRevealed ?? false,
          }))
          moveNext()
        }
      }

      // Clear input for next character
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = ""
      }
    },
  [selectedClue, isComposing, activeIndex, moveNext, grid],
  )

  const handleBackspace = useCallback(() => {
    if (!selectedClue) return

    const cells = getCellsForClue(selectedClue)
    const currentCell = cells[activeIndex]

    if (currentCell && safeGetCell(grid, currentCell.row, currentCell.col) && safeGetCell(grid, currentCell.row, currentCell.col)!.value) {
      // Clear current cell
      updateGridCell(setGrid, currentCell.row, currentCell.col, (prevCell) => ({
        ...prevCell,
        value: "",
        isCorrect: prevCell.isCorrect ?? false,
        isRevealed: prevCell.isRevealed ?? false,
      }))
    } else {
      // Move to previous cell and clear it
      movePrev()
      const prevCell = cells[Math.max(activeIndex - 1, 0)]
      if (prevCell && safeGetCell(grid, prevCell.row, prevCell.col)) {
        updateGridCell(setGrid, prevCell.row, prevCell.col, (prevCellObj) => ({
          ...prevCellObj,
          value: "",
          isCorrect: prevCellObj.isCorrect ?? false,
          isRevealed: prevCellObj.isRevealed ?? false,
        }))
      }
    }
  }, [selectedClue, activeIndex, grid, movePrev])

  // keep ref updated to avoid adding handleBackspace to keydown deps
  useEffect(() => {
    handleBackspaceRef.current = () => handleBackspace()
  }, [handleBackspace])

  const checkAnswer = () => {
    if (!selectedClue) return

    const userAnswer = readFromGrid(grid, selectedClue).trim()
    const isCorrect = userAnswer === selectedClue.answer

    if (isCorrect) {
      const clueKey = toClueKey(selectedClue.number, selectedClue.direction)
      setCompletedClues((prev) => new Set([...prev, clueKey]))

      const cells = getCellsForClue(selectedClue)
      cells.forEach((cell) => {
        if (safeGetCell(grid, cell.row, cell.col)) {
          updateGridCell(setGrid, cell.row, cell.col, (prev) => ({ ...prev, isCorrect: true }))
        }
      })
      setSelectedClue(null)
      setActiveIndex(0)

      if (completedClues.size + 1 === crosswordData?.clues.length) {
        setGameState("completed")
        setIsTimerRunning(false)
      }
    }
  }

  const giveHint = () => {
    if (!selectedClue) return

    const cells = getCellsForClue(selectedClue)
    let firstEmptyIndex = -1
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (!cell) continue
      const sc = safeGetCell(grid, cell.row, cell.col)
      if (sc && (!sc.value || !sc.isRevealed)) {
        firstEmptyIndex = i
        break
      }
    }

    if (firstEmptyIndex !== -1) {
      const cell = cells[firstEmptyIndex]
      const hintChar = selectedClue.answer[firstEmptyIndex]
      if (cell && safeGetCell(grid, cell.row, cell.col)) {
        updateGridCell(setGrid, cell.row, cell.col, (prev) => ({
          ...prev,
          value: hintChar ?? "",
          isRevealed: true,
          isCorrect: typeof prev.isCorrect === "boolean" ? prev.isCorrect : false,
        }))
        setHintsUsed((prev) => prev + 1)
        setActiveIndex(Math.min(firstEmptyIndex + 1, cells.length - 1))
      }
    }
  }

  const progressPercentage = crosswordData && crosswordData.clues && crosswordData.clues.length > 0
    ? (completedClues.size / crosswordData.clues.length) * 100
    : 0

  if (!crosswordData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">크로스워드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              {(gameState === "playing" || gameState === "completed") && (
                <div className="flex items-center space-x-2">
                  <span
                    className="text-lg font-mono font-bold"
                    aria-live="polite"
                    aria-label={`경과 시간 ${formatTime(gameTime)}`}
                  >
                    {formatTime(gameTime)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={toggleTimer}>
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  게임즈로 돌아가기
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {(gameState === "playing" || gameState === "completed") && (
                <>
                  <Button variant="outline" size="sm" onClick={resetGame}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    다시하기
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      나가기
                    </Link>
                  </Button>
                </>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    도움말
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>크로스워드 게임 방법</DialogTitle>
                    <DialogDescription className="space-y-4">
                      <p>1. 단서를 클릭하여 해당 단어를 선택하세요.</p>
                      <p>2. 키보드로 답을 입력하면 격자에 글자가 채워집니다.</p>
                      <p>3. 방향키로 셀 이동, 스페이스바로 가로/세로 전환이 가능합니다.</p>
                      <p>4. 백스페이스로 글자를 지울 수 있습니다.</p>
                      <p>5. 정답 확인 버튼으로 답을 검증하세요.</p>
                      <p>6. 힌트 버튼으로 도움을 받을 수 있습니다.</p>
                      <p>7. 모든 단어를 완성하면 게임이 끝납니다.</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {gameState === "start" && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary mx-auto mb-6">
                <Grid3X3 className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold text-balance">서울경제 크로스워드</h1>
              <p className="text-xl text-muted-foreground text-balance">
                최신 경제 뉴스를 바탕으로 한 크로스워드 퍼즐로 시사 상식을 늘려보세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    도움말
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>크로스워드 게임 방법</DialogTitle>
                    <DialogDescription className="space-y-4">
                      <p>1. 단서를 클릭하여 해당 단어를 선택하세요.</p>
                      <p>2. 키보드로 답을 입력하면 격자에 글자가 채워집니다.</p>
                      <p>3. 방향키로 셀 이동, 스페이스바로 가로/세로 전환이 가능합니다.</p>
                      <p>4. 백스페이스로 글자를 지울 수 있습니다.</p>
                      <p>5. 정답 확인 버튼으로 답을 검증하세요.</p>
                      <p>6. 힌트 버튼으로 도움을 받을 수 있습니다.</p>
                      <p>7. 모든 단어를 완성하면 게임이 끝납니다.</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Button size="lg" onClick={startGame}>
                <Target className="w-5 h-5 mr-2" />
                게임 시작
              </Button>
            </div>
          </div>
        )}

        <GameCountdown
          isActive={gameState === "countdown"}
          onComplete={handleCountdownComplete}
          autoFocusTargetId="crossword-grid"
        />

        {(gameState === "playing" || gameState === "completed") && (
          <div className="space-y-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">서울경제 크로스워드</h2>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">힌트 사용: {hintsUsed}개</Badge>
                  <Badge variant="outline">
                    완성도: {completedClues.size}/{crosswordData.clues.length} ({Math.round(progressPercentage)}%)
                  </Badge>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                남은 단서: {crosswordData.clues.length - completedClues.size}개
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Grid3X3 className="w-5 h-5 mr-2" />
                      크로스워드 퍼즐
                    </CardTitle>
                    {selectedClue && (
                      <CardDescription>
                        선택된 단어: {selectedClue.number}-{selectedClue.direction === "across" ? "가로" : "세로"} -{" "}
                        {selectedClue.hint}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div
                      id="crossword-grid"
                      className="grid gap-1 max-w-md mx-auto aspect-square"
                      style={{ gridTemplateColumns: `repeat(${crosswordData.size}, 1fr)` }}
                      role="grid"
                      aria-label="크로스워드 퍼즐 격자"
                      aria-rowcount={crosswordData.size}
                      aria-colcount={crosswordData.size}
                    >
                      {Array.from({ length: crosswordData.size }, (_, row) =>
                        Array.from({ length: crosswordData.size }, (_, col) => {
                          const isUsed = isCellUsed(row, col)
                          const isSelected = isCellInSelectedClue(row, col)
                          const isActive = isActiveCursor(row, col)
                          const clueNumber = getClueNumber(row, col)
                          const cellState = grid[row]?.[col]

                          return (
                            <div
                              key={`${row}-${col}`}
                              className={`
                                relative aspect-square border-2 flex items-center justify-center text-lg font-bold transition-colors
                                ${
                                  isUsed
                                    ? `bg-white border-gray-300 ${isSelected ? "bg-blue-50 border-blue-400" : ""} ${isActive ? "ring-2 ring-blue-400/60 bg-blue-100" : ""} ${cellState?.isCorrect ? "bg-green-100 border-green-400" : ""}`
                                    : "bg-muted-foreground/20 border-gray-600"
                                }
                                ${isUsed ? "cursor-pointer hover:bg-gray-50" : ""}
                              `}
                              onClick={() => {
                                if (isUsed) {
                                  const clue = crosswordData.clues.find((c: Clue) => {
                                    const cells = getCellsForClue(c)
                                    return cells.some((cell) => cell.row === row && cell.col === col)
                                  })
                                  if (clue) selectClue(clue)
                                }
                              }}
                              role={isUsed ? "gridcell" : undefined}
                              tabIndex={isUsed ? 0 : -1}
                              aria-rowindex={row + 1}
                              aria-colindex={col + 1}
                              aria-label={isUsed ? `격자 ${row + 1}, ${col + 1}` : undefined}
                              aria-describedby={
                                selectedClue && isSelected
                                  ? `clue-${selectedClue.number}-${selectedClue.direction}`
                                  : undefined
                              }
                            >
                              {clueNumber && (
                                <span className="absolute top-0.5 left-0.5 text-xs text-gray-500 font-normal">
                                  {clueNumber}
                                </span>
                              )}
                              {isUsed && (
                                <span className={`${cellState?.isRevealed ? "text-blue-600" : "text-gray-900"}`}>
                                  {cellState?.value}
                                </span>
                              )}
                            </div>
                          )
                        }),
                      ).flat()}
                    </div>

                    <input
                      ref={hiddenInputRef}
                      type="text"
                      onChange={(e) => handleInput(e.target.value)}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={(e) => {
                        setIsComposing(false)
                        if (e.data) {
                          handleInput(e.data)
                        }
                      }}
                      className="absolute opacity-0 pointer-events-none"
                      style={{ left: "-9999px" }}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    {selectedClue && (
                      <div className="flex gap-4 justify-center mt-6">
                        <Button onClick={giveHint} variant="outline">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          힌트 ({hintsUsed}개 사용됨)
                        </Button>
                        <Button onClick={checkAnswer} disabled={!readFromGrid(grid, selectedClue).trim()}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          정답 확인
                        </Button>
                      </div>
                    )}

                    <div className="md:hidden mt-6 flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={switchDirection}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleBackspace}>
                        <Delete className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={checkAnswer}>
                        확인
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>가로 단서</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {crosswordData.clues
                      .filter((clue: Clue) => clue.direction === "across")
                      .map((clue: Clue) => {
                        const clueKey = toClueKey(clue.number, clue.direction)
                        const isCompleted = completedClues.has(clueKey)
                        const isSelected =
                          selectedClue?.number === clue.number && selectedClue?.direction === clue.direction

                        return (
                          <div
                            key={`across-${clue.number}`}
                            id={`clue-${clue.number}-${clue.direction}`}
                            className={`
                              p-3 rounded-lg border cursor-pointer transition-colors
                              ${isSelected ? "bg-blue-50 border-blue-200 ring-2 ring-blue-400/60" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}
                              ${isCompleted ? "bg-green-50 border-green-200" : ""}
                            `}
                            onClick={() => selectClue(clue)}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSelected}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <span className="font-bold text-sm">{clue.number}-가로:</span>
                                <p className="text-sm mt-1">{clue.hint}</p>
                              </div>
                              {isCompleted && <CheckCircle className="w-5 h-5 text-green-600 ml-2 flex-shrink-0" />}
                            </div>
                          </div>
                        )
                      })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>세로 단서</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {crosswordData.clues
                      .filter((clue: Clue) => clue.direction === "down")
                      .map((clue: Clue) => {
                        const clueKey = toClueKey(clue.number, clue.direction)
                        const isCompleted = completedClues.has(clueKey)
                        const isSelected =
                          selectedClue?.number === clue.number && selectedClue?.direction === clue.direction

                        return (
                          <div
                            key={`down-${clue.number}`}
                            id={`clue-${clue.number}-${clue.direction}`}
                            className={`
                              p-3 rounded-lg border cursor-pointer transition-colors
                              ${isSelected ? "bg-blue-50 border-blue-200 ring-2 ring-blue-400/60" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}
                              ${isCompleted ? "bg-green-50 border-green-200" : ""}
                            `}
                            onClick={() => selectClue(clue)}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSelected}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <span className="font-bold text-sm">{clue.number}-세로:</span>
                                <p className="text-sm mt-1">{clue.hint}</p>
                              </div>
                              {isCompleted && <CheckCircle className="w-5 h-5 text-green-600 ml-2 flex-shrink-0" />}
                            </div>
                          </div>
                        )
                      })}
                  </CardContent>
                </Card>
              </div>
            </div>

            {gameState === "completed" && (
              <Card className="max-w-2xl mx-auto text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">축하합니다!</h3>
                  <p className="text-muted-foreground mb-4">
                    모든 크로스워드를 완성했습니다. 경제 상식이 한층 늘었네요!
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">완료 시간:</span>
                        <br />
                        {formatTime(gameTime)}
                      </div>
                      <div>
                        <span className="font-semibold">힌트 사용:</span>
                        <br />
                        {hintsUsed}개
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <Link href="/">게임즈로 돌아가기</Link>
                    </Button>
                    <Button onClick={resetGame}>다시 플레이</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
