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
    places: google.maps.places.PlaceResult[];
  }) => React.ReactChildren;
};
export class MapFetch extends React.Component<
  Props,
  { places: google.maps.places.PlaceResult[] }
> {
  state = {
    places: [],
  };

  async componentDidMount() {
    const places = await service.fetchNearby();
    this.setState({
      places,
    });
  }

  render() {
    const { places } = this.state;

    return this.props.children({
      places,
    });
  }
}
