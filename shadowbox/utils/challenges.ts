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
];

export function getCompletedChallenges(
  sessions: number,
  totalTime: number
) {
  return CHALLENGES.filter((challenge) => {
    if (challenge.id.startsWith("sessions")) {
      return sessions >= challenge.target;
    }

    if (challenge.id.startsWith("time")) {
      return totalTime >= challenge.target;
    }

    return false;
  });
}