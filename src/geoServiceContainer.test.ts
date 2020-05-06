import { actionMachine } from "./geoServiceContainer";
import { Action, ActionType, Status } from "./types";
import { GeoServiceContainer } from "./geoServiceContainer";

describe("actioMmachine", () => {
  test("will transition from WAITING to ERROR", async () => {
    const localMachine = actionMachine;
    const instance = new (class MockContainer {
      state = {
        status: "idle",
      };

      setState(newState: MockContainer["state"]) {
        this.state = newState;
      }

      async dispatch(status: Status, action: Action) {
        await localMachine(status, action, this);
      }
    })();

    await localMachine(
      Status.WAITING,
      { type: ActionType.SUBMIT, payload: "boop" },
      instance
    );

    const expected = {
      state: {
        data: {
          code: 1,
          message: "User denied geolocation prompt",
        },
        status: "error",
      },
    };

    expect(instance).toEqual(expected);
  });
});
