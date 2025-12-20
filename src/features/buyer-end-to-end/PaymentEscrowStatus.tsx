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
      <div className="w-full min-h-screen bg-gray-50 p-3 md:p-4 lg:p-6 text-[#020617]">
        {/* Improved Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Payment Secured via Escrow
              </h1>
              <InfoCircleOutlined className="text-gray-400 text-base md:text-lg lg:text-xl" />
            </div>
            <div className="text-xs md:text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border inline-block">
              Secure Transaction ID:{" "}
              <span className="font-semibold text-blue-600">#ESC-88492</span>
            </div>
          </div>
          <Divider className="my-0 border-gray-300" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 px-0 md:px-2 lg:px-4 xl:px-20">
          {/* Left Column - 8 columns on desktop */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Transaction Summary Card */}
              <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xs md:text-sm font-semibold mb-3 md:mb-4 text-gray-500 uppercase tracking-wider">
                  Transaction summary
                </h3>
                <div className="space-y-2 md:space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Item</span>
                    <span className="font-medium text-gray-900 text-right">
                      iPhone 14 Pro Max
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium text-gray-900">$999.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Escrow Fee (2.5%)</span>
                    <span className="font-medium text-gray-900">$24.99</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-blue-600 text-lg md:text-xl">
                      $1,024.98
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-gray-600">Status</span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase border border-blue-100">
                      Locked
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Review Recap */}
              <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xs md:text-sm font-semibold mb-3 md:mb-4 text-gray-500 uppercase tracking-wider">
                  Media Review Recap
                </h3>
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-[10px] md:text-xs text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Photo {i}
                    </div>
                  ))}
                  <div className="aspect-square bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer">
                    <PlayCircleOutlined className="text-base md:text-lg" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] md:text-xs text-gray-500 italic">
                    Reviewed: Oct 13, 2025 @ 2:30 PM
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white">
                      ✓
                    </div>
                    <span className="text-[10px] md:text-xs font-medium text-green-600">
                      All media verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Track your Order Section */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs md:text-sm font-semibold mb-6 md:mb-8 text-gray-500 uppercase tracking-wider">
                Track your Order
              </h3>
              <div className="px-0 md:px-4 lg:px-10 overflow-x-auto">
                <div className="min-w-[600px] md:min-w-0">
                  <Steps
                    size="small"
                    current={0}
                    items={[
                      {
                        title: (
                          <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-gray-900">
                              Payment Secured
                            </span>
                            <span className="text-[8px] md:text-[10px] text-gray-400">
                              Payment Held in Escrow
                            </span>
                          </div>
                        ),
                      },
                      {
                        title: (
                          <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-gray-900">
                              Seller Notified
                            </span>
                            <span className="text-[8px] md:text-[10px] text-gray-400">
                              Awaiting Shipment
                            </span>
                          </div>
                        ),
                      },
                      {
                        title: (
                          <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-gray-900">
                              Item Delivered
                            </span>
                            <span className="text-[8px] md:text-[10px] text-gray-400">
                              Detailed Review
                            </span>
                          </div>
                        ),
                      },
                      {
                        title: (
                          <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-gray-900">
                              Payment Released
                            </span>
                            <span className="text-[8px] md:text-[10px] text-gray-400">
                              Transaction Complete
                            </span>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 4 columns on desktop */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            {/* Buyer Details Card - Improved Design */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs md:text-sm font-semibold mb-4 md:mb-5 text-gray-500 uppercase tracking-wider">
                Buyer Details
              </h3>

              {/* Seller Profile Section */}
              <div className="mb-5 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                    <UserOutlined className="text-lg md:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm md:text-base text-gray-900 truncate">
                      Seller Name
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      seller@email.com
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        Trust Score:
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        98/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps Section - Improved */}
              <div className="mb-5 md:mb-6">
                <h3 className="text-xs md:text-sm font-semibold mb-3 md:mb-4 text-gray-500 uppercase tracking-wider">
                  Next Steps
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        Coordinate Pick up / Delivery
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Contact seller for logistics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        Inspect Item when Received
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Verify condition matches description
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        Release Payment
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Confirm satisfaction to release funds
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  block
                  type="primary"
                  size="large"
                  className="bg-[#9CA3AF] 600 hover:[#374151] border-none h-12 font-bold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => setShowVerificationModal(true)}
                >
                  Release Payment
                </Button>
                <Button
                  block
                  variant="outlined"
                  size="large"
                  className="h-12 font-bold border-[#374151] text-sm md:text-base hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                  onClick={() => setShowDisputeModal(true)}
                >
                  Open Dispute
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: Enter Verification Code */}
        <Modal
          title={
            <div className="text-center font-bold text-base md:text-lg pt-4">
              Enter Verification Code
            </div>
          }
          open={showVerificationModal}
          onCancel={() => setShowVerificationModal(false)}
          centered
          footer={null}
          width={400}
          className="responsive-modal"
        >
          <div className="text-center pb-4 md:pb-6">
            <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 px-4">
              A 6-digit Code has been sent to your phone number ending in{" "}
              <span className="font-bold text-gray-800">****3474</span>
            </p>
            <div className="flex justify-center gap-2 mb-6 md:mb-8 px-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                //   maxLength="1"
                  className="w-10 h-12 md:w-12 md:h-14 border border-gray-300 rounded-lg text-center font-bold text-lg md:text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 px-2 md:px-4">
              <Button
                block
                size="large"
                className="rounded-lg font-bold border-gray-300 h-12"
                onClick={() => setShowVerificationModal(false)}
              >
                Cancel
              </Button>
              <Button
                block
                type="primary"
                size="large"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none rounded-lg font-bold h-12"
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>

        {/* MODAL: Open Dispute */}
        <Modal
          title={
            <div className="font-bold text-lg md:text-xl pt-2">
              Open Dispute
            </div>
          }
          open={showDisputeModal}
          onCancel={() => setShowDisputeModal(false)}
          centered
          footer={null}
          width={550}
          className="responsive-modal"
        >
          <div className="space-y-4 md:space-y-6 py-2">
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Please provide details about the issue with this transaction. Our
              dispute team will review and respond within 24 hours.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-3">
                Transaction Info
              </h4>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-bold text-gray-900">
                    iPhone 14 Pro Max
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verification ID:</span>
                  <span className="font-bold text-blue-600 uppercase">
                    #VN-88492
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-gray-900 text-lg">
                    $1024.98
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold mb-2 uppercase text-gray-600">
                Dispute Reason
              </label>
              <Select
                placeholder="Select Reason"
                size="large"
                className="w-full rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold mb-2 uppercase text-gray-600">
                Describe the details
              </label>
              <TextArea
                rows={4}
                placeholder="e.g. The received item differs from the product description and verification video and is missing accessories"
                className="rounded-lg text-sm py-3 border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold mb-2 uppercase text-gray-600">
                Upload Evidence{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <Upload.Dragger className="border-dashed h-32 text-gray-400 rounded-lg hover:border-blue-400 transition-colors">
                <div className="py-4">
                  <CloudUploadOutlined className="text-2xl mb-2" />
                  <p className="text-xs md:text-sm">
                    Click or drag files to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, MP4 up to 10MB
                  </p>
                </div>
              </Upload.Dragger>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-400 flex-shrink-0 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <CameraOutlined />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                block
                size="large"
                className="rounded-lg font-bold border-gray-300 h-12"
                onClick={() => setShowDisputeModal(false)}
              >
                Cancel
              </Button>
              <Button
                block
                type="primary"
                size="large"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border-none rounded-lg font-bold h-12"
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
