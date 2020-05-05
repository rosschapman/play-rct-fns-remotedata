import { StoreService } from "./storeService";

type PlacesResult = google.maps.places.PlaceResult[];
type PlacesResponse = {
  html_attributions: [];
  results: PlacesResult;
  status: google.maps.places.PlacesServiceStatus;
};

export class MapService {
  cache = new StoreService({ store: localStorage });

  private readonly urls = {
    nearby: `/nearbysearch/`,
    textSearch: `/textsearch/`,
  };

  private readonly defaultSearchParams = {
    key: process.env.REACT_APP_PLACES_SECRET as string,
    radius: "50",
    type: "restaurants",
    query: "",
  };

  private buildUrl({
    urlStr,
    position,
    textSearch = "",
  }: {
    urlStr: string;
    position: Position;
    textSearch?: string;
  }) {
    const location = `${position.coords.latitude}, ${position.coords.longitude}` as string;

    const searchParams = new URLSearchParams({
      query: textSearch,
      location,
      ...this.defaultSearchParams,
    }).toString();

    return urlStr + searchParams;
  }

  private setCacheItem(key: string, value: string | { [k: string]: any }) {
    this.cache.set(key, value);
  }

  async fetchPosition(): Promise<Position> {
    const positionCache = this.cache.get("position") as Position;

    if (positionCache) {
      return Promise.resolve(positionCache);
    }

    if (!navigator.geolocation) {
      return Promise.reject({
        code: 1,
        message: "User denied geolocation prompt",
      });
    } else {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  }

  private transformResponse(response: PlacesResponse) {
    return response.results;
  }

  async fetchTextSearch(
    position: Position,
    placeText: string
  ): Promise<PlacesResult> {
    const url = await this.buildUrl({
      urlStr: this.urls.textSearch,
      textSearch: placeText,
      position,
    });
    const cacheKey = `places.${url}`;
    const cached = this.cache.get(cacheKey) as PlacesResult;

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK") {
        throw data;
      }

      const result = this.transformResponse(data);
      this.setCacheItem(`places.${url}`, result);
      return result;
    } catch (e) {
      // Rethrow to consumer to maintain a consistent try/catch patterning
      throw e;
    }
  }
}
