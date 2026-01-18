"use client";

import React, { useState } from "react";
import {
  InfoCircleOutlined,
  CameraOutlined,
  PlayCircleOutlined,
  CloudUploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Modal, Button, Steps, Input, Select, Upload } from "antd";

const { TextArea } = Input;

interface PaymentEscrowStatusContentProps {
  onComplete: () => void;
  onBack?: () => void;
}

const PaymentEscrowStatusContent: React.FC<PaymentEscrowStatusContentProps> = ({ 
  onComplete, 
  onBack 
}) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-6 my-4">
        <div className="flex items-center gap-2 mb-3 mt-5">
          <h2 className="text-lg md:text-xl font-bold">Payment Secured via Escrow</h2>
          <InfoCircleOutlined className="text-gray-400 text-xs md:text-sm" />
        </div>
        <div className="border-t border-gray-300"></div>
      </div>

      {/* Main Content - Full width layout */}
      <div className="space-y-6 px-4 md:px-6 lg:px-10 xl:px-20">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Summary */}
          <div className="bg-white shadow-sm">
            <h3 className="text-sm font-bold mb-4 text-[#475569] uppercase tracking-wider">
              Transaction summary
            </h3>
            <div className="space-y-3 text-sm bg-[#F9FAFB] p-5 rounded-xl border border-[#E5E7EB] ">
              <div className="flex justify-between">
                <span className="text-sm text-[#475569]">Item</span>
                <span className="">iPhone 14 Pro Max</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span className="">$999.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#475569]">Escrow Fee (2.5%)</span>
                <span className="font">$24.99</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="text-sm text-[#475569]">Total</span>
                <span className="text-sm">$1,024.98</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Status</span>
                <span className="bg-blue-50  px-3 py-1 rounded-full text-sm uppercase">
                  Locked
                </span>
              </div>
            </div>
          </div>

          {/* Media Review Recap */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm mb-4 text-[#475569] font-bold uppercase tracking-wider">
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

        {/* Track your Order - Full width */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold mb-8 text-[#475569] uppercase tracking-wider">
            Track your Order
          </h3>
          <div className="px-2 md:px-6 lg:px-10">
            <Steps
              size="small"
              current={0}
              items={[
                {
                  title: (
                    <span className="text-[10px] md:text-xs font-bold">
                      Payment Secured
                    </span>
                  ),
                  description: (
                    <span className="text-[8px] md:text-[10px] text-gray-400">
                      Payment Held in Escrow
                    </span>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] md:text-xs font-bold">
                      Seller Notified
                    </span>
                  ),
                  description: (
                    <span className="text-[8px] md:text-[10px] text-gray-400">
                      Awaiting Shipment
                    </span>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] md:text-xs font-bold">
                      Item Delivered
                    </span>
                  ),
                  description: (
                    <span className="text-[8px] md:text-[10px] text-gray-400">
                      Detailed Review
                    </span>
                  ),
                },
                {
                  title: (
                    <span className="text-[10px] md:text-xs font-bold">
                      Payment Released
                    </span>
                  ),
                  description: (
                    <span className="text-[8px] md:text-[10px] text-gray-400">
                      Transaction Complete
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Buyer Details - Full width below Track Order */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold mb-4 text-[#475569] uppercase tracking-wider">
            Buyer Details
          </h3>
          
          {/* Content arranged horizontally on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Seller Info Card */}
            <div className="flex items-center gap-3 border rounded-lg border-[#E5E7EB] px-4 py-4 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">
                <UserOutlined className="text-lg" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm md:text-base text-gray-900">Seller Name</p>
                <p className="text-xs text-gray-500 mt-1">Seller@email.com</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Trust Score:</span>
                  <span className="text-xs font-semibold text-green-600">98/100</span>
                </div>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="lg:col-span-2 border rounded-lg border-[#E5E7EB] px-4 py-4 hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">
                Next Steps
              </h3>
              <ul className="text-sm space-y-3 text-[#475569]">
                <li className="flex items-start gap-3">
                  <span className="text-[#475569] font-bold text-sm mt-0.5">•</span>
                  <span className="flex-1">Coordinate Pick up / delivery with Seller</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#475569] font-bold text-sm mt-0.5">•</span>
                  <span className="flex-1">Inspect Item when Received</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#475569] font-bold text-sm mt-0.5">•</span>
                  <span className="flex-1">Release Payment upon satisfaction</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              block
              type="primary"
              size="large"
              className="bg-[#9CA3AF] hover:!bg-[#2d3b4f] h-12 font-bold text-sm md:text-base"
              onClick={() => setShowVerificationModal(true)}
            >
              Release Payment
            </Button>
            <Button
              block
              variant="outlined"
              size="large"
              className="h-12 font-bold border-gray-300 text-sm md:text-base hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
              onClick={() => setShowDisputeModal(true)}
            >
              Open Dispute
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
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
        className="responsive-modal"
      >
        <div className="text-center pb-6">
          <p className="text-xs md:text-sm text-gray-500 mb-8 px-4">
            A 6-digit Code has been sent to your phone number ending in{" "}
            <span className="font-bold text-gray-800">****3474</span>
          </p>
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-10 h-12 border border-gray-300 rounded-lg text-center font-bold text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                value={data}
                onChange={(e) => handleOtpChange(e.target as HTMLInputElement, index)}
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 px-2">
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
              className="bg-[#1F2937] border-none rounded-lg font-bold h-12"
              onClick={onComplete}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={<div className="font-bold text-xl pt-2">Open Dispute</div>}
        open={showDisputeModal}
        onCancel={() => setShowDisputeModal(false)}
        centered
        footer={null}
        width={550}
        className="responsive-modal"
      >
        <div className="space-y-6 py-2">
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
                <span className="font-bold text-gray-900">iPhone 14 Pro Max</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Verification ID:</span>
                <span className="font-bold text-blue-600 uppercase">
                  #VN-88492
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-900 text-lg">$1024.98</span>
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
                <p className="text-xs md:text-sm">Click or drag files to upload</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 up to 10MB</p>
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
              className="bg-[#1F2937] border-none rounded-lg font-bold h-12"
            >
              Submit Dispute
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentEscrowStatusContent;