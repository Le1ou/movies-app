import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

const OnSpinner = () => (
  <div className="spinner-container">
    <Flex justify="center" align="middle">
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 68,
            }}
            spin
          />
        }
      />
    </Flex>
  </div>
);

export default OnSpinner;
