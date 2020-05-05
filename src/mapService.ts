import { StoreService } from "./storeService";

type PlacesResponse = {
  html_attributions: [];
  results: google.maps.places.PlaceResult[];
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

  async fetchNearby(position: Position) {
    const nearbyPlacesCache = this.cache.get("nearbyPlaces");

    if (nearbyPlacesCache) {
      return nearbyPlacesCache;
    }

    const url = await this.buildUrl({
      urlStr: this.urls.nearby,
      position,
    });

    const response = (await fetch(url)) as Response & PlacesResponse;

    if (response.status === "OK") {
      const result = this.transformResponse(response);
      this.setCacheItem(`nearbyPlaces`, result);
      return result;
    } else {
      throw response.status;
    }
  }

  // async fetchTextSearch(
  //   position: Position,
  //   placeText: string
  // ): Promise<google.maps.places.PlaceResult[]> {
  //   const url = await this.buildUrl({
  //     urlStr: this.urls.textSearch,
  //     textSearch: placeText,
  //     position,
  //   });
  //   const cacheKey = `places.${url}`;
  //   const cached = this.cache.get(cacheKey) as google.maps.places.PlaceResult[];

  //   if (cached) {
  //     return cached;
  //   }

  //   const response = (await fetch(url)) as Response | PlacesResponse;

  //   if (response.status === "OK") {
  //     const result = this.transformResponse(response);
  //     this.setCacheItem(`places.${url}`, result);
  //     return result;
  //   } else {
  //     throw response.status;
  //   }
  // }
}
