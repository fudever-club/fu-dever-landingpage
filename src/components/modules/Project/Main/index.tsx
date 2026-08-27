import React from "react";

import Banner from "@components/modules/Project/Banner";
import Projects from "@components/modules/Project/Projects";
import MemberShowcase from "@components/modules/Project/MemberShowcase";
import MemphisConfettiBackground from "@components/ui/MemphisConfettiBackground";
import DeverGridBackground from "@components/ui/DeverGridBackground";

const Main = ({ data }: any) => {
  return (
    <>
      <MemphisConfettiBackground opacity={0.8} className="pt-2">
        <Banner />
      </MemphisConfettiBackground>
      <DeverGridBackground variant="grid" gridSize={36}>
        <Projects data={data} />
      </DeverGridBackground>
      <MemberShowcase />
    </>
  );
};

export default Main;
