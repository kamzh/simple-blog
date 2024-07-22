import { Spin } from "antd";
import React from "react";

import "./Loading.css";

export default function Loading() {
  return <Spin size="large" className="spin" />;
}
