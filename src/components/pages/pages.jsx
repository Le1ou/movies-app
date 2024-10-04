import React from "react";
import { Pagination } from "antd";

function Pages({ handlePage }) {
  return (
    <Pagination style={{ marginBottom: "40px" }} onChange={handlePage} defaultCurrent={1} total={500} align="center" />
  );
}

export default Pages;
