import React from "react";
import Layout from "./Layout/Layout";
import Button from "./ui_elements/Button/Button";
import Dropdown from "./ui_elements/Dropdown/Dropdown";

const rooms = [
  { value: "living room", label: "Гостиная" },
  { value: "bedroom", label: "Спальня" },
  { value: "kitchen", label: "Кухня" },
];

const styles = [
  { value: "classical", label: "Классический" },
  { value: "modern", label: "Современный" },
  { value: "Art Deco", label: "Ар-деко" },
];

export default function StyleSurvey() {
  return (
    <Layout>
      <p style={{ textAlign: "center" }}>Привет, смотри... Я развернул проект на Реакте и скоро начну писать</p>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
        <Dropdown options={rooms} />
        <Dropdown options={styles} />
      </div>

      <Button disabled={false} type="secondary" />
    </Layout>
  );
}
