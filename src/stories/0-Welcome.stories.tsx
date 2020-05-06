import React from "react";
import { RemoteDataContainer } from "../remoteData";
import { Status } from "../types";

export default {
  title: "Remote Data Demo",
  component: RemoteDataContainer,
};

export const RemoteDataWaiting = () => (
  <RemoteDataContainer
    status={"waiting" as Status.WAITING}
    data={null}
    idle={"RENDER IDLE"}
    waiting={"RENDER WAITING"}
    error={"RENDER ERROR"}
  />
);

export const RemoteDataIdle = () => (
  <RemoteDataContainer
    status={"idle" as Status.IDLE}
    data={null}
    idle={"RENDER IDLE"}
    waiting={"RENDER WAITING"}
    error={"RENDER ERROR"}
  />
);

export const RemoteDataError = () => (
  <RemoteDataContainer
    status={"error" as Status.ERROR}
    data={null}
    idle={"RENDER IDLE"}
    waiting={"RENDER WAITING"}
    error={"RENDER ERROR"}
  />
);

RemoteDataWaiting.story = {
  name: "Waiting",
};

RemoteDataIdle.story = {
  name: "Idle",
};

RemoteDataError.story = {
  name: "Error",
};
