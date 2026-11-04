// Mock of the completions API: which days a habit was done, as 'YYYY-MM-DD' keys.
// Replace the function bodies with real requests later; screens only depend on the signatures.

export const DEMO_HABIT_ID = 'demo';

const store = new Map<string, Set<string>>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Demo history: the last 21 days in a row, plus most days of the 40 before that.
function seedDemo() {
  const keys = new Set<string>();
  const today = new Date();
  for (let i = 0; i < 61; i++) {
    if (i < 21 || i % 5 !== 0) {
      keys.add(toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)));
    }
  }
  return keys;
}

function completionsFor(habitId: string) {
  let keys = store.get(habitId);
  if (!keys) {
    keys = habitId === DEMO_HABIT_ID ? seedDemo() : new Set();
    store.set(habitId, keys);
  }
  return keys;
}

export async function fetchCompletions(habitId: string): Promise<string[]> {
  await delay(200);
  return [...completionsFor(habitId)];
}

export async function setCompletion(habitId: string, dateKey: string, done: boolean): Promise<void> {
  await delay(200);
  const keys = completionsFor(habitId);
  if (done) {
    keys.add(dateKey);
  } else {
    keys.delete(dateKey);
  }
}
