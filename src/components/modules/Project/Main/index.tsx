import React from "react";

import Banner from "@components/modules/Project/Banner";
import Projects from "@components/modules/Project/Projects";
import MemberShowcase from "@components/modules/Project/MemberShowcase";

const Main = ({ data }: any) => {
  return (
    <>
      <Banner></Banner>
      <Projects data={data}></Projects>
      <MemberShowcase />
    </>
  );
};

export default Main;
