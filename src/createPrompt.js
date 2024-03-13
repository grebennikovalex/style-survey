export const createPrompt = (values) => {
  let noPlants = "";
  let plants = values.plant;

  if (values.plant === "no") {
    noPlants = "plants";
    plants = "";
  }

  if (values.plant === "indifferent") {
    plants = "";
  }

  const prompt = `${values.room} in ${values.style} style, ${values.yesColor} walls, ${values.floor} floor, ${plants} --no ${values.noColor} color, ${noPlants}`;

  return prompt;
};
