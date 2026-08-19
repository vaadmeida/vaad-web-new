/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { CheckCircle2 } from "lucide-react";
import Select from "@/app/components/SelectInput";
import Textarea from "@/app/components/Textarea";
import { useBillboard } from "@/app/hooks/useBillboard";
import { useAssets } from "@/app/hooks/useAssets";
import ImageUpload from "@/app/components/ImageUpload";

const SKIP_VALIDATION_FOR_TESTING = true;

type BillboardFormData = {
  partnerId: string;
  availableDate: string;
  printProductType: string;
  mediaType: string;
  dimension: string;
  orientation: string;
  visibility: string;
  illumination: string;
  format: string;
  description: string;
  locationAddress: string;
  state: string;
  city: string;
  landmark: string;
  approvalStatus: string;
  height: number | string;
  width: number | string;
  size: string;
  price: number | string;
  photos: string[];
  hotDeal: boolean;
  rating: number | string;
  favorite: boolean;
  features: string[];
  [key: string]: any;
};

const initialFormData: BillboardFormData = {
  partnerId: "",
  availableDate: "",
  printProductType: "",
  mediaType: "",
  dimension: "meters",
  orientation: "LANDSCAPE",
  visibility: "",
  illumination: "",
  format: "",
  description: "",
  locationAddress: "",
  state: "",
  city: "",
  landmark: "",
  approvalStatus: "",
  height: 0,
  width: 0,
  size: "",
  price: 0,
  photos: [],
  hotDeal: false,
  rating: 0,
  favorite: false,
  features: [],
};

