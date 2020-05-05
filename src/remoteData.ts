import React from "react";
export enum Status {
  IDLE = "idle",
  WAITING = "waiting",
  ERROR = "error",
}

type Props = {
  status: Status;
  data: any;
  idle: React.ReactNode;
  waiting: React.ReactNode;
  error: React.ReactNode;
};

export class RemoteDataContainer extends React.Component<Props> {
  getComponent() {
    switch (this.props.status) {
      case Status.IDLE:
        return this.props.idle;
      case Status.WAITING:
        return this.props.waiting;
      case Status.ERROR:
        return this.props.error;

      default:
        throw Error("If you are here, you are neverwhere.");
    }
  }

  render() {
    return this.getComponent();
  }
}
