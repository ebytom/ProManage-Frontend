import { PlusIcon } from '@primer/octicons-react'
import { Button, message } from 'antd'
import React from 'react'
import WarrantyCard from '../WarrantyCard/WarrantyCard'

const Milestone = ({tasks}) => {

    const [messageApi, contextHolder] = message.useMessage();

    const toastMessage = (type, mssg) => {
        messageApi.open({
          type: type,
          content: mssg,
        });
      };

  return (
    <div className="w-100 mb-4">
                <div
                  className="p-3 d-flex justify-content-between align-items-center"
                  style={{
                    background: "#0562ff7d",
                    borderTopRightRadius: "12px",
                    borderTopLeftRadius: "12px",
                  }}
                >
                  <b>Design</b>
                  <Button
                    className="d-flex align-items-center"
                    style={{ background: "#00348a", height: "48px" }}
                  >
                    <PlusIcon fill="white" />
                    <span className="text-white">Add Task</span>
                  </Button>
                </div>
                <div
                  className="p-4 w-100"
                  style={{
                    background: "#75a8ff29",
                    borderBottomRightRadius: "12px",
                    borderBottomLeftRadius: "12px",
                  }}
                >
                  <div className="warranty-card-list">
                    {tasks?.map((task, index) => (
                      <WarrantyCard
                        warranty={task}
                        key={index}
                        toastMessage={toastMessage}
                      />
                    ))}
                  </div>
                </div>
              </div>
  )
}

export default Milestone