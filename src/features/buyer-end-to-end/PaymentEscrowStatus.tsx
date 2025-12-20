"use client";

import React, { useState } from "react";
import {
  InfoCircleOutlined,
  LeftOutlined,
  CameraOutlined,
  PlayCircleOutlined,
  CloudUploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Modal, Button, Steps, Input, Select, Upload, Divider } from "antd";
import { Header } from "./Header";
import VerificationLayout from "./layout";

const { TextArea } = Input;

const PaymentEscrowStatus = () => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Handle OTP Input focus shift
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <VerificationLayout>
      <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:px-10 text-[#020617]">
        {/* Main Title */}
        <div className="div">
          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-lg font-bold">Payment Secured via Escrow</h2>
            <InfoCircleOutlined className="text-gray-400 text-xs" />
          </div>
          <Divider />
        </div>

        <div className=" grid-cols-1 lg:grid-cols-12 gap-6 lg:px-20 px-5">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Summary Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">
                  Transaction summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Item</span>
                    <span className="font-medium text-right">
                      iPhone 14 Pro Max
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-medium">$999.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Escrow Fee (2.5%)</span>
                    <span className="font-medium">$24.99</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">$1,024.98</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Status</span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Locked
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Review Recap */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">
                  Media Review Recap
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400"
                    >
                      Photo {i}
                    </div>
                  ))}
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-blue-600">
                    <PlayCircleOutlined className="text-xl" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 italic">
                  Reviewed: Oct 13, 2025 @ 2:30 PM
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white">
                    ✓
                  </div>
                  <span className="text-[10px] font-medium">
                    All media verified
                  </span>
                </div>
              </div>
            </div>

            {/* Track your Order Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold mb-8 text-gray-500 uppercase tracking-wider">
                Track your Order
              </h3>
              <div className="px-2 md:px-10">
                <Steps
                  size="small"
                  current={0}
                  items={[
                    {
                      title: (
                        <span className="text-[10px] font-bold">
                          Payment Secured
                        </span>
                      ),
                      description: (
                        <span className="text-[8px] text-gray-400">
                          Payment Held in Escrow
                        </span>
                      ),
                    },
                    {
                      title: (
                        <span className="text-[10px] font-bold">
                          Seller Notified
                        </span>
                      ),
                      description: (
                        <span className="text-[8px] text-gray-400">
                          Awaiting Shipment
                        </span>
                      ),
                    },
                    {
                      title: (
                        <span className="text-[10px] font-bold">
                          Item Delivered
                        </span>
                      ),
                      description: (
                        <span className="text-[8px] text-gray-400">
                          Detailed Review
                        </span>
                      ),
                    },
                    {
                      title: (
                        <span className="text-[10px] font-bold">
                          Payment Released
                        </span>
                      ),
                      description: (
                        <span className="text-[8px] text-gray-400">
                          Transaction Complete
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">
                  Buyer Details
                </h3>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 mb- border rounded-lg border-[#E5E7EB] px-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                      <UserOutlined />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Seller Name</p>
                      <p className="text-xs text-gray-400">Seller@email.com</p>
                    </div>
                  </div>

                  <div className="border px-2 rounded-lg border-[#E5E7EB]">
                    <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">
                      Next Steps
                    </h3>
                    <ul className="text-sm space-y-3 text-[#475569] mb-8">
                      <li className="flex gap-2 ">
                        <span className="text-[#475569] font-bold text-sm">
                          •
                        </span>{" "}
                        Coordinate Pick up / delivery with Seller
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#475569] font-bold text-sm">
                          •
                        </span>{" "}
                        Inspect Item when Received
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#475569] font-bold text-sm">
                          •
                        </span>{" "}
                        Release Payment upon satisfaction
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <Button
                    block
                    type="primary"
                    size="large"
                    className="bg-[#9CA3AF] hover:!bg-[#2d3b4f] h-12 font-bold text-sm"
                    onClick={() => setShowVerificationModal(true)}
                  >
                    Release Payment
                  </Button>
                  <Button
                    block
                    variant="outlined"
                    size="large"
                    className="h-12 font-bold border-gray-300 text-sm"
                    onClick={() => setShowDisputeModal(true)}
                  >
                    Open Dispute
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: Enter Verification Code */}
        <Modal
          title={
            <div className="text-center font-bold text-lg pt-4">
              Enter Verification Code
            </div>
          }
          open={showVerificationModal}
          onCancel={() => setShowVerificationModal(false)}
          centered
          footer={null}
          width={400}
        >
          <div className="text-center pb-6">
            <p className="text-xs text-gray-500 mb-8 px-4">
              A 6-digit Code has been sent to your phone number ending in{" "}
              <span className="font-bold text-gray-800">****3474</span>
            </p>
            <div className="flex justify-center gap-2 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  // maxLength="1"
                  className="w-10 h-12 border rounded-lg text-center font-bold text-lg focus:border-blue-500 focus:outline-none"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                />
              ))}
            </div>
            <div className="flex gap-3 px-2">
              <Button
                block
                size="large"
                className="rounded-lg font-bold"
                onClick={() => setShowVerificationModal(false)}
              >
                Cancel
              </Button>
              <Button
                block
                type="primary"
                size="large"
                className="bg-[#1F2937] rounded-lg font-bold"
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>

        {/* MODAL: Open Dispute */}
        <Modal
          title={<div className="font-bold text-xl pt-2">Open Dispute</div>}
          open={showDisputeModal}
          onCancel={() => setShowDisputeModal(false)}
          centered
          footer={null}
          width={550}
        >
          <div className="space-y-6 py-2">
            <p className="text-xs text-gray-400 leading-relaxed">
              Please provide details about the issue with this transaction. Our
              dispute team will review and respond within 24 hours.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3">
                Transaction Info
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Item:</span>
                  <span className="font-bold">iPhone 14 Pro Max</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification ID:</span>
                  <span className="font-bold text-blue-600 uppercase">
                    #VN-88492
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Amount:</span>
                  <span className="font-bold">$1024.98</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase text-gray-500">
                Dispute Reason
              </label>
              <Select
                placeholder="Select Reason"
                size="large"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase text-gray-500">
                Describe the details in detail
              </label>
              <TextArea
                rows={4}
                placeholder="e.g. The received item differs from the the product description and verification video and is missing accessories"
                className="text-xs py-3"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase text-gray-500">
                Upload Evidence{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <Button
                icon={<CloudUploadOutlined />}
                block
                className="border-dashed h-12 text-gray-400 text-xs"
              >
                Attach photos or videos
              </Button>
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400"
                  >
                    <CameraOutlined />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                block
                size="large"
                className="rounded-lg font-bold"
                onClick={() => setShowDisputeModal(false)}
              >
                Cancel
              </Button>
              <Button
                block
                type="primary"
                size="large"
                className="bg-[#1F2937] rounded-lg font-bold"
              >
                Submit Dispute
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </VerificationLayout>
  );
};

export default PaymentEscrowStatus;
