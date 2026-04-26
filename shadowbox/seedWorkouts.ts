import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const workouts = [
  {
    title: "Boxeo básico",
    description: "Entrenamiento ideal para principiantes.",
    level: "basico",
    estimatedMinutes: 10,
    createdBy: "system",
    rounds: [
      {
        title: "Calentamiento",
        description: "Movilidad y activación general",
        duration: 120,
        image: "https://i.imgur.com/1XqXK0E.png",
      },
      {
        title: "Jab",
        description: "Practica el golpe jab",
        duration: 180,
        image: "https://i.imgur.com/Z9q7YhP.png",
      },
      {
        title: "Descanso",
        description: "Respira y relaja",
        duration: 60,
        image: "https://i.imgur.com/FK8V841.png",
      },
      {
        title: "Combinaciones simples",
        description: "Jab + Cross",
        duration: 180,
        image: "https://i.imgur.com/8Km9tLL.png",
      },
    ],
  },

  {
    title: "Entrenamiento intermedio",
    description: "Mayor intensidad y combinaciones",
    level: "intermedio",
    estimatedMinutes: 15,
    createdBy: "system",
    rounds: [
      {
        title: "Calentamiento",
        description: "Saltos y movilidad",
        duration: 180,
        image: "https://i.imgur.com/1XqXK0E.png",
      },
      {
        title: "Combinaciones",
        description: "Jab + Cross + Hook",
        duration: 240,
        image: "https://i.imgur.com/8Km9tLL.png",
      },
      {
        title: "Descanso",
        description: "Respira",
        duration: 90,
        image: "https://i.imgur.com/FK8V841.png",
      },
      {
        title: "Defensa",
        description: "Esquivas y bloqueos",
        duration: 240,
        image: "https://i.imgur.com/Y3K9p8G.png",
      },
    ],
  },

  {
    title: "Entrenamiento experto",
    description: "Alta intensidad y resistencia",
    level: "experto",
    estimatedMinutes: 20,
    createdBy: "system",
    rounds: [
      {
        title: "Calentamiento intenso",
        description: "Cuerda + movilidad",
        duration: 240,
        image: "https://i.imgur.com/1XqXK0E.png",
      },
      {
        title: "Combinaciones rápidas",
        description: "Velocidad máxima",
        duration: 300,
        image: "https://i.imgur.com/Z9q7YhP.png",
      },
      {
        title: "Descanso corto",
        description: "Recuperación rápida",
        duration: 60,
        image: "https://i.imgur.com/FK8V841.png",
      },
      {
        title: "Resistencia",
        description: "Golpes continuos",
        duration: 300,
        image: "https://i.imgur.com/8Km9tLL.png",
      },
    ],
  },

  {
    title: "HIIT Boxeo",
    description: "Intervalos de alta intensidad",
    level: "intermedio",
    estimatedMinutes: 12,
    createdBy: "system",
    rounds: [
      {
        title: "Sprint golpes",
        description: "Golpea lo más rápido posible",
        duration: 60,
        image: "https://i.imgur.com/Z9q7YhP.png",
      },
      {
        title: "Descanso",
        description: "Recupera",
        duration: 30,
        image: "https://i.imgur.com/FK8V841.png",
      },
      {
        title: "Sprint golpes",
        description: "Máxima intensidad",
        duration: 60,
        image: "https://i.imgur.com/Z9q7YhP.png",
      },
    ],
  },

  {
    title: "Cardio boxing",
    description: "Entrenamiento para quemar calorías",
    level: "basico",
    estimatedMinutes: 18,
    createdBy: "system",
    rounds: [
      {
        title: "Jumping jacks",
        description: "Activa el cuerpo",
        duration: 120,
        image: "https://i.imgur.com/Y3K9p8G.png",
      },
      {
        title: "Shadowboxing",
        description: "Movimiento continuo",
        duration: 300,
        image: "https://i.imgur.com/8Km9tLL.png",
      },
      {
        title: "Descanso",
        description: "Respira",
        duration: 90,
        image: "https://i.imgur.com/FK8V841.png",
      },
    ],
  },
];

export async function seedWorkouts() {
  try {
    for (const workout of workouts) {
      await addDoc(collection(db, "workouts"), workout);
    }
    console.log("Workouts subidos correctamente");
  } catch (error) {
    console.log("Error subiendo workouts:", error);
  }
}
seedWorkouts();