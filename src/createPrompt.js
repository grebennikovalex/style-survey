export const createPrompt = (values) => {
  let no = "--no";

  let noPlants = "";
  let plants = values.plant;

  let noColor = `${values.noColor} color,`;
  // let decoration = `${values.decor} decoration,`;
  let room = `${values.room},`;

  if (values.plant === "no") {
    noPlants = "plants";
    plants = "";
  }

  if (values.plant === "indifferent") {
    plants = "";
  }

  if (values.plant === "moss") {
    plants = "shallow phytowall light green moss";
  }

  if (values.noColor === "indifferent") {
    noColor = "";
  }

  // if (values.decor === "indifferent") {
  //   decoration = "";
  // }

  if (values.plant !== "no" && values.noColor === "indifferent") {
    no = "";
  }

  if (values.room === "indifferent") {
    room = "";
  }

  const prompt = `Interior of apartment in ${values.style} style, ${room} ${values.backgroundColor} walls, one ${values.yesColor} wall, ${values.floor} floors, ${plants} ${no} ${noColor} ${noPlants}`;
  // console.log(prompt);
  return prompt;
};
