"use client";

import React, { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Image from "next/image";
// 1. Import Ant Design components
import { Modal, Input, Select, Checkbox, Button } from "antd";

const { TextArea } = Input;

const VerificationMedia = () => {
  const [showPaymentNotice, setShowPaymentNotice] = useState(false);
  const [showBuyerInfo, setShowBuyerInfo] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Dummy handler for form submissions
  const handleBuyerInfoSubmit = () => {
    console.log("Submitting Buyer Info & moving to Payment...");
    setShowBuyerInfo(false);
    // Proceed to next step logic here
  };

  const handleRejectSubmit = () => {
    console.log("Rejecting product...");
    setShowRejectModal(false);
    // Rejection logic here
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 px-10 relative text-[#020617]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-blue-600">VISIBUY</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
            beta
          </span>
        </div>
        <Image src="/icons/Menu.svg" alt="Menu" width={28} height={28} />
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
            1
          </span>
          <span className="font-medium">Verification</span>
        </div>
        <div className="h-px w-12 bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">
            2
          </span>
          <span>Payment</span>
        </div>
        <div className="h-px w-12 bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">
            3
          </span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Media Section */}
        <div className="col-span-8 bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Verification Media</h3>
            <button className="text-sm text-blue-600">View Full Media</button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3 aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 relative overflow-hidden">
              {/* Simulated Watermark from design */}
              <span className="absolute -rotate-45 text-4xl font-bold text-gray-400/30 pointer-events-none">
                11-10-2025
              </span>
              Main Photo
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400"
                >
                  Photo {i}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm">
            <p className="font-medium">iPhone 14 Pro Max – 256GB Space Black</p>
            <div className="flex justify-between text-gray-500 mt-1">
              <span>Verification Number</span>
              <span>Verification Status</span>
            </div>
            <p className="font-semibold mt-1">$999.99</p>
          </div>

          <div className="mt-4 border rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Escrow Protection</span>
              {/* Using Antd Checkbox for consistency */}
              <Checkbox checked disabled />
            </div>
            <p className="text-gray-500 mt-1">
              Escrow is currently ON. Payment is secure.
            </p>
          </div>
        </div>

        {/* Seller Info */}
        <div className="col-span-4 bg-white rounded-xl border p-4 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <UserOutlined className="text-2xl text-gray-400" />
            </div>
            <h4 className="font-semibold">Seller Name</h4>
            <p className="text-xs text-gray-500 mb-4">Seller Information</p>
          </div>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Trust Score</span>
              <span className="font-medium">98/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Sales</span>
              <span className="font-medium">100</span>
            </div>
          </div>

          <button className="mt-4 w-full border rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            View Full Profile
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center items-center w-full gap-6 mt-8 px-20">
        <button
          onClick={() => setShowRejectModal(true)}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg bg-[#1F2937] text-white hover:bg-[#2d3b4f] transition-colors"
        >
          <CloseOutlined /> Reject Product
        </button>
        <button
          onClick={() => setShowPaymentNotice(true)}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg bg-[#1F2937] text-white hover:bg-[#2d3b4f] transition-colors"
        >
          <CheckOutlined /> Approve Product
        </button>
      </div>

      {/* ================================================================================== */}
      {/* =========================== ANT DESIGN MODALS SECTION =========================== */}
      {/* ================================================================================== */}

      {/* ----- MODAL 1: Payment Notice (The Gatekeeper) ----- */}
      <Modal
        title={
          <div className="text-center font-semibold text-base pt-2">
            Verification Requires payment
          </div>
        }
        open={showPaymentNotice}
        onCancel={() => setShowPaymentNotice(false)}
        centered
        footer={null} // We build a custom footer to match design buttons exactly
        width={400}
        closable={false} // Design doesn't show X icon here
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} // Matching the dark overlay
        className="rounded-xl overflow-hidden"
      >
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-6">
            This payment has Escrow enabled. Do you wish to continue?
          </p>
          <div className="flex gap-3">
            <Button
              block
              size="large"
              className="rounded-lg border-gray-300 font-medium shadow-sm"
              onClick={() => setShowPaymentNotice(false)}
            >
              Cancel
            </Button>
            <Button
              block
              type="primary"
              size="large"
              className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium shadow-sm"
              onClick={() => {
                setShowPaymentNotice(false);
                setTimeout(() => setShowBuyerInfo(true), 200); // Small delay for smooth transition
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>

      {/* ----- MODAL 2: Buyer Information (Data Entry) ----- */}
      <Modal
        title={<div className="font-semibold text-lg">Buyer Information</div>}
        open={showBuyerInfo}
        onCancel={() => setShowBuyerInfo(false)}
        centered
        footer={null}
        width={600}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        className="rounded-xl"
      >
        <p className="text-sm text-gray-500 mb-6">
          Please provide your details to verify your purchase and activate
          escrow protection.
        </p>

        <div className="space-y-6">
          {/* Section 1: Inputs */}
          <div>
            <h5 className="font-medium mb-3">Buyer Details</h5>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                size="large"
                className="rounded-md"
              />
              <Input
                placeholder="Email Address"
                size="large"
                className="rounded-md"
              />
              {/* Phone Input with Prefix addon */}
              <Input
                addonBefore={
                  <Select
                    defaultValue="+254"
                    variant="borderless"
                    suffixIcon={
                      <DownOutlined className="text-xs text-gray-400" />
                    }
                  >
                    <Select.Option value="+254">+254</Select.Option>
                    <Select.Option value="+1">+1</Select.Option>
                    <Select.Option value="+44">+44</Select.Option>
                  </Select>
                }
                placeholder="000 000 000"
                size="large"
                className="rounded-md"
              />
              <Input
                placeholder="Address"
                size="large"
                className="rounded-md"
              />
              <Input placeholder="Date" size="large" className="rounded-md" />
              <Input
                placeholder="Country"
                size="large"
                className="rounded-md"
              />
            </div>
          </div>

          {/* Section 2: Read-only Details (Design labels this Buyer Details again, but it looks like product info) */}
          <div>
            <h5 className="font-medium mb-3">Buyer Details Summary</h5>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg text-sm">
              <div>
                <p className="text-gray-500 mb-1">Product Title</p>
                <p className="font-medium">iPhone 14 Pro Max</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Product Description</p>
                <p className="font-medium">256GB Space Black</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Amount to be Paid</p>
                <p className="font-medium">$999.99</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Payment Method</p>
                <p className="font-medium">Escrow (Secure)</p>
              </div>
            </div>
          </div>

          {/* Section 3: Confirmation */}
          <div>
            <h5 className="font-medium mb-3">Confirmation</h5>
            <Checkbox className="text-sm text-gray-600 leading-tight">
              I confirm that the details provided are accurate, and I agree to
              Visibuy's escrow terms and conditions.
            </Checkbox>
          </div>

          {/* Footer Action */}
          <Button
            block
            type="primary"
            size="large"
            className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium h-12 mt-4"
            onClick={handleBuyerInfoSubmit}
          >
            Proceed to Payment
          </Button>
        </div>
      </Modal>

      {/* ----- MODAL 3: Reject Product (Dead End) ----- */}
      <Modal
        title={
          <div className="font-semibold text-lg">Reject Item Verification</div>
        }
        open={showRejectModal}
        onCancel={() => setShowRejectModal(false)}
        centered
        footer={null}
        width={600}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <p className="text-sm text-gray-500 mb-6">
          Please provide details about the item verification and explain your
          reason for rejection.
        </p>

        <div className="space-y-6 text-sm">
          {/* Read-only Item Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Item:</span>
              <span className="font-medium">iPhone 14 Pro Max</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Colour:</span>
              <span className="font-medium">Space Black</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Verification ID:</span>
              <span className="font-medium">#VN-88492</span>
            </div>
          </div>

          {/* Rejection Form */}
          <div>
            <label className="block font-medium mb-2">Rejection Reason</label>
            <Select
              placeholder="Select Reason"
              size="large"
              className="w-full rounded-md"
              suffixIcon={<DownOutlined className="text-sm text-gray-400" />}
            >
              <Select.Option value="not_as_described">
                Item not as described
              </Select.Option>
              <Select.Option value="damaged">Item is damaged</Select.Option>
              <Select.Option value="fake">
                Item appears inauthentic
              </Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Add a comment (Optional)
            </label>
            <TextArea
              rows={4}
              placeholder="e.g. The scratches on the screen are deeper than described..."
              className="rounded-lg resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              block
              size="large"
              className="rounded-lg border-gray-300 font-medium shadow-sm"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              block
              type="primary"
              size="large"
              // Using a slightly reddish colour for rejection emphasis, or keep dark gray based on design preference
              className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium shadow-sm"
              onClick={handleRejectSubmit}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VerificationMedia;
