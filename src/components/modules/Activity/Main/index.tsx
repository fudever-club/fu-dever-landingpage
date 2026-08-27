import React from "react";
import Banner from "@components/modules/Activity/Banner";
import Activities from "@components/modules/Activity/Activities";
import MemphisConfettiBackground from "@components/ui/MemphisConfettiBackground";

const Main = ({ data, albums }: any) => {
  return (
    <>
      <MemphisConfettiBackground opacity={0.75} className="pt-2">
        <Banner />
      </MemphisConfettiBackground>
      <Activities data={data} albums={albums} />
    </>
  );
};

export default Main;
