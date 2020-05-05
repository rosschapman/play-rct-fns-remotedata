import { MapService } from "./mapService";
import fetchMock from "fetch-mock-jest";
import { PLACES_RESPONSE } from "./__fixtures__";

const COORDS = {
  latitude: 51.1,
  longitude: 45.3,
};
const NEARBY_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?query=&location=${COORDS.latitude}%2C${COORDS.longitude}&key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants`;
const TEXT_SEARCH_URL = `https://maps.googleapis.com/maps
/api/place/textsearch/json?query=vegan&location=${COORDS.latitude}%2C${COORDS.longitude}&key=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo
&radius=50&type=restaurants`;

describe("MapService", () => {
  beforeEach(() => {
    fetchMock.get(NEARBY_URL, PLACES_RESPONSE);
    fetchMock.get(TEXT_SEARCH_URL, PLACES_RESPONSE);
  });

  afterEach(() => {
    global.navigator.geolocation = undefined;
    fetchMock.restore();
  });

  test("fetchNearby should reject with the correct error object", async () => {
    expect.hasAssertions();
    const service = new MapService();

    await expect(service.fetchNearby()).rejects.toStrictEqual({
      code: 1,
      message: "User denied geolocation prompt",
    });
  });

  test("fetchNearby should send a GET request with the correct url", async () => {
    expect.hasAssertions();
    const service = new MapService();
    global.navigator.geolocation = getMockGeolocation();

    await service.fetchNearby();
    expect(fetchMock).toHaveFetched(NEARBY_URL, "get");
  });

  test("fetchTextSearch should reject with the correct error object", async () => {
    expect.hasAssertions();
    const service = new MapService();

    await expect(service.fetchTextSearch("vegan")).rejects.toStrictEqual({
      code: 1,
      message: "User denied geolocation prompt",
    });
  });

  test("fetchTextSearch should send a GET request with the correct url", async () => {
    expect.hasAssertions();
    const service = new MapService();
    global.navigator.geolocation = getMockGeolocation();

    await service.fetchTextSearch("vegan");
    expect(fetchMock).toHaveFetched(TEXT_SEARCH_URL, "get");
  });
});

//////////////////////////////////////////////////////////////////////////////////////////
// Utilities

function getMockGeolocation() {
  return {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      Promise.resolve(
        success({
          coords: COORDS,
        })
      )
    ),
  };
}
