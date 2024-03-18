export const createPrompt = (values) => {
  let no = "--no";

  let noPlants = "";
  let plants = values.plant;

  let noColor = `${values.noColor} color,`;
  let decoration = `${values.decor} decoration,`;

  if (values.plant === "no") {
    noPlants = "plants";
    plants = "";
  }

  if (values.plant === "indifferent") {
    plants = "";
  }

  if (values.plant === "moss") {
    plants = "phytowall filled with light green shallow moss only";
  }

  if (values.noColor === "indifferent") {
    noColor = "";
  }

  if (values.decor === "indifferent") {
    decoration = "";
  }

  if (values.plant !== "no" && values.noColor === "indifferent") {
    no = "";
  }

  const prompt = `${values.room} in an apartment, ${values.style} style, ${values.backgroundColor} walls, ${decoration} one wall of ${values.yesColor} color, ${values.floor} floor, ${plants} ${no} ${noColor} ${noPlants}`;
  // console.log(prompt);
  return prompt;
};
