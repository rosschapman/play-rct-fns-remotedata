import { MapService } from "./mapService";
import fetchMock from "fetch-mock-jest";
import { FETCH_NEARBY_DATA } from "./__fixtures__";

const NEARBY_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?query=&location=51.1%2C45.3&apiKey=AIzaSyC9iT33vKT-pb7Lrok97X5aNPhGlY6iDBo&radius=50&type=restaurants";

fetchMock.get(NEARBY_URL, FETCH_NEARBY_DATA);

describe("MapService", () => {
  it("fetchNearby with geolocation missing", async () => {
    expect.hasAssertions();
    const service = new MapService();

    await expect(service.fetchNearby()).rejects.toStrictEqual({
      code: 1,
      message: "User denied geolocation prompt",
    });
  });

  it("fetchNearby calls api", async () => {
    expect.hasAssertions();
    const service = new MapService();
    global.navigator.geolocation = getMockGeolocation();

    await service.fetchNearby();
    console.log(fetchMock.mock.calls);
    expect(fetchMock).toHaveLastFetched(NEARBY_URL, "gets");
  });
});

function getMockGeolocation() {
  return {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: 51.1,
            longitude: 45.3,
          },
        })
      )
    ),
  };
}
