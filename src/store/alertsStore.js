import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const defaultState = {
  alertMessage: {
    severity: "error",
    title: "",
    description: "",
    showAlert: false,
  },
};

export const useAlertsStore = create()(
  devtools(
    immer((set) => ({
      ...defaultState,

      setAlertMessage: (alertMessage) =>
        set((state) => {
          state.alertMessage.showAlert = true;
          state.alertMessage.severity = alertMessage.severity;
          state.alertMessage.title = alertMessage.title;
          state.alertMessage.description = alertMessage.description;
        }),
    }))
  )
);
