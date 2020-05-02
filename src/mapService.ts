/*

need to turn on geolocation in browser
navigator.geolocation.getCurrentPosition((pos) => console.log(pos))

nearby: https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&name=<query>

requried params: key, location, radius


for markers?

export class Map extends React.Component {
  renderChildren() {
    const {children} = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    })
  }
  // ...
}

/** The position of the concerned device at a given time. The position, represented by a Coordinates object, comprehends the 2D position of the device, on a spheroid representing the Earth, but also its altitude and its speed. 
// interface Position {
//   readonly coords: Coordinates;
//   readonly timestamp: number;
// }

have an HOC component put geolocation on context on load

*/

const apiKey = process.env.PLACES_SECRET as string;

type PlacesParams = {
  type: string;
  apiKey: string;
  location: string;
  radius: string;
  query: string;
};

type DefaultPlacesParams = Omit<PlacesParams, "location">;

type PlacesResponse = {
  html_attributions: [];
  results: google.maps.places.PlaceResult[];
  status: google.maps.places.PlacesServiceStatus;
};

export class MapService {
  private readonly urls = {
    nearby: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`,
    textSearch: `https://maps.googleapis.com/maps/api/place/textsearch/json?`,
  };

  private readonly defaultSearchParams: DefaultPlacesParams = {
    apiKey,
    radius: "50",
    type: "restaurants",
  };

  private async buildUrl(
    urlStr: string,
    textSearch: string = ""
  ): Promise<string> {
    try {
      const position = await this.fetchPosition();
      const positionParamValue = `${position.coords.latitude},${position.coords.longitude}`;

      /*
        nearby: key, location, radius
        textsearch: key, location, radius, query
      */

      const searchParams = new URLSearchParams({
        query: textSearch,
        location: positionParamValue,
        ...this.defaultSearchParams,
      }).toString();

      return urlStr + searchParams;
    } catch (e) {
      // TODO
      throw e;
    }
  }

  private fetchPosition(): Promise<Position> {
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

  async fetchNearby() {
    const url = await this.buildUrl(this.urls.nearby);
    const response = (await fetch(url)) as Response | PlacesResponse;

    if (response.status === "OK") {
      return this.transformResponse(response);
    } else {
      throw response.status;
    }
  }

  async fetchTextSearch(
    placeText: PlacesParams["query"]
  ): Promise<google.maps.places.PlaceResult[]> {
    const url = await this.buildUrl(this.urls.textSearch, placeText);
    const response = (await fetch(url)) as Response | PlacesResponse;

    if (response.status === "OK") {
      return this.transformResponse(response);
    } else {
      throw response.status;
    }
  }
}
