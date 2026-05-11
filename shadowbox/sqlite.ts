import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("shadowbox.db");

export async function initDatabase() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS offline_workouts (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      description TEXT,
      level TEXT,
      estimatedMinutes INTEGER,
      rounds TEXT
    );
  `);
}

export async function saveWorkoutOffline(workout: any) {
  await db.runAsync(
    `
    INSERT OR REPLACE INTO offline_workouts
    (
      id,
      title,
      description,
      level,
      estimatedMinutes,
      rounds
    )
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    [
      workout.id,
      workout.title,
      workout.description,
      workout.level,
      workout.estimatedMinutes,
      JSON.stringify(workout.rounds || []),
    ]
  );
}

export async function removeOfflineWorkout(id: string) {
  await db.runAsync(
    `DELETE FROM offline_workouts WHERE id = ?;`,
    [id]
  );
}

export async function getOfflineWorkouts() {
  const result = await db.getAllAsync(
    `SELECT * FROM offline_workouts;`
  );

  return result.map((item: any) => ({
    ...item,
    rounds: JSON.parse(item.rounds || "[]"),
  }));
}

export async function getOfflineWorkoutById(id: string) {
  const result: any = await db.getFirstAsync(
    `SELECT * FROM offline_workouts WHERE id = ?;`,
    [id]
  );

  if (!result) return null;

  return {
    ...result,
    rounds: JSON.parse(result.rounds || "[]"),
  };
}