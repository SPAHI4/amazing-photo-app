interface ViewTransition {
  updateCallbackDone: Promise<void>;
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
}
interface Document {
  startViewTransition: (callback: () => void | Promise<void>) => ViewTransition;
  caretPositionFromPoint(x: number, y: number): any;
}
