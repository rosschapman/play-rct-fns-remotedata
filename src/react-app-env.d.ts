/// <reference types="react-scripts" />

// See: https://github.com/wheresrhys/fetch-mock-jest/issues/7#issuecomment-595663315
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

declare namespace NodeJS {
  interface Global {
    navigator: {
      geolocation: {
        getCurrentPosition: jest.Mock<any, any>;
      };
    };
  }
}
