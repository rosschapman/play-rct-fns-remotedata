export enum Status {
  IDLE = "idle",
  WAITING = "waiting",
  ERROR = "error",
}

export enum ActionType {
  SUCCESS = "success",
  SUBMIT = "submit",
  ERROR = "error",
}

export type Action =
  | {
      type: ActionType.SUCCESS;
      payload: google.maps.places.PlaceResult[];
    }
  | {
      type: ActionType.SUBMIT;
      payload: string;
    }
  | {
      type: ActionType.ERROR;
      payload: any;
    };
