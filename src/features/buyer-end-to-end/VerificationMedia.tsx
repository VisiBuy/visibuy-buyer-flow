"use client";

import React, { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Modal, Input, Select, Checkbox, Button } from "antd";
import { Header } from "./Header";
import VerificationLayout from "./layout";

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
    <VerificationLayout>
      <div className="w-full min-h-screen bg-gray-50 p-3 md:p-6 lg:px-10 relative text-[#020617]">

        {/* Steps - Made responsive */}
        <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6 mb-6 md:mb-8 text-xs md:text-sm">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] md:text-xs">
              1
            </span>
            <span className="font-medium hidden sm:inline">Verification</span>
            <span className="font-medium inline sm:hidden text-xs">Verif</span>
          </div>
          <div className="h-px w-4 md:w-8 lg:w-12 bg-gray-300" />
          <div className="flex items-center gap-1 md:gap-2">
            <span className="w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center text-[10px] md:text-xs">
              2
            </span>
            <span className="hidden sm:inline">Payment</span>
            <span className="inline sm:hidden text-xs">Pay</span>
          </div>
          <div className="h-px w-4 md:w-8 lg:w-12 bg-gray-300" />
          <div className="flex items-center gap-1 md:gap-2">
            <span className="w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center text-[10px] md:text-xs">
              3
            </span>
            <span className="hidden sm:inline">Confirmation</span>
            <span className="inline sm:hidden text-xs">Confirm</span>
          </div>
        </div>

        {/* Main Content - Made responsive with column layout on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Media Section */}
          <div className="lg:col-span-8 bg-white rounded-xl border p-3 md:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm md:text-base">
                Verification Media
              </h3>
              <button className="text-xs md:text-sm text-blue-600">
                View Full Media
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3 aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 relative overflow-hidden">
                {/* Simulated Watermark from design */}
                <span className="absolute -rotate-45 text-xl md:text-2xl lg:text-4xl font-bold text-gray-400/30 pointer-events-none">
                  11-10-2025
                </span>
                <span className="text-sm md:text-base">Main Photo</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 sm:gap-3 mt-3 sm:mt-0">
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

            <div className="mt-4 text-xs md:text-sm">
              <p className="font-medium text-sm md:text-base">
                iPhone 14 Pro Max – 256GB Space Black
              </p>
              <div className="flex justify-between text-gray-500 mt-1">
                <span>Verification Number</span>
                <span>Verification Status</span>
              </div>
              <p className="font-semibold mt-1 text-sm md:text-base">$999.99</p>
            </div>

            <div className="mt-4 border rounded-lg p-3 text-xs md:text-sm">
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
          <div className="lg:col-span-4 bg-white rounded-xl border p-3 md:p-4 h-fit mt-4 lg:mt-0">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <UserOutlined className="text-xl md:text-2xl text-gray-400" />
              </div>
              <h4 className="font-semibold text-sm md:text-base">
                Seller Name
              </h4>
              <p className="text-xs text-gray-500 mb-4">Seller Information</p>
            </div>

            <div className="text-xs md:text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Trust Score</span>
                <span className="font-medium">98/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Sales</span>
                <span className="font-medium">100</span>
              </div>
            </div>

            <button className="mt-4 w-full border rounded-lg py-2 text-xs md:text-sm font-medium hover:bg-gray-50 transition-colors">
              View Full Profile
            </button>
          </div>
        </div>

        {/* Actions - Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-3 md:gap-6 mt-6 md:mt-8 px-0 sm:px-4 md:px-20">
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex items-center justify-center w-full sm:w-1/2 gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg bg-[#1F2937] text-white hover:bg-[#2d3b4f] transition-colors text-sm md:text-base"
          >
            <CloseOutlined /> <span>Reject Product</span>
          </button>
          <button
            onClick={() => setShowPaymentNotice(true)}
            className="flex items-center justify-center w-full sm:w-1/2 gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg bg-[#1F2937] text-white hover:bg-[#2d3b4f] transition-colors text-sm md:text-base"
          >
            <CheckOutlined /> <span>Approve Product</span>
          </button>
        </div>

        {/* ----- MODAL 1: Payment Notice (The Gatekeeper) ----- */}
        <Modal
          title={
            <div className="text-center font-semibold text-sm md:text-base pt-2">
              Verification Requires payment
            </div>
          }
          open={showPaymentNotice}
          onCancel={() => setShowPaymentNotice(false)}
          centered
          footer={null}
          width={400}
          closable={false}
          className="rounded-xl overflow-hidden"
          styles={{
            body: { padding: "16px 20px" },
          }}
        >
          <div className="text-center">
            <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
              This payment has Escrow enabled. Do you wish to continue?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                block
                size="large"
                className="rounded-lg border-gray-300 font-medium shadow-sm text-sm md:text-base"
                onClick={() => setShowPaymentNotice(false)}
              >
                Cancel
              </Button>
              <Button
                block
                type="primary"
                size="large"
                className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium shadow-sm text-sm md:text-base"
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
          title={
            <div className="font-semibold text-base md:text-lg">
              Buyer Information
            </div>
          }
          open={showBuyerInfo}
          onCancel={() => setShowBuyerInfo(false)}
          centered
          footer={null}
          width={600}
          className="rounded-xl"
          styles={{
            body: { padding: "16px 20px" },
          }}
        >
          <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            Please provide your details to verify your purchase and activate
            escrow protection.
          </p>

          <div className="space-y-4 md:space-y-6">
            {/* Section 1: Inputs */}
            <div>
              <h5 className="font-medium mb-2 md:mb-3 text-sm md:text-base">
                Buyer Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Input
                  placeholder="Full Name"
                  size="large"
                  className="rounded-md text-sm md:text-base"
                />
                <Input
                  placeholder="Email Address"
                  size="large"
                  className="rounded-md text-sm md:text-base"
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
                      className="text-xs md:text-sm"
                    >
                      <Select.Option value="+254">+254</Select.Option>
                      <Select.Option value="+1">+1</Select.Option>
                      <Select.Option value="+44">+44</Select.Option>
                    </Select>
                  }
                  placeholder="000 000 000"
                  size="large"
                  className="rounded-md text-sm md:text-base"
                />
                <Input
                  placeholder="Address"
                  size="large"
                  className="rounded-md text-sm md:text-base"
                />
                <Input
                  placeholder="Date"
                  size="large"
                  className="rounded-md text-sm md:text-base"
                />
                <Input
                  placeholder="Country"
                  size="large"
                  className="rounded-md text-sm md:text-base"
                />
              </div>
            </div>

            {/* Section 2: Read-only Details */}
            <div>
              <h5 className="font-medium mb-2 md:mb-3 text-sm md:text-base">
                Buyer Details Summary
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg text-xs md:text-sm">
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
              <h5 className="font-medium mb-2 md:mb-3 text-sm md:text-base">
                Confirmation
              </h5>
              <Checkbox className="text-xs md:text-sm text-gray-600 leading-tight">
                I confirm that the details provided are accurate, and I agree to
                Visibuy's escrow terms and conditions.
              </Checkbox>
            </div>

            {/* Footer Action */}
            <Button
              block
              type="primary"
              size="large"
              className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium h-10 md:h-12 mt-3 md:mt-4 text-sm md:text-base"
              onClick={handleBuyerInfoSubmit}
            >
              Proceed to Payment
            </Button>
          </div>
        </Modal>

        {/* ----- MODAL 3: Reject Product (Dead End) ----- */}
        <Modal
          title={
            <div className="font-semibold text-base md:text-lg">
              Reject Item Verification
            </div>
          }
          open={showRejectModal}
          onCancel={() => setShowRejectModal(false)}
          centered
          footer={null}
          width={600}
          styles={{
            body: { padding: "16px 20px" },
          }}
        >
          <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            Please provide details about the item verification and explain your
            reason for rejection.
          </p>

          <div className="space-y-4 md:space-y-6 text-xs md:text-sm">
            {/* Read-only Item Details */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg space-y-2">
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
              <label className="block font-medium mb-2 text-sm md:text-base">
                Rejection Reason
              </label>
              <Select
                placeholder="Select Reason"
                size="large"
                className="w-full rounded-md text-sm md:text-base"
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
              <label className="block font-medium mb-2 text-sm md:text-base">
                Add a comment (Optional)
              </label>
              <TextArea
                rows={3}
                placeholder="e.g. The scratches on the screen are deeper than described..."
                className="rounded-lg resize-none text-sm md:text-base"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                block
                size="large"
                className="rounded-lg border-gray-300 font-medium shadow-sm text-sm md:text-base"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                block
                type="primary"
                size="large"
                className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium shadow-sm text-sm md:text-base"
                onClick={handleRejectSubmit}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </VerificationLayout>
  );
};

export default VerificationMedia;
