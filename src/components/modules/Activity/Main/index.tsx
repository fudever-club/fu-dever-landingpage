import React from "react";
import Banner from "@components/modules/Activity/Banner";
import Activities from "@components/modules/Activity/Activities";

const Main = ({ data, albums }: any) => {
  return (
    <>
      <Banner />
      <Activities data={data} albums={albums} />
    </>
  );
};

export default Main;
