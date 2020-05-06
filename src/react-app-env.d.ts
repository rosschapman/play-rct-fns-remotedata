/// <reference types="react-scripts" />

/* We need to polyfill missing types for fetch-mock-jest. See discussion here:
 * https://github.com/wheresrhys/fetch-mock-jest/issues/7#issuecomment-595663315
 */
declare module "fetch-mock-jest" {
  import { FetchMockStatic, MockCall, FetchMockSandbox } from "fetch-mock";
  interface FetchMockJestSandbox {
    sandbox(): jest.MockInstance<Response, MockCall> & FetchMockSandbox;
  }

  type FetchMockJest = jest.MockInstance<Response, MockCall> &
    FetchMockJestSandbox &
    FetchMockStatic;

  const fetchMockJest: FetchMockJest;

  export default fetchMockJest;
}
declare namespace jest {
  import { InspectionFilter, InspectionOptions } from "fetch-mock";

  interface Matchers<R, T> {
    toHaveFetched(filter?: InspectionFilter, options?: InspectionOptions): R;
    toHaveLastFetched(
      filter?: InspectionFilter,
      options?: InspectionOptions
    ): R;
  }
}
// END fetch-mock-jest types

declare namespace NodeJS {
  interface Global {
    navigator: {
      geolocation:
        | {
            getCurrentPosition: jest.Mock<any, any>;
          }
        | undefined;
    };
  }
}
