import * as SQLite from "expo-sqlite";

type OfflineWorkout = {
  id: string;
  title: string;
  description?: string;
  level: string;
  estimatedMinutes: number;
  createdBy?: string;
  rounds?: any[];
};

const db = SQLite.openDatabaseSync("shadowbox.db");

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS offline_workouts (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      level TEXT NOT NULL,
      estimatedMinutes INTEGER NOT NULL,
      createdBy TEXT,
      rounds TEXT,
      downloadedAt TEXT
    );
  `);
}

export function saveOfflineWorkout(
  workoutId: string,
  workout: OfflineWorkout
) {
  initDatabase();

  const roundsJson = JSON.stringify(workout.rounds || []);

  db.runSync(
    `
      INSERT OR REPLACE INTO offline_workouts
      (id, title, description, level, estimatedMinutes, createdBy, rounds, downloadedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      workoutId,
      workout.title,
      workout.description || "",
      workout.level,
      workout.estimatedMinutes,
      workout.createdBy || "system",
      roundsJson,
      new Date().toISOString(),
    ]
  );
}

export function deleteOfflineWorkout(workoutId: string) {
  initDatabase();

  db.runSync(
    `DELETE FROM offline_workouts WHERE id = ?;`,
    [workoutId]
  );
}

export function getOfflineWorkouts(): OfflineWorkout[] {
  initDatabase();

  const rows = db.getAllSync<any>(`
    SELECT * FROM offline_workouts
    ORDER BY downloadedAt DESC;
  `);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    level: row.level,
    estimatedMinutes: row.estimatedMinutes,
    createdBy: row.createdBy,
    rounds: row.rounds ? JSON.parse(row.rounds) : [],
  }));
}

export function getOfflineWorkoutById(workoutId: string) {
  initDatabase();

  const row = db.getFirstSync<any>(
    `
      SELECT * FROM offline_workouts
      WHERE id = ?;
    `,
    [workoutId]
  );

  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    level: row.level,
    estimatedMinutes: row.estimatedMinutes,
    createdBy: row.createdBy,
    rounds: row.rounds ? JSON.parse(row.rounds) : [],
  };
}

export function isWorkoutDownloaded(workoutId: string) {
  initDatabase();

  const row = db.getFirstSync<any>(
    `SELECT id FROM offline_workouts WHERE id = ?;`,
    [workoutId]
  );

  return !!row;
}