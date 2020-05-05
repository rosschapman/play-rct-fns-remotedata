import React from "react";
import "./App.css";
import { GeoServiceContainer } from "./geoServiceContainer";
import { RemoteDataContainer } from "./remoteData";

class PlaceInput extends React.Component<{
  sendInput: (value: string) => void;
  disabled?: boolean;
  error?: {};
}> {
  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const value = new FormData(target).get("search") as string;

    if (value) {
      this.props.sendInput(value);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input
          name="search"
          type="text"
          placeholder={"Search for a restaurant"}
          disabled={this.props.disabled}
        />
      </form>
    );
  }
}

function RenderIdle({
  sendSearch,
  data,
}: {
  sendSearch: (value: string) => void;
  data: any;
}) {
  return (
    <>
      <header>
        <PlaceInput sendInput={sendSearch} />
      </header>
      <nav>
        {data.map((el: any) => (
          <div>{el.id}</div>
        ))}
      </nav>
      <main>[MAP PLACEHOLDER]</main>
    </>
  );
}

function RenderWaiting({
  sendSearch,
}: {
  sendSearch: (value: string) => void;
}) {
  return (
    <>
      <header>
        <PlaceInput sendInput={sendSearch} disabled={true} />
      </header>
      <nav>Loading...</nav>
      <main>[MAP PLACEHOLDER]</main>
    </>
  );
}

function RenderError({
  sendSearch,
  data,
}: {
  sendSearch: (value: string) => void;
  data: any;
}) {
  return (
    <>
      <header>
        <PlaceInput sendInput={sendSearch} error={true} />
      </header>
      <nav>ERROR: {data.error_message}</nav>
      <main>[MAP PLACEHOLDER]</main>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <GeoServiceContainer>
        {({ data, status, sendSearch }) => (
          <RemoteDataContainer
            status={status}
            data={data}
            idle={<RenderIdle data={data} sendSearch={sendSearch} />}
            waiting={<RenderWaiting sendSearch={sendSearch} />}
            error={<RenderError data={data} sendSearch={sendSearch} />}
          />
        )}
      </GeoServiceContainer>
    </div>
  );
}

export default App;