export default function AddBoard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitDebug, setSubmitDebug] = useState<string | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([""]);

  const { createBillboard, isLoading } = useBillboard() as any;
  const {
    assets,
    isLoading: assetsLoading,
    getCitiesForState,
    getProductsForMediaType,
  } = useAssets() as any;

  const prevStateRef = useRef("");
  const prevMediaTypeRef = useRef("");

  const [formData, setFormData] = useState<BillboardFormData>(initialFormData);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);

  const availableCities = useMemo(
    () => (formData.state ? getCitiesForState?.(formData.state) || [] : []),
    [formData.state, getCitiesForState]
  );

  const mediaTypeOptions = Object.keys(assets?.mediaAndProductsTypes || {});

  const productOptions = useMemo(
    () => getProductsForMediaType?.(formData.mediaType) || [],
    [formData.mediaType, getProductsForMediaType]
  );

  useEffect(() => {
    if (prevStateRef.current !== formData.state && formData.city) {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
    prevStateRef.current = formData.state;
  }, [formData.state, formData.city]);

  useEffect(() => {
    if (
      prevMediaTypeRef.current !== formData.mediaType &&
      formData.printProductType
    ) {
      setFormData((prev) => ({ ...prev, printProductType: "" }));
    }
    prevMediaTypeRef.current = formData.mediaType;
  }, [formData.mediaType, formData.printProductType]);

  useEffect(() => {
    const h = Number(formData.height) || 0;
    const w = Number(formData.width) || 0;
    if (h > 0 && w > 0) {
      setFormData((prev) => ({ ...prev, size: `${h}x${w}` }));
    }
  }, [formData.height, formData.width]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

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

  const handleFeatureChange = (index: number, value: string) => {
    const next = [...featuresList];
    next[index] = value;
    setFeaturesList(next);
    handleInputChange(
      "features",
      next.filter((f) => f.trim() !== "")
    );
  };

  const addFeatureField = () => setFeaturesList((prev) => [...prev, ""]);

  const removeFeatureField = (index: number) => {
    const next = featuresList.filter((_, i) => i !== index);
    setFeaturesList(next.length ? next : [""]);
    handleInputChange(
      "features",
      next.filter((f) => f.trim() !== "")
    );
  };

  const handleNext = () => {
    if (!SKIP_VALIDATION_FOR_TESTING) {
      // add real validation later if needed
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitDebug(null);

    if (currentStep === 1) {
      handleNext();
      return;
    }

    const submitData: Record<string, any> = {
      partnerId: String(formData.partnerId || "").trim(),
      availableDate: formData.availableDate
        ? new Date(formData.availableDate as string).toISOString()
        : new Date().toISOString(),
      printProductType: formData.printProductType || "",
      mediaType: formData.mediaType || "",
      dimension: formData.dimension || "meters",
      orientation: formData.orientation || "LANDSCAPE",
      visibility: formData.visibility || "",
      illumination: formData.illumination || "",
      format: formData.format || "",
      description: String(formData.description || "").trim(),
      locationAddress: String(formData.locationAddress || "").trim(),
      state: formData.state || "",
      city: formData.city || "",
      landmark: formData.landmark || "",
      approvalStatus: formData.approvalStatus || "",
      height: Number(formData.height) || 0,
      width: Number(formData.width) || 0,
      size:
        formData.size ||
        `${Number(formData.height) || 0}x${Number(formData.width) || 0}`,
      price: Number(formData.price) || 0,
      photos: (uploadedPhotoUrls || []).filter(
        (url) => typeof url === "string" && url.trim() !== ""
      ),
      hotDeal: Boolean(formData.hotDeal),
      rating: Number(formData.rating) || 0,
      favorite: Boolean(formData.favorite),
      features: (formData.features || []).filter(
        (f: any) => typeof f === "string" && f.trim() !== ""
      ),
    };

    try {
      await createBillboard(submitData);
      setIsSubmitted(true);
    } catch (error: any) {
      const message =
        error?.message ||
        error?.data?.message ||
        "Failed to create billboard";
      const msg = Array.isArray(message) ? message.join(", ") : String(message);

      setSubmitError(msg);
      setSubmitDebug(
        JSON.stringify(
          {
            message: msg,
            status: error?.status,
            data: error?.data,
            payloadSent: submitData,
          },
          null,
          2
        )
      );
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData(initialFormData);
    setUploadedPhotoUrls([]);
    setFeaturesList([""]);
    setErrors({});
    setSubmitError(null);
    setSubmitDebug(null);
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
            label="Partner ID"
            placeholder="e.g., PARTNER12345"
            value={formData.partnerId}
            onChange={(e: any) => handleInputChange("partnerId", e.target.value)}
            error={errors.partnerId}
          />
          <Input
            label="Available Date"
            type="datetime-local"
            value={formData.availableDate}
            onChange={(e: any) =>
              handleInputChange("availableDate", e.target.value)
            }
            error={errors.availableDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Media Type"
            options={[
              { label: "Select media type", value: "" },
              ...mediaTypeOptions.map((t: string) => ({ label: t, value: t })),
            ]}
            value={formData.mediaType}
            onChange={(e: any) => handleInputChange("mediaType", e.target.value)}
            error={errors.mediaType}
          />
          <Select
            label="Print Product Type"
            options={[
              { label: "Select product type", value: "" },
              ...productOptions.map((p: string) => ({ label: p, value: p })),
            ]}
            value={formData.printProductType}
            onChange={(e: any) =>
              handleInputChange("printProductType", e.target.value)
            }
            error={errors.printProductType}
            disabled={!formData.mediaType}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Orientation"
            options={[
              { label: "Select orientation", value: "" },
              ...(assets?.orientation || []).map((o: string) => ({
                label: o,
                value: String(o).toUpperCase(),
              })),
            ]}
            value={formData.orientation}
            onChange={(e: any) =>
              handleInputChange("orientation", e.target.value)
            }
            error={errors.orientation}
          />
          <Select
            label="Dimension (units)"
            options={[
              { label: "Meters", value: "meters" },
              { label: "Feet", value: "feet" },
            ]}
            value={formData.dimension}
            onChange={(e: any) =>
              handleInputChange("dimension", e.target.value)
            }
            error={errors.dimension}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Visibility"
            options={[
              { label: "Select visibility", value: "" },
              ...(assets?.visibility || []).map((v: string) => ({
                label: v,
                value: v,
              })),
            ]}
            value={formData.visibility}
            onChange={(e: any) =>
              handleInputChange("visibility", e.target.value)
            }
            error={errors.visibility}
          />
          <Select
            label="Illumination"
            options={[
              { label: "Select illumination", value: "" },
              ...(assets?.illumination || []).map((i: string) => ({
                label: i,
                value: i,
              })),
            ]}
            value={formData.illumination}
            onChange={(e: any) =>
              handleInputChange("illumination", e.target.value)
            }
            error={errors.illumination}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Format"
            options={[
              { label: "Select format", value: "" },
              ...(assets?.format || []).map((f: string) => ({
                label: f,
                value: f,
              })),
            ]}
            value={formData.format}
            onChange={(e: any) => handleInputChange("format", e.target.value)}
            error={errors.format}
          />
          <Select
            label="Approval Status"
            options={[
              { label: "Select status", value: "" },
              ...(assets?.approvalStatus || []).map((s: string) => ({
                label: s,
                value: s,
              })),
            ]}
            value={formData.approvalStatus}
            onChange={(e: any) =>
              handleInputChange("approvalStatus", e.target.value)
            }
            error={errors.approvalStatus}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Location Address"
            placeholder="e.g., 123 Main Street..."
            value={formData.locationAddress}
            onChange={(e: any) =>
              handleInputChange("locationAddress", e.target.value)
            }
            error={errors.locationAddress}
          />
          <Select
            label="Landmark"
            options={[
              { label: "Select landmark (Optional)", value: "" },
              ...(assets?.landmarks || []).map((l: string) => ({
                label: l,
                value: l,
              })),
            ]}
            value={formData.landmark}
            onChange={(e: any) => handleInputChange("landmark", e.target.value)}
            error={errors.landmark}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="State"
            options={[
              { label: "Select state", value: "" },
              ...Object.keys(assets?.statesAndCites || {}).map((s: string) => ({
                label: s,
                value: s,
              })),
            ]}
            value={formData.state}
            onChange={(e: any) => handleInputChange("state", e.target.value)}
            error={errors.state}
          />
          <Select
            label="City"
            options={[
              { label: "Select city", value: "" },
              ...availableCities.map((c: string) => ({ label: c, value: c })),
            ]}
            value={formData.city}
            onChange={(e: any) => handleInputChange("city", e.target.value)}
            error={errors.city}
            disabled={!formData.state}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Height"
            placeholder="e.g., 15"
            type="number"
            value={formData.height || ""}
            onChange={(e: any) =>
              handleInputChange(
                "height",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            error={errors.height}
          />
          <Input
            label="Width"
            placeholder="e.g., 48"
            type="number"
            value={formData.width || ""}
            onChange={(e: any) =>
              handleInputChange(
                "width",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            error={errors.width}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Size (auto from height × width)"
            placeholder="e.g., 15x48"
            value={formData.size}
            onChange={(e: any) => handleInputChange("size", e.target.value)}
            error={errors.size}
          />
          <Input
            label="Price"
            placeholder="e.g., 2500"
            type="number"
            value={formData.price || ""}
            onChange={(e: any) =>
              handleInputChange(
                "price",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            error={errors.price}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Rating"
            placeholder="e.g., 4.5"
            type="number"
            value={formData.rating || ""}
            onChange={(e: any) =>
              handleInputChange(
                "rating",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            error={errors.rating}
          />
          <div className="flex items-center gap-6 pt-8">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(formData.hotDeal)}
                onChange={(e) => handleInputChange("hotDeal", e.target.checked)}
              />
              Hot Deal
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(formData.favorite)}
                onChange={(e) =>
                  handleInputChange("favorite", e.target.checked)
                }
              />
              Favorite
            </label>
          </div>
        </div>

        <div>
          <Textarea
            label="Description"
            placeholder="Describe the billboard location..."
            rows={3}
            value={formData.description}
            onChange={(e: any) =>
              handleInputChange("description", e.target.value)
            }
            error={errors.description}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#9A9EA7] mb-1.5">
            Features
          </label>
          {featuresList.map((feature, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <div className="flex-1">
                <Input
                  placeholder="e.g., High traffic location"
                  value={feature}
                  onChange={(e: any) =>
                    handleFeatureChange(index, e.target.value)
                  }
                />
              </div>
              {featuresList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeatureField(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeatureField}
            className="text-[#0177AB] text-sm hover:underline"
          >
            + Add another feature
          </button>
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
        />
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
                Your billboard has been added to the system.
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

            {submitError && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-700">Create failed</p>
                <p className="text-sm text-red-600 mt-1">{submitError}</p>
              </div>
            )}

            {submitDebug && (
              <div className="mt-4 bg-gray-100 border border-gray-300 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Debug response (includes payload sent):
                </p>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">
                  {submitDebug}
                </pre>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}