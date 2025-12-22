"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined,
  CameraOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Input,
  Select,
  Checkbox,
  Button,
  Upload,
  message,
  Spin,
  Progress,
} from "antd";
import {
  verificationService,
  type VerificationResponse,
  type UploadProgress,
} from "@/services/verificationService";

const { TextArea } = Input;
const { Dragger } = Upload;

type MediaType = "image" | "video";

interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  file?: File;
  name: string;
  timestamp?: string;
}

interface VerificationMediaContentProps {
  onComplete: () => void;
  onBack?: () => void;
  verificationId?: string; // For editing existing verification
}

const VerificationMediaContent: React.FC<VerificationMediaContentProps> = ({
  onComplete,
  onBack,
  verificationId,
}) => {
  const [showPaymentNotice, setShowPaymentNotice] = useState(false);
  const [showBuyerInfo, setShowBuyerInfo] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Media states
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "1",
      type: "image",
      url: "",
      name: "Main Photo",
      timestamp: "11-10-2025",
    },
    { id: "2", type: "image", url: "", name: "Photo 1" },
    { id: "3", type: "image", url: "", name: "Photo 2" },
    { id: "4", type: "image", url: "", name: "Photo 3" },
  ]);

  // Form states
  const [buyerForm, setBuyerForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    date: "",
    country: "",
  });

  const [rejectionForm, setRejectionForm] = useState({
    reason: "",
    comment: "",
  });

  // Loading states
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] =
    useState<VerificationResponse | null>(null);

  // Upload progress and error states
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [currentUploadPhase, setCurrentUploadPhase] = useState<
    "processing" | "uploading" | "complete" | "error"
  >("processing");

  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load verification data if editing
  useEffect(() => {
    if (verificationId) {
      loadVerificationData();
    }
  }, [verificationId]);

  const loadVerificationData = async () => {
    setIsLoading(true);
    try {
      const data = await verificationService.getVerification(verificationId!);
      setVerificationData(data);

      // Map API data to media items
      if (data.mediaUrls && data.mediaUrls.length > 0) {
        const newMediaItems = [...mediaItems];
        data.mediaUrls.forEach((url, index) => {
          if (index < newMediaItems.length) {
            newMediaItems[index] = {
              ...newMediaItems[index],
              url,
              name: `Photo ${index + 1}`,
            };
          }
        });
        setMediaItems(newMediaItems);
      }
    } catch (error) {
      message.error("Failed to load verification data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File, index: number) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      showTemporaryError(index, "Please upload only images or videos");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showTemporaryError(index, "File size should not exceed 10MB");
      return;
    }

    // Clear any previous errors
    clearUploadError(index);

    // Set loading state
    setUploadingIndex(index);
    setCurrentUploadPhase("processing");

    const reader = new FileReader();

    // Set timeout for file reading (10 seconds)
    const readTimeout = setTimeout(() => {
      if (reader.readyState !== 2) {
        // DONE state
        reader.abort();
        setUploadingIndex(null);
        showTemporaryError(index, "File processing timed out");
      }
    }, 10000);

    reader.onloadstart = () => {
      // Processing started
    };

    reader.onload = (e) => {
      clearTimeout(readTimeout);
      const result = e.target?.result as string;

      const newMediaItems = [...mediaItems];
      newMediaItems[index] = {
        ...newMediaItems[index],
        type: isVideo ? "video" : "image",
        url: result,
        file,
        name: file.name,
        timestamp:
          index === 0
            ? new Date()
                .toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "-")
            : undefined,
      };

      setMediaItems(newMediaItems);
      setUploadingIndex(null);
      setCurrentUploadPhase("complete");
      message.success(`${isVideo ? "Video" : "Image"} uploaded successfully!`);
    };

    reader.onerror = () => {
      clearTimeout(readTimeout);
      setUploadingIndex(null);
      setCurrentUploadPhase("error");
      showTemporaryError(index, "Failed to process file. Please try again.");
    };

    reader.onabort = () => {
      clearTimeout(readTimeout);
      setUploadingIndex(null);
      showTemporaryError(index, "File upload was cancelled.");
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      clearTimeout(readTimeout);
      setUploadingIndex(null);
      showTemporaryError(index, "Failed to read file. It may be corrupted.");
    }
  };

  const showTemporaryError = (index: number, message: string) => {
    setUploadErrors((prev) => ({ ...prev, [index]: message }));

    // Clear error after 3 seconds
    setTimeout(() => {
      clearUploadError(index);
    }, 3000);
  };

  const clearUploadError = (index: number) => {
    setUploadErrors((prev) => {
      const { [index]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, index);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMediaItems = [...mediaItems];
    newMediaItems[index] = {
      ...newMediaItems[index],
      url: "",
      file: undefined,
      name: index === 0 ? "Main Photo" : `Photo ${index}`,
      timestamp: index === 0 ? "11-10-2025" : undefined,
    };
    setMediaItems(newMediaItems);
    clearUploadError(index);
    message.info("Media removed");
  };

  const triggerFileInput = (index: number) => {
    if (isSubmitting || uploadingIndex !== null) {
      message.warning("Please wait for current upload to complete");
      return;
    }

    setSelectedMediaIndex(index);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file, index);
      }
    };
    input.click();
  };

  // Handle approval and API call
  const handleApproveProduct = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setCurrentUploadPhase("uploading");
    setUploadProgress(0);
    setUploadErrors({});

    try {
      // Filter out files that have been uploaded
      const files = mediaItems
        .filter((item) => item.file)
        .map((item) => item.file!);

      if (files.length === 0) {
        message.warning("Please upload at least one image or video");
        setIsSubmitting(false);
        setCurrentUploadPhase("processing");
        return;
      }

      const verificationData = {
        productTitle: "iPhone 14 Pro Max – 256GB Space Black",
        description:
          "Brand new iPhone 14 Pro Max in Space Black, 256GB storage",
        price: 99999, // Price in cents or base unit
        escrowEnabled: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        files,
      };

      const response = await verificationService.createVerification(
        verificationData,
        (progress) => {
          setUploadProgress(progress.percentage);
        }
      );

      setCurrentUploadPhase("complete");
      setUploadProgress(100);
      message.success("Verification submitted successfully!");

      // Store verification ID for future updates
      localStorage.setItem("currentVerificationId", response.id);

      // Show payment notice after a brief delay
      setTimeout(() => {
        setShowPaymentNotice(true);
        setCurrentUploadPhase("processing");
        setUploadProgress(0);
      }, 500);
    } catch (error: any) {
      setCurrentUploadPhase("error");
      message.error(
        error.message || "Failed to submit verification. Please try again."
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle buyer info submission
  const handleBuyerInfoSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const verificationId = localStorage.getItem("currentVerificationId");
      if (!verificationId) {
        throw new Error("No verification found");
      }

      await verificationService.submitBuyerInfo(verificationId, buyerForm);
      message.success("Buyer information submitted successfully!");
      setShowBuyerInfo(false);
      onComplete(); // Move to next step
    } catch (error: any) {
      message.error(error.message || "Failed to submit buyer information");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle rejection
  const handleRejectSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const verificationId = localStorage.getItem("currentVerificationId");
      if (!verificationId) {
        throw new Error("No verification found");
      }

      await verificationService.rejectVerification(
        verificationId,
        rejectionForm
      );
      message.success("Verification rejected successfully");
      setShowRejectModal(false);
    } catch (error: any) {
      message.error(error.message || "Failed to reject verification");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload additional media
  const handleBulkUpload = async (files: File[]) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setCurrentUploadPhase("uploading");
    setUploadProgress(0);
    setUploadErrors({});

    try {
      const verificationId = localStorage.getItem("currentVerificationId");
      if (!verificationId) {
        // If no existing verification, create a new one
        const verificationData = {
          productTitle: "iPhone 14 Pro Max – 256GB Space Black",
          description:
            "Brand new iPhone 14 Pro Max in Space Black, 256GB storage",
          price: 99999,
          escrowEnabled: true,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          files,
        };

        const response = await verificationService.createVerification(
          verificationData,
          (progress) => {
            setUploadProgress(progress.percentage);
          }
        );
        localStorage.setItem("currentVerificationId", response.id);
      } else {
        // Add to existing verification
        await verificationService.uploadAdditionalMedia(
          verificationId,
          files,
          (progress) => {
            setUploadProgress(progress.percentage);
          }
        );
      }

      setCurrentUploadPhase("complete");
      setUploadProgress(100);

      // Update local state with uploaded files
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const isVideo = file.type.startsWith("video/");

          setMediaItems((prev) => [
            ...prev,
            {
              id: Date.now().toString() + index,
              type: isVideo ? "video" : "image",
              url: result,
              file,
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });

      message.success("Media uploaded successfully!");

      setTimeout(() => {
        setShowUploadModal(false);
        setCurrentUploadPhase("processing");
        setUploadProgress(0);
      }, 500);
    } catch (error: any) {
      setCurrentUploadPhase("error");
      message.error(error.message || "Failed to upload media");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMediaPreview = (item: MediaItem, index: number) => {
    // Show error if exists
    if (uploadErrors[index]) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-2">
          <CloseOutlined className="text-red-500 text-lg mb-1" />
          <span className="text-xs text-red-500 text-center">
            {uploadErrors[index]}
          </span>
        </div>
      );
    }

    if (uploadingIndex === index) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <span className="text-xs text-gray-500 mt-2">
            {currentUploadPhase === "processing"
              ? "Processing..."
              : currentUploadPhase === "uploading"
              ? "Uploading..."
              : currentUploadPhase === "complete"
              ? "Complete!"
              : "Error"}
          </span>
        </div>
      );
    }

    if (item.url) {
      if (item.type === "video") {
        return (
          <>
            <video
              src={item.url}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              controls
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <PlayCircleOutlined className="text-4xl text-white" />
            </div>
          </>
        );
      } else {
        return (
          <img
            src={item.url}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        );
      }
    }

    return (
      <div className="flex flex-col items-center justify-center text-gray-400 ">
        {index === 0 ? (
          <div>
            <CameraOutlined className="text-base mb-2 mr-1" />
            <span className="text-xs text-center">
              Click to upload main photo
            </span>
          </div>
        ) : (
          <div className="mt-2">
            <CameraOutlined className="text-sm mb-1 mr-1" />
            <span className="text-xs">Photo {index}</span>
          </div>
        )}
      </div>
    );
  };

  const renderProgressBar = () => {
    if (currentUploadPhase === "uploading" && uploadProgress > 0) {
      return (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Progress
            percent={uploadProgress}
            status="active"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            showInfo={false}
          />
          <div className="text-center text-xs mt-1">
            Uploading: {uploadProgress}%
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {renderProgressBar()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Media Section */}
        <div className="lg:col-span-8 bg-white rounded-xl border p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm md:text-base">
              Verification Media
            </h3>
            <button
              className="text-xs md:text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => setShowUploadModal(true)}
              disabled={isSubmitting || uploadingIndex !== null}
            >
              {isSubmitting ? "Uploading..." : "Upload More Media"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Main Photo */}
            <div className="sm:col-span-3 aspect-square rounded-lg relative overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group">
              <div
                className="absolute inset-0"
                onClick={() =>
                  !isSubmitting && !uploadingIndex && triggerFileInput(0)
                }
              >
                {renderMediaPreview(mediaItems[0], 0)}

                {mediaItems[0].timestamp && (
                  <span className="absolute -rotate-45 text-xl md:text-2xl lg:text-4xl font-bold text-gray-400/30 pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {mediaItems[0].timestamp}
                  </span>
                )}
              </div>

              <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {mediaItems[0].url && !isSubmitting && !uploadingIndex && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMedia(0);
                    }}
                    className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <DeleteOutlined className="text-xs" />
                  </button>
                )}
                {!mediaItems[0].url && !isSubmitting && !uploadingIndex && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput(0);
                    }}
                    className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <UploadOutlined className="text-xs" />
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail Photos */}
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 sm:gap-3 mt-3 sm:mt-0">
              {[1, 2, 3].map((index) => {
                const item = mediaItems[index];
                return (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg relative overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group"
                  >
                    <div
                      className="absolute inset-0"
                      onClick={() =>
                        !isSubmitting &&
                        !uploadingIndex &&
                        triggerFileInput(index)
                      }
                    >
                      {renderMediaPreview(item, index)}
                    </div>

                    <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.url && !isSubmitting && !uploadingIndex && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMedia(index);
                          }}
                          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors text-[10px]"
                        >
                          <DeleteOutlined />
                        </button>
                      )}
                      {!item.url && !isSubmitting && !uploadingIndex && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFileInput(index);
                          }}
                          className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors text-[10px]"
                        >
                          <UploadOutlined />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 text-xs md:text-sm">
            <p className="font-medium text-sm md:text-base">
              {verificationData?.productTitle ||
                "iPhone 14 Pro Max – 256GB Space Black"}
            </p>
            <div className="flex justify-between text-gray-500 mt-1">
              <span>
                Verification Number:{" "}
                {verificationData?.verificationNumber || "#VN-88492"}
              </span>
              <span
                className={`font-medium ${
                  verificationData?.status === "verified"
                    ? "text-green-600"
                    : verificationData?.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {verificationData?.status
                  ? verificationData.status.charAt(0).toUpperCase() +
                    verificationData.status.slice(1)
                  : "Pending"}
              </span>
            </div>
            <p className="font-semibold mt-1 text-sm md:text-base">
              $
              {(verificationData?.price
                ? verificationData.price / 100
                : 999.99
              ).toFixed(2)}
            </p>
          </div>

          <div className="mt-4 border rounded-lg p-3 text-xs md:text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Escrow Protection</span>
              <Checkbox
                checked={verificationData?.escrowEnabled ?? true}
                disabled
              />
            </div>
            <p className="text-gray-500 mt-1">
              Escrow is currently{" "}
              {verificationData?.escrowEnabled ? "ON" : "OFF"}. Payment is{" "}
              {verificationData?.escrowEnabled ? "secure" : "not secured"}.
            </p>
            {verificationData?.expiresAt && (
              <p className="text-gray-500 mt-1 text-xs">
                Expires:{" "}
                {new Date(verificationData.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="lg:col-span-4 bg-white rounded-xl border p-3 md:p-4 h-fit mt-4 lg:mt-0">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <UserOutlined className="text-xl md:text-2xl text-gray-400" />
            </div>
            <h4 className="font-semibold text-sm md:text-base">Seller Name</h4>
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
            <div className="flex justify-between">
              <span className="text-gray-500">Response Time</span>
              <span className="font-medium text-green-600">2 hours</span>
            </div>
          </div>

          <button className="mt-4 w-full border rounded-lg py-2 text-xs md:text-sm font-medium hover:bg-gray-50 transition-colors">
            View Full Profile
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-3 md:gap-6 mt-6 md:mt-8 px-0 sm:px-4 md:px-20">
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isSubmitting || uploadingIndex !== null}
          className={`flex items-center justify-center w-full sm:w-1/2 gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
            isSubmitting || uploadingIndex !== null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1F2937] hover:bg-[#2d3b4f] text-white"
          }`}
        >
          {isSubmitting ? <LoadingOutlined spin /> : <CloseOutlined />}
          <span>{isSubmitting ? "Processing..." : "Reject Product"}</span>
        </button>
        <button
          onClick={handleApproveProduct}
          disabled={isSubmitting || uploadingIndex !== null}
          className={`flex items-center justify-center w-full sm:w-1/2 gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
            isSubmitting || uploadingIndex !== null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1F2937] hover:bg-[#2d3b4f] text-white"
          }`}
        >
          {isSubmitting ? <LoadingOutlined spin /> : <CheckOutlined />}
          <span>
            {isSubmitting
              ? currentUploadPhase === "uploading"
                ? `${uploadProgress}%`
                : "Submitting..."
              : "Approve Product"}
          </span>
        </button>
      </div>

      {/* Upload More Media Modal */}
      <Modal
        title={
          <div className="font-semibold text-base md:text-lg">
            Upload Additional Media
          </div>
        }
        open={showUploadModal}
        onCancel={() => !isSubmitting && setShowUploadModal(false)}
        centered
        footer={null}
        width={600}
        className="rounded-xl"
        closable={!isSubmitting}
      >
        <div className="space-y-4 md:space-y-6">
          <p className="text-xs md:text-sm text-gray-500">
            Upload additional images or videos to support your verification.
            Maximum file size: 10MB. Accepted formats: JPG, PNG, MP4, MOV.
          </p>

          {currentUploadPhase === "uploading" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Uploading files...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <Progress percent={uploadProgress} status="active" />
            </div>
          )}

          <Dragger
            multiple
            accept="image/*,video/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleBulkUpload([file]);
              return false;
            }}
            disabled={isSubmitting}
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              isSubmitting
                ? "border-gray-300 bg-gray-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <div className="text-center">
              {isSubmitting ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                <UploadOutlined className="text-3xl text-gray-400 mb-3" />
              )}
              <p className="text-sm font-medium mb-1">
                {isSubmitting
                  ? currentUploadPhase === "uploading"
                    ? `Uploading... ${uploadProgress}%`
                    : "Processing..."
                  : "Click or drag files to upload"}
              </p>
              <p className="text-xs text-gray-500">
                Images or videos up to 10MB
              </p>
            </div>
          </Dragger>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className="aspect-square rounded-lg border relative overflow-hidden group"
              >
                {item.url ? (
                  <>
                    {item.type === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <PlayCircleOutlined className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {!isSubmitting && (
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <DeleteOutlined className="text-xs" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <CameraOutlined className="text-xl text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowUploadModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="bg-[#1F2937] hover:!bg-[#2d3b4f]"
              onClick={() => setShowUploadModal(false)}
              disabled={isSubmitting}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Notice Modal */}
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
              disabled={isSubmitting}
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
                setTimeout(() => setShowBuyerInfo(true), 200);
              }}
              disabled={isSubmitting}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>

      {/* Buyer Info Modal */}
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
          <div>
            <h5 className="font-medium mb-2 md:mb-3 text-sm md:text-base">
              Buyer Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Input
                placeholder="Full Name"
                size="large"
                className="rounded-md text-sm md:text-base"
                value={buyerForm.fullName}
                onChange={(e) =>
                  setBuyerForm({ ...buyerForm, fullName: e.target.value })
                }
                disabled={isSubmitting}
              />
              <Input
                placeholder="Email Address"
                size="large"
                className="rounded-md text-sm md:text-base"
                value={buyerForm.email}
                onChange={(e) =>
                  setBuyerForm({ ...buyerForm, email: e.target.value })
                }
                disabled={isSubmitting}
              />
              <Input
                addonBefore={
                  <Select
                    defaultValue="+254"
                    variant="borderless"
                    suffixIcon={
                      <DownOutlined className="text-xs text-gray-400" />
                    }
                    className="text-xs md:text-sm"
                    disabled={isSubmitting}
                  >
                    <Select.Option value="+254">+254</Select.Option>
                    <Select.Option value="+1">+1</Select.Option>
                    <Select.Option value="+44">+44</Select.Option>
                  </Select>
                }
                placeholder="000 000 000"
                size="large"
                className="rounded-md text-sm md:text-base"
                value={buyerForm.phoneNumber}
                onChange={(e) =>
                  setBuyerForm({ ...buyerForm, phoneNumber: e.target.value })
                }
                disabled={isSubmitting}
              />
              <Input
                placeholder="Address"
                size="large"
                className="rounded-md text-sm md:text-base"
                value={buyerForm.address}
                onChange={(e) =>
                  setBuyerForm({ ...buyerForm, address: e.target.value })
                }
                disabled={isSubmitting}
              />
              <Input
                placeholder="Date"
                size="large"
                className="rounded-md text-sm md:text-base"
                value={buyerForm.date}
                onChange={(e) =>
                  setBuyerForm({ ...buyerForm, date: e.target.value })
                }
                disabled={isSubmitting}
              />
              <Input
                placeholder="Country"
                size="large"
                className="rounded-md text-sm md:text-base"
                value={buyerForm.country}
                onChange={(e) =>
                  setBuyerForm({ ...buyerForm, country: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

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

          <div>
            <h5 className="font-medium mb-2 md:mb-3 text-sm md:text-base">
              Confirmation
            </h5>
            <Checkbox
              className="text-xs md:text-sm text-gray-600 leading-tight"
              disabled={isSubmitting}
            >
              I confirm that the details provided are accurate, and I agree to
              Visibuy's escrow terms and conditions.
            </Checkbox>
          </div>

          <Button
            block
            type="primary"
            size="large"
            className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium h-10 md:h-12 mt-3 md:mt-4 text-sm md:text-base"
            onClick={handleBuyerInfoSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Proceed to Payment"}
          </Button>
        </div>
      </Modal>

      {/* Reject Modal */}
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

          <div>
            <label className="block font-medium mb-2 text-sm md:text-base">
              Rejection Reason
            </label>
            <Select
              placeholder="Select Reason"
              size="large"
              className="w-full rounded-md text-sm md:text-base"
              suffixIcon={<DownOutlined className="text-sm text-gray-400" />}
              value={rejectionForm.reason}
              onChange={(value) =>
                setRejectionForm({ ...rejectionForm, reason: value })
              }
              disabled={isSubmitting}
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
              value={rejectionForm.comment}
              onChange={(e) =>
                setRejectionForm({ ...rejectionForm, comment: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              block
              size="large"
              className="rounded-lg border-gray-300 font-medium shadow-sm text-sm md:text-base"
              onClick={() => setShowRejectModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              block
              type="primary"
              size="large"
              className="rounded-lg bg-[#1F2937] hover:!bg-[#2d3b4f] border-none font-medium shadow-sm text-sm md:text-base"
              onClick={handleRejectSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Rejection"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={(e) => handleFileInputChange(e, selectedMediaIndex)}
      />
    </>
  );
};

export default VerificationMediaContent;
