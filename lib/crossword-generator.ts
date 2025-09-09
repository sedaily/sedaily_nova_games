export type Direction = "across" | "down"

export interface Entry {
  hint: string
  answer: string
  aliases?: string[]
}

export interface PlacedClue {
  number: number
  direction: Direction
  row: number
  col: number
  length: number
  hint: string
  answer: string
}

export interface GeneratedCrossword {
  size: number
  clues: PlacedClue[]
}

const KOREAN_RE = /[가-힣]/g
const clean = (s: string) => (s.match(KOREAN_RE) ?? []).join("") // 한글만 사용

type Cell = string | null // 글자 or null(빈 칸)
type Board = Cell[][]

function makeBoard(n: number): Board {
  return Array.from({ length: n }, () => Array<Cell>(n).fill(null))
}

function canPlace(
  board: Board,
  word: string,
  row: number,
  col: number,
  dir: Direction,
): { ok: boolean; overlaps: number } {
  const N = board.length
  if (dir === "across") {
    if (col + word.length > N) return { ok: false, overlaps: 0 }
  } else {
    if (row + word.length > N) return { ok: false, overlaps: 0 }
  }

  let overlaps = 0
  for (let i = 0; i < word.length; i++) {
  const r = dir === "across" ? row : row + i
  const c = dir === "across" ? col + i : col
  const cell: Cell = board[r]?.[c] ?? null

    // 충돌: 다른 글자
    if (cell && cell !== word[i]) return { ok: false, overlaps: 0 }

    // 인접 검증(교차 지점은 허용)
    if (!cell) {
      // 좌우/상하 인접 금지(크로스워드 간격 규칙)
      if (dir === "across") {
        if ((r > 0 && board[r - 1]?.[c]) || (r < N - 1 && board[r + 1]?.[c])) return { ok: false, overlaps: 0 }
      } else {
        if ((c > 0 && board[r]?.[c - 1]) || (c < N - 1 && board[r]?.[c + 1])) return { ok: false, overlaps: 0 }
      }
    } else {
      overlaps++
    }
  }

  // 시작/끝 양옆(또는 위아래) 이어붙기 방지
  if (dir === "across") {
    if (col > 0 && board[row]?.[col - 1]) return { ok: false, overlaps: 0 }
    if (col + word.length < N && board[row]?.[col + word.length]) return { ok: false, overlaps: 0 }
  } else {
    if (row > 0 && board[row - 1]?.[col]) return { ok: false, overlaps: 0 }
    if (row + word.length < N && board[row + word.length]?.[col]) return { ok: false, overlaps: 0 }
  }

  return { ok: true, overlaps }
}

function place(board: Board, word: string, row: number, col: number, dir: Direction) {
  for (let i = 0; i < word.length; i++) {
    const r = dir === "across" ? row : row + i
    const c = dir === "across" ? col + i : col
    // board rows are guaranteed to exist for valid placements; assert non-null to satisfy TS
    board[r]![c] = word[i]!
  }
}

function scorePosition(N: number, row: number, col: number, dir: Direction, overlaps: number) {
  // 중심부 선호 + 교차 수 가중치
  const center = (N - 1) / 2
  const dr = row - center
  const dc = col - center
  const dist = Math.hypot(dr, dc)
  return overlaps * 10 - dist // 교차를 강하게 선호
}

export function generateCrossword(input: { maxSize: number; entries: Entry[] }, _seed?: number): GeneratedCrossword {
  // mark _seed as used to avoid lint warning when unused
  void _seed
  const N = input.maxSize
  const entries = (input.entries ?? [])
    .map((e) => ({ ...e, answer: clean(e.answer) }))
    .filter((e) => typeof e.answer === "string" && e.answer.length > 0)

  // 긴 단어 우선
  entries.sort((a, b) => b.answer.length - a.answer.length)

  const board = makeBoard(N)
  const placed: { answer: string; hint: string; row: number; col: number; dir: Direction }[] = []

  // 1) 첫 단어: 가운데 가로로
  if (entries.length > 0) {
    const first = entries[0]
    if (first && first.answer) {
      const w = first.answer
      const r = Math.floor(N / 2)
      const c = Math.max(0, Math.floor((N - w.length) / 2))
      place(board, w, r, c, "across")
      placed.push({ answer: w, hint: first.hint ?? "", row: r, col: c, dir: "across" })
    }
  }

  // 2) 나머지 단어 배치(교차 극대화)
  for (let idx = 1; idx < entries.length; idx++) {
    const entry = entries[idx]
    if (!entry || !entry.answer) continue
    const w = entry.answer
    let best: { row: number; col: number; dir: Direction; score: number } | null = null

    for (const dir of ["across", "down"] as Direction[]) {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const { ok, overlaps } = canPlace(board, w, r, c, dir)
          if (!ok || overlaps === 0) continue // 최소 1개 교차
          const s = scorePosition(N, r, c, dir, overlaps)
          if (!best || s > best.score) best = { row: r, col: c, dir, score: s }
        }
      }
    }

    // 교차 배치 실패 시 가장 충돌 적은 자리라도 허용
    if (!best) {
      for (const dir of ["across", "down"] as Direction[]) {
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            const chk = canPlace(board, w, r, c, dir)
            if (chk.ok) {
              best = { row: r, col: c, dir, score: chk.overlaps }
              break
            }
          }
          if (best) break
        }
        if (best) break
      }
    }

    if (!best) continue // 정말 못 놓는 경우 스킵

  place(board, w, best.row, best.col, best.dir)
  const entryHint = entries[idx]?.hint ?? ""
  placed.push({ answer: w, hint: entryHint, row: best.row, col: best.col, dir: best.dir })
  }

  // 3) 번호 매기기
  const clues: PlacedClue[] = []
  const numberMap = new Map<string, number>()
  let nextNumber = 1

  // 좌상단부터 스캔하여 번호 할당
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const acrossClue = placed.find((p) => p.row === r && p.col === c && p.dir === "across")
      const downClue = placed.find((p) => p.row === r && p.col === c && p.dir === "down")

      if (acrossClue || downClue) {
        const key = `${r}-${c}`
        if (!numberMap.has(key)) {
          numberMap.set(key, nextNumber++)
        }
      }
    }
  }

  // 번호를 할당하여 clues 생성
  for (const p of placed) {
    const key = `${p.row}-${p.col}`
    const number = numberMap.get(key) || 0

    clues.push({
      number,
      direction: p.dir,
      row: p.row,
      col: p.col,
      length: p.answer.length,
      hint: p.hint,
      answer: p.answer,
    })
  }

  // 번호순으로 정렬
  clues.sort((a, b) => a.number - b.number || (a.direction === "across" ? -1 : 1))

  return { size: N, clues }
}
