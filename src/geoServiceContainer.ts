import React from "react";
import { MapService } from "./mapService";
import { Status } from "./remoteData";

const service = new MapService();

type Props = {
  children: (props: {
    data: any;
    status: Status;
    sendSearch: (value: string) => void;
  }) => React.ReactNode;
};

type State = {
  status: Status;
  data: any;
};

enum ActionType {
  SUCCESS = "success",
  SUBMIT = "submit",
  ERROR = "error",
}

type Action =
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

export class GeoServiceContainer extends React.Component<Props, State> {
  state = {
    data: [],
    status: Status.IDLE,
  };

  async componentDidMount() {
    this.dispatch(Status.WAITING, { type: ActionType.SUBMIT, payload: "" });
  }

  async dispatch(status: Status, action: Action) {
    switch (status) {
      case Status.IDLE:
        switch (action.type) {
          case ActionType.SUCCESS:
            this.setState({
              data: action.payload,
            });
            break;
        }
        break;
      case Status.WAITING:
        switch (action.type) {
          case ActionType.SUBMIT:
            // Example intercept
            if (this.state.status === Status.WAITING) {
              return;
            }

            try {
              this.setState({
                status: Status.WAITING,
              });

              const position = await service.fetchPosition();
              const places = (await service.fetchTextSearch(
                position,
                action.payload
              )) as any;
              this.dispatch(Status.IDLE, {
                type: ActionType.SUCCESS,
                payload: places,
              });
            } catch (e) {
              this.dispatch(Status.ERROR, {
                type: ActionType.ERROR,
                payload: e,
              });
            }

            break;
        }
        break;
      case Status.ERROR:
        this.setState({
          status: Status.ERROR,
          data: action.payload,
        });
        break;
      default:
        throw Error(
          "Something has gone horribly wrong and we've allowed our users to violate our laws of physics"
        );
    }
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
