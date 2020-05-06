import { MapService } from "./mapService";
import fetchMock from "fetch-mock-jest";
import { PLACES_RESPONSE } from "./__fixtures__";

const POSITION = {
  coords: {
    latitude: 51.1,
    longitude: 45.3,
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
  },
  timestamp: 0,
};
const POSITION_ERROR = {
  coords: {
    latitude: Infinity,
    longitude: Infinity,
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
  },
  timestamp: 0,
};
const UNKNOWN_REQUEST_ERROR = {
  status: "UNKNOWN_ERROR",
  message: "Whoopsies",
};
const USER_DENIED_GEOLOCATION_ERROR = {
  code: 1,
  message: "User denied geolocation prompt",
};
const TEXT_SEARCH_URL_QUERY = `/textsearch?key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants&query=vegan&location=51.1%2C+45.3`;
const TEXT_SEARCH_URL = `/textsearch?key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants&query=&location=51.1%2C+45.3`;
const TEXT_SEARCH_URL_BAD = `/textsearch?key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants&query=&location=Infinity%2C+Infinity`;

describe("MapService", () => {
  describe("fetchTextSearch", () => {
    beforeEach(() => {
      fetchMock.get(TEXT_SEARCH_URL_QUERY, PLACES_RESPONSE);
      fetchMock.get(TEXT_SEARCH_URL, PLACES_RESPONSE);
      fetchMock.get(TEXT_SEARCH_URL_BAD, { throws: UNKNOWN_REQUEST_ERROR });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    test("fetchTextSearch should reject with the correct error object", async () => {
      expect.hasAssertions();
      const service = new MapService();

      await expect(
        service.fetchTextSearch(POSITION_ERROR)
      ).rejects.toStrictEqual(UNKNOWN_REQUEST_ERROR);
    });

    test("fetchTextSearch should send a GET request with the correct url", async () => {
      expect.hasAssertions();
      const service = new MapService();

      await service.fetchTextSearch(POSITION);
      expect(fetchMock).toHaveFetched(TEXT_SEARCH_URL, "get");
    });

    test("fetchTextSearch should send a GET request with the correct url when it has a query query param", async () => {
      expect.hasAssertions();
      const service = new MapService();

      await service.fetchTextSearch(POSITION, "vegan");
      expect(fetchMock).toHaveFetched(TEXT_SEARCH_URL_QUERY, "get");
    });
  });

  describe("fetchPosition", () => {
    test("fetchPosition should resolve with the correct geolocation object", async () => {
      expect.hasAssertions();
      const service = new MapService();
      global.navigator.geolocation = getMockGeolocation();
      const actual = await service.fetchPosition();

      expect(actual).toStrictEqual(POSITION);
    });

    test("fetchPosition should reject with the correct error object", async () => {
      expect.hasAssertions();
      const service = new MapService();
      global.navigator.geolocation = undefined;

      await expect(service.fetchPosition()).rejects.toStrictEqual(
        USER_DENIED_GEOLOCATION_ERROR
      );
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////
// Utilities

function getMockGeolocation() {
  return {
    getCurrentPosition: jest
      .fn()
      .mockImplementationOnce((success) => Promise.resolve(success(POSITION))),
  };
}
