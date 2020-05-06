import React from "react";
import { GeoService } from "./geoService";
import { Action, ActionType, Status } from "./types";

const service = new GeoService();

type Props = {
  children: (props: {
    data: any;
    status: Status;
    sendSearch: (value: string) => void;
  }) => React.ReactNode;
};

type State = {
  status: Status;
  data: any; // TODO should be PlaceResult[] or error object
};

export const actionMachine = async function (
  status: Status,
  action: Action,
  instance: GeoServiceContainer | any // TODO: any is for test
) {
  switch (status) {
    case Status.IDLE:
      switch (action.type) {
        case ActionType.SUCCESS:
          instance.setState({
            data: action.payload,
          });
          break;
      }
      break;
    case Status.WAITING:
      switch (action.type) {
        case ActionType.SUBMIT:
          // Example of how you can enforce behavior in the machine, ie prevent sending
          // repeating transaction scripts
          if (instance.state.status === Status.WAITING) {
            return;
          }

          instance.setState({
            status: Status.WAITING,
          });

          try {
            const position = await service.fetchPosition();
            const places = await service.fetchTextSearch(
              position,
              action.payload
            );
            instance.dispatch(Status.IDLE, {
              type: ActionType.SUCCESS,
              payload: places,
            });
          } catch (e) {
            instance.dispatch(Status.ERROR, {
              type: ActionType.ERROR,
              payload: e,
            });
          }

          break;
      }
      break;
    case Status.ERROR:
      instance.setState({
        status: Status.ERROR,
        data: action.payload,
      });
      break;
    default:
      throw Error(
        "Something has gone horribly wrong and we've allowed our users to violate our laws of physics"
      );
  }
};

export class GeoServiceContainer extends React.Component<Props, State> {
  state = {
    data: [],
    status: Status.IDLE,
  };

  async componentDidMount() {
    this.dispatch(Status.WAITING, { type: ActionType.SUBMIT, payload: "" });
  }

  async dispatch(status: Status, action: Action) {
    await actionMachine(status, action, this);
  }

  handleSendSearch(value: string) {
    this.dispatch(Status.WAITING, { type: ActionType.SUBMIT, payload: value });
  }

  render() {
    const { data } = this.state;

    return this.props.children({
      data,
      sendSearch: this.handleSendSearch.bind(this),
      status: this.state.status,
    });
  }
}
