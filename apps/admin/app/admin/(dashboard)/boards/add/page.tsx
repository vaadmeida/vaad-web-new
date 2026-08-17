/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { CheckCircle2 } from "lucide-react";
import Select from "@/app/components/SelectInput";
import { useBillboard } from "@/app/hooks/useBillboard";
import {
  step1Schema,
  step2Schema,
  step4Schema,
  type BillboardFormData,
} from "@/app/lib/validations/billboard";
import { z } from "zod";
import ImageUpload from "@/app/components/ImageUpload";
import { useAssets } from "@/app/hooks/useAssets";

// Set to false when you want real validation enforced again
const SKIP_VALIDATION_FOR_TESTING = true;

const initialFormData: BillboardFormData = {
  partnerId: "",
  locationAddress: "",
  description: "",
  state: "",
  city: "",
  landmark: "",
  height: 0,
  width: 0,
  units: "meters",
  rate: 0,
  printProductType: "",
  serviceType: "",
  mediaType: "",
  orientation: "Landscape",
  targetAudience: [],
  features: [],
  photos: [],
  visibility: "",
  illumination: "",
  format: "",
  approvalStatus: "",
};

export default function AddBoard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createBillboard, isLoading } = useBillboard();
  const {
    assets,
    isLoading: assetsLoading,
    getCitiesForState,
    getProductsForMediaType,
  } = useAssets();

  const defaultsSetRef = useRef(false);
  const prevStateRef = useRef("");
  const prevMediaTypeRef = useRef("");

  const [formData, setFormData] = useState<BillboardFormData>(initialFormData);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);

  const availableCities = useMemo(
    () => (formData.state ? getCitiesForState(formData.state) : []),
    [formData.state, getCitiesForState]
  );

  const mediaTypeOptions = Object.keys(assets.mediaAndProductsTypes || {});

  const productOptions = useMemo(
    () => getProductsForMediaType(formData.mediaType),
    [formData.mediaType, getProductsForMediaType]
  );

  // Default service type
  useEffect(() => {
    if (
      !defaultsSetRef.current &&
      assets.services.length > 0 &&
      !formData.serviceType
    ) {
      defaultsSetRef.current = true;
      setFormData((prev) => ({ ...prev, serviceType: assets.services[0] }));
    }
  }, [assets.services, formData.serviceType]);

  // Clear city when state changes
  useEffect(() => {
    if (prevStateRef.current !== formData.state && formData.city) {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
    prevStateRef.current = formData.state;
  }, [formData.state, formData.city]);

  // Clear product type when media type changes
  useEffect(() => {
    if (
      prevMediaTypeRef.current !== formData.mediaType &&
      formData.printProductType
    ) {
      setFormData((prev) => ({ ...prev, printProductType: "" }));
    }
    prevMediaTypeRef.current = formData.mediaType;
  }, [formData.mediaType, formData.printProductType]);

  const handleInputChange = useCallback(
    (field: keyof BillboardFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const handlePhotoUpload = useCallback(
    (urls: string | string[]) => {
      const urlArray = Array.isArray(urls)
        ? urls.filter((url) => typeof url === "string" && url.trim() !== "")
        : typeof urls === "string" && urls.trim() !== ""
          ? [urls]
          : [];

      setUploadedPhotoUrls(urlArray);
      handleInputChange("photos", urlArray);
    },
    [handleInputChange]
  );

  const parseZodErrors = (error: z.ZodError) => {
    const newErrors: Record<string, string> = {};
    error.issues.forEach((issue) => {
      newErrors[issue.path.join(".")] = issue.message;
    });
    setErrors(newErrors);
  };

  const validateStep1 = (): boolean => {
    if (SKIP_VALIDATION_FOR_TESTING) return true;

    try {
      step1Schema.parse({
        partnerId: formData.partnerId,
        locationAddress: formData.locationAddress,
        description: formData.description,
        state: formData.state,
        city: formData.city,
        landmark: formData.landmark,
      });
      step2Schema.parse({
        height: formData.height,
        width: formData.width,
        units: formData.units,
        rate: formData.rate,
        printProductType: formData.printProductType,
        serviceType: formData.serviceType,
        mediaType: formData.mediaType,
        orientation: formData.orientation,
        visibility: formData.visibility,
        illumination: formData.illumination,
        format: formData.format,
        approvalStatus: formData.approvalStatus,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) parseZodErrors(error);
      return false;
    }
  };

  const validateStep2 = (): boolean => {
    if (SKIP_VALIDATION_FOR_TESTING) return true;

    try {
      step4Schema.parse({ photos: formData.photos });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) parseZodErrors(error);
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      handleNext();
      return;
    }

    if (!validateStep2()) return;

    const submitData = {
      partnerId: formData.partnerId.trim(),
      serviceType: formData.serviceType,
      mediaType: formData.mediaType,
      printProductType: formData.printProductType,
      locationAddress: formData.locationAddress.trim(),
      state: formData.state.toLowerCase(),
      city: formData.city.toLowerCase(),
      landmark: formData.landmark || undefined,
      orientation: formData.orientation,
      visibility: formData.visibility,
      illumination: formData.illumination,
      format: formData.format,
      approvalStatus: formData.approvalStatus,
      height: Number(formData.height) || 0,
      width: Number(formData.width) || 0,
      units: formData.units || "meters",
      rate: Number(formData.rate) || 0,
      description: formData.description?.trim() || "",
      targetAudience: (formData.targetAudience || []).filter(
        (a) => typeof a === "string" && a.trim() !== ""
      ),
      features: (formData.features || []).filter(
        (f) => typeof f === "string" && f.trim() !== ""
      ),
      photos: uploadedPhotoUrls.filter(
        (url) => typeof url === "string" && url.trim() !== ""
      ),
    };

    try {
      await createBillboard(submitData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to create billboard:", error);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    defaultsSetRef.current = false;
    setFormData(initialFormData);
    setUploadedPhotoUrls([]);
    setErrors({});
  };

  if (assetsLoading) {
    return (
      <div className="pb-8">
        <section>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6F9F] mx-auto" />
              <p className="mt-4 text-gray-500">Loading form data...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="bg-white rounded-xl p-8">
      <div className="text-start mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">
          Add New Board
        </h3>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Media Partner ID"
            placeholder="e.g., V1, V2, V3..."
            value={formData.partnerId}
            onChange={(e) => handleInputChange("partnerId", e.target.value)}
            error={errors.partnerId}
            required
          />
          <Input
            label="Availability"
            placeholder="e.g., Available June 12, 2026"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Service Type"
            options={[
              { label: "Select service type", value: "" },
              ...assets.services.map((s) => ({ label: s, value: s })),
            ]}
            value={formData.serviceType}
            onChange={(e) => handleInputChange("serviceType", e.target.value)}
            error={errors.serviceType}
            required
          />
          <Select
            label="Media Type"
            options={[
              { label: "Select media type", value: "" },
              ...mediaTypeOptions.map((t) => ({ label: t, value: t })),
            ]}
            value={formData.mediaType}
            onChange={(e) => handleInputChange("mediaType", e.target.value)}
            error={errors.mediaType}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Product Type"
            options={[
              { label: "Select product type", value: "" },
              ...productOptions.map((p) => ({ label: p, value: p })),
            ]}
            value={formData.printProductType}
            onChange={(e) =>
              handleInputChange("printProductType", e.target.value)
            }
            error={errors.printProductType}
            required
            disabled={!formData.mediaType}
          />
          <Select
            label="Orientation"
            options={[
              { label: "Select orientation", value: "" },
              ...assets.orientation.map((o) => ({ label: o, value: o })),
            ]}
            value={formData.orientation}
            onChange={(e) => handleInputChange("orientation", e.target.value)}
            error={errors.orientation}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Visibility"
            options={[
              { label: "Select visibility", value: "" },
              ...assets.visibility.map((v) => ({ label: v, value: v })),
            ]}
            value={formData.visibility}
            onChange={(e) => handleInputChange("visibility", e.target.value)}
            error={errors.visibility}
            required
          />
          <Input
            label="Price (₦ per day)"
            placeholder="e.g., 120000"
            type="number"
            value={formData.rate || ""}
            onChange={(e) =>
              handleInputChange(
                "rate",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            error={errors.rate}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Location"
            placeholder="e.g., 123 Allen Avenue, Ikeja"
            value={formData.locationAddress}
            onChange={(e) =>
              handleInputChange("locationAddress", e.target.value)
            }
            error={errors.locationAddress}
            required
          />
          <Select
            label="Landmark"
            options={[
              { label: "Select landmark (Optional)", value: "" },
              ...assets.landmarks.map((l) => ({ label: l, value: l })),
            ]}
            value={formData.landmark}
            onChange={(e) => handleInputChange("landmark", e.target.value)}
            error={errors.landmark}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Illumination"
            options={[
              { label: "Select illumination", value: "" },
              ...assets.illumination.map((i) => ({ label: i, value: i })),
            ]}
            value={formData.illumination}
            onChange={(e) => handleInputChange("illumination", e.target.value)}
            error={errors.illumination}
            required
          />
          <Select
            label="Format"
            options={[
              { label: "Select format", value: "" },
              ...assets.format.map((f) => ({ label: f, value: f })),
            ]}
            value={formData.format}
            onChange={(e) => handleInputChange("format", e.target.value)}
            error={errors.format}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="State"
            options={[
              { label: "Select state", value: "" },
              ...Object.keys(assets.statesAndCites || {}).map((s) => ({
                label: s,
                value: s,
              })),
            ]}
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            error={errors.state}
            required
          />
          <Select
            label="City"
            options={[
              { label: "Select city", value: "" },
              ...availableCities.map((c) => ({ label: c, value: c })),
            ]}
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            error={errors.city}
            required
            disabled={!formData.state}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Size (Height)"
            placeholder="e.g., 12"
            type="number"
            value={formData.height || ""}
            onChange={(e) =>
              handleInputChange(
                "height",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            error={errors.height}
            required
          />
          <Select
            label="Approval Status"
            options={[
              { label: "Select status", value: "" },
              ...assets.approvalStatus.map((s) => ({ label: s, value: s })),
            ]}
            value={formData.approvalStatus}
            onChange={(e) =>
              handleInputChange("approvalStatus", e.target.value)
            }
            error={errors.approvalStatus}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Width"
            placeholder="e.g., 24"
            type="number"
            value={formData.width || ""}
            onChange={(e) =>
              handleInputChange(
                "width",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            error={errors.width}
          />
          <Select
            label="Units"
            options={[
              { label: "Meters", value: "meters" },
              { label: "Feet", value: "feet" },
            ]}
            value={formData.units}
            onChange={(e) => handleInputChange("units", e.target.value)}
            error={errors.units}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-xl p-8">
      <div className="text-start mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">Photos</h3>
        <p className="text-[14px] text-[#8C94A6] mt-1">
          Upload photos of the billboard
        </p>
      </div>

      <div className="space-y-6">
        <ImageUpload
          label="Billboard Photos"
          onUploadSuccess={handlePhotoUpload}
          multiple
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          acceptedTypes={[
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ]}
          existingImages={uploadedPhotoUrls}
          required={uploadedPhotoUrls.length === 0}
        />

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-700">
            <strong>💡 Tip:</strong> Upload high-quality images that clearly
            show the billboard location and surroundings. At least one photo is
            required. Maximum 5 photos.
          </p>
        </div>

        {errors.photos && (
          <p className="text-sm text-red-500">{errors.photos}</p>
        )}
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="pb-8">
        <section>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-green-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Billboard Added Successfully!
              </h3>
              <p className="text-gray-500 mb-6">
                Your billboard has been added to the system. It will be reviewed
                shortly.
              </p>
              <Button onClick={resetForm}>Add Another Billboard</Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <section>
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? renderStep1() : renderStep2()}

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                className="h-[52px] px-8 rounded-lg border border-[#0177AB] text-[#0177AB] text-sm hover:bg-[#F5FAFD] transition font-medium"
              >
                Cancel
              </button>

              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-[52px] px-8 rounded-lg border border-[#0177AB] text-[#0177AB] text-sm hover:bg-[#F5FAFD] transition font-medium"
                >
                  ← Back
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="h-[52px] px-8 rounded-lg bg-[#1E6F9F] text-white text-sm hover:bg-[#155d86] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : currentStep === 2 ? (
                  "Finish"
                ) : (
                  "Next →"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}