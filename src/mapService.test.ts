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
    latitude: "",
    longitude: "",
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
  },
  timestamp: 0,
};

const REQUEST_ERROR = {
  status: "UNKNOWN_ERROR",
  message: "Whoopsies",
};

const TEXT_SEARCH_URL_QUERY = `/textsearch?key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants&query=vegan&location=51.1%2C+45.3`;
const TEXT_SEARCH_URL = `/textsearch?key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants&query=&location=51.1%2C+45.3`;
const TEXT_SEARCH_URL_BAD = `textsearch?key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants&query=&location=%2C+`;

describe("MapService", () => {
  beforeEach(() => {
    fetchMock.get(TEXT_SEARCH_URL_QUERY, PLACES_RESPONSE);
    fetchMock.get(TEXT_SEARCH_URL, PLACES_RESPONSE);
    fetchMock.get(TEXT_SEARCH_URL_BAD, { throws: REQUEST_ERROR });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  test("fetchTextSearch should reject with the correct error object", async () => {
    expect.hasAssertions();
    const service = new MapService();

    await expect(service.fetchTextSearch(POSITION_ERROR)).rejects.toStrictEqual(
      REQUEST_ERROR
    );
  });

  test("fetchTextSearch should send a GET request with the correct url", async () => {
    expect.hasAssertions();
    const service = new MapService();
    global.navigator.geolocation = getMockGeolocation();

    await service.fetchTextSearch(POSITION);
    expect(fetchMock).toHaveFetched(TEXT_SEARCH_URL, "get");
  });

  test("fetchTextSearch should send a GET request with the correct url when it has a query query param", async () => {
    expect.hasAssertions();
    const service = new MapService();
    global.navigator.geolocation = getMockGeolocation();

    await service.fetchTextSearch(POSITION, "vegan");
    expect(fetchMock).toHaveFetched(TEXT_SEARCH_URL_QUERY, "get");
  });
});

//////////////////////////////////////////////////////////////////////////////////////////
// Utilities

function getMockGeolocation() {
  return {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      Promise.resolve(
        success({
          POSITION,
        })
      )
    ),
  };
}
