import { vector2 } from "~state";
export interface LevelStat {
  times: number;
  best: string[];
  longest: {
    d: number;
    p: vector2;
    s: string;
  };
}

export interface IPersistant {
  levels: LevelStat[];
  best: number;
  times: number;
}

let emptyPersistant = {
  levels: [],
  best: 0,
  times: 0,
};

for (let i = 0; i < 9; i++) {
  emptyPersistant.levels.push({ times: 0, best: [], longest: { d: 0 } });
}

const loadStorage = () => {
  try {
    return (
      (JSON.parse(localStorage.getItem("bisgolf")) as IPersistant) ||
      (emptyPersistant as IPersistant)
    );
  } catch {
    return emptyPersistant as IPersistant;
  }
};
export const Persistant = loadStorage();
export const UpdatePersistant = () =>
  localStorage.setItem("bisgolf", JSON.stringify(Persistant));
