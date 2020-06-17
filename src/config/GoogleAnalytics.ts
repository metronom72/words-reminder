import ReactGA from "react-ga";
import { GAActions } from "./Constants";

export const init = () => {
  ReactGA.initialize("UA-169678562-1", { debug: true });
  sendEvent(GAActions.COLD_START);
};

export const sendEvent = (action: GAActions, payload?: any) => {
  ReactGA.event({
    category: "quiz",
    action: action,
    value: payload,
  });
};
