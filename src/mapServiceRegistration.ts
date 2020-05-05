import React from "react";
import { MapService } from "./mapService";

/*
MapFetch
  componentDIdMount
    const places = fetchNearby()
  
    this.props.children({
      places, 
      fetchTextSearch
    })

<MapFetch>
    ({places, fetchTextSearch}) => (

      <Header>
        <input onSubmit
      </Header>
    )
</MapFetch>
*/

const service = new MapService();

type Props = {
  children: (props: {
    nearbyPlaces: google.maps.places.PlaceResult[];
  }) => React.ReactNode;
};
type State = {
  nearbyPlaces: google.maps.places.PlaceResult[];
};

export class MapServiceRegistration extends React.Component<Props, State> {
  state = {
    nearbyPlaces: [],
    places: [],
  };

  async componentDidMount() {
    const position = await service.fetchPosition();

    if ("code" in position) {
      throw position;
    }

    const nearbyPlaces = (await service.fetchNearby(
      position
    )) as google.maps.places.PlaceResult[];

    this.setState({
      nearbyPlaces,
    });
  }

  render() {
    const { nearbyPlaces } = this.state;

    return this.props.children({
      nearbyPlaces,
    });
  }
}
