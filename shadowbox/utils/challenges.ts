export type Challenge = {
  id: string;
  title: string;
  description: string;
  target: number;
};

export const CHALLENGES: Challenge[] = [

  {
    id: "sessions_5",
    title: "Primeras 5 sesiones",
    description: "Completa 5 entrenamientos.",
    target: 5,
  },

  {
    id: "sessions_10",
    title: "Constancia total",
    description: "Completa 10 entrenamientos.",
    target: 10,
  },

  {
    id: "sessions_25",
    title: "Disciplina de hierro",
    description: "Completa 25 entrenamientos.",
    target: 25,
  },

  {
    id: "sessions_50",
    title: "Leyenda del ring",
    description: "Completa 50 entrenamientos.",
    target: 50,
  },

  {
    id: "time_60",
    title: "1 hora entrenada",
    description: "Acumula 60 minutos de entrenamiento.",
    target: 60,
  },

  {
    id: "time_300",
    title: "Guerrero ShadowBox",
    description: "Acumula 300 minutos entrenando.",
    target: 300,
  },

  {
    id: "time_600",
    title: "Máquina de combate",
    description: "Acumula 600 minutos entrenando.",
    target: 600,
  },

  {
    id: "time_1200",
    title: "Bestia imparable",
    description: "Acumula 1200 minutos entrenando.",
    target: 1200,
  },

  {
    id: "level_5",
    title: "Nivel 5",
    description: "Alcanza el nivel 5.",
    target: 5,
  },

  {
    id: "level_10",
    title: "Nivel 10",
    description: "Alcanza el nivel 10.",
    target: 10,
  },
];

export function getCompletedChallenges(
  sessions: number,
  totalTime: number,
  level: number = 1
) {
  return CHALLENGES.filter((challenge) => {
    if (challenge.id.startsWith("sessions")) {
      return sessions >= challenge.target;
    }

    if (challenge.id.startsWith("time")) {
      return totalTime >= challenge.target;
    }

    if (challenge.id.startsWith("level")) {
      return level >= challenge.target;
    }

    return false;
  });
}