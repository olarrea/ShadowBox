import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function seedRounds() {
  try {
    const querySnapshot = await getDocs(collection(db, "workouts"));

    if (querySnapshot.empty) {
      console.log("No hay workouts");
      return;
    }

    const workoutDoc = querySnapshot.docs[0];

    await updateDoc(doc(db, "workouts", workoutDoc.id), {
      rounds: [
        {
          title: "Calentamiento",
          description:
            "Movilidad articular, pasos laterales y activación general antes del trabajo principal.",
          duration: 300,
          image: "warmup",
        },
        {
          title: "Shadowboxing",
          description:
            "Practica desplazamientos, guardia y combinaciones simples frente al espejo o al aire.",
          duration: 180,
          image: "shadowboxing",
        },
        {
          title: "Combinaciones",
          description:
            "Realiza secuencias de jab, cross y gancho manteniendo el ritmo y la técnica.",
          duration: 180,
          image: "combinations",
        },
        {
          title: "Resistencia",
          description:
            "Mantén movimiento continuo con golpes suaves y desplazamiento constante para trabajar el fondo físico.",
          duration: 180,
          image: "endurance",
        },
        {
          title: "Vuelta a la calma",
          description:
            "Respiración controlada, caminar suave y relajar hombros y brazos al final de la sesión.",
          duration: 300,
          image: "cooldown",
        },
      ],
    });

    console.log("Rounds añadidas correctamente");
  } catch (error) {
    console.log("ERROR seedRounds:", error);
  }
}

seedRounds();