/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Select from "@/app/components/SelectInput";
import Textarea from "@/app/components/Textarea";
import { useBillboard } from "@/app/hooks/useBillboard";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type BillboardFormData,
} from "@/app/lib/validations/billboard";
import { z } from "zod";
import MultiSelect from "@/app/components/MultiSelect";
import ImageUpload from "@/app/components/ImageUpload";
import { useAssets } from "@/app/hooks/useAssets";

export default function AddBoard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createBillboard, isLoading } = useBillboard();
  const {
    assets,
    isLoading: assetsLoading,
    getCitiesForState,
  } = useAssets();

  // Track if initial defaults have been set
  const defaultsSetRef = useRef(false);

  // Form data state
  const [formData, setFormData] = useState<BillboardFormData>({
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
    orientation: "landscape",
    targetAudience: [],
    features: [],
    hotDeal: false,
    photos: [],
  });

  // Uploaded photo URLs
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);

  // Dynamic fields for arrays
  const [featuresList, setFeaturesList] = useState<string[]>([""]);

  // Derived state with useMemo
  const availableCities = useMemo(() => {
    return formData.state ? getCitiesForState(formData.state) : [];
  }, [formData.state, getCitiesForState]);

  // Get media type options
  const mediaTypeOptions = Object.keys(assets.mediaAndProductsTypes || {});

  // ==================== EFFECTS (Kept mostly as you had) ====================

  // Set default service type when assets load
  useEffect(() => {
    if (!defaultsSetRef.current && assets.services.length > 0 && !formData.serviceType) {
      defaultsSetRef.current = true;
      queueMicrotask(() => {
        setFormData((prev) => ({ ...prev, serviceType: assets.services[0] }));
      });
    }
  }, [assets.services, formData.serviceType]);

  // Clear city when state changes
  const prevStateRef = useRef(formData.state);
  useEffect(() => {
    if (prevStateRef.current !== formData.state && formData.city) {
      queueMicrotask(() => {
        setFormData((prev) => ({ ...prev, city: "" }));
      });
    }
    prevStateRef.current = formData.state;
  }, [formData.state]);

  // Clear print product type when media type changes
  const prevMediaTypeRef = useRef(formData.mediaType);
  useEffect(() => {
    if (prevMediaTypeRef.current !== formData.mediaType && formData.printProductType) {
      queueMicrotask(() => {
        setFormData((prev) => ({ ...prev, printProductType: "" }));
      });
    }
    prevMediaTypeRef.current = formData.mediaType;
  }, [formData.mediaType]);

  // ==================== HANDLERS ====================

  const handleInputChange = useCallback((field: keyof BillboardFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Safe Photo Upload Handler
  const handlePhotoUpload = useCallback((urls: string | string[]) => {
    let urlArray: string[] = [];

    if (Array.isArray(urls)) {
      urlArray = urls.filter((url): url is string => 
        typeof url === "string" && url.trim() !== ""
      );
    } else if (typeof urls === "string" && urls.trim() !== "") {
      urlArray = [urls];
    }

    setUploadedPhotoUrls(urlArray);
    handleInputChange("photos", urlArray);
  }, [handleInputChange]);

  const handleFeatureChange = useCallback((index: number, value: string) => {
    const newList = [...featuresList];
    newList[index] = value;
    setFeaturesList(newList);

    const features = newList.filter((item) => item.trim() !== "");
    handleInputChange("features", features);
  }, [featuresList, handleInputChange]);

  const addFeatureField = useCallback(() => {
    setFeaturesList((prev) => [...prev, ""]);
  }, []);

  const removeFeatureField = useCallback((index: number) => {
    setFeaturesList((prev) => {
      const newList = prev.filter((_, i) => i !== index);
      const features = newList.filter((item) => item.trim() !== "");
      queueMicrotask(() => {
        setFormData((formPrev) => ({ ...formPrev, features }));
      });
      return newList;
    });
  }, []);

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1:
        return {
          partnerId: formData.partnerId,
          locationAddress: formData.locationAddress,
          description: formData.description,
          state: formData.state,
          city: formData.city,
          landmark: formData.landmark,
        };
      case 2:
        return {
          height: formData.height,
          width: formData.width,
          units: formData.units,
          rate: formData.rate,
          printProductType: formData.printProductType,
          serviceType: formData.serviceType,
          mediaType: formData.mediaType,
          orientation: formData.orientation,
        };
      case 3:
        return {
          targetAudience: formData.targetAudience,
          features: formData.features,
          hotDeal: formData.hotDeal,
        };
      case 4:
        return { photos: formData.photos };
      default:
        return {};
    }
  };

  const validateStep = (): boolean => {
    let schema;
    switch (currentStep) {
      case 1: schema = step1Schema; break;
      case 2: schema = step2Schema; break;
      case 3: schema = step3Schema; break;
      case 4: schema = step4Schema; break;
      default: return true;
    }

    try {
      const stepData = getCurrentStepData();
      schema.parse(stepData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 4) {
      handleNext();
      return;
    }

    if (!validateStep()) return;

    const submitData = {
      ...formData,
      state: formData.state.toLowerCase(),
      city: formData.city.toLowerCase(),
      height: Number(formData.height),
      width: Number(formData.width),
      rate: Number(formData.rate),
      targetAudience: formData.targetAudience.filter((a) => typeof a === "string" && a.trim() !== ""),
      photos: uploadedPhotoUrls.filter((url) => typeof url === "string" && url.trim() !== ""),
      features: formData.features?.filter((f) => typeof f === "string" && f.trim() !== "") || [],
    };

    try {
      await createBillboard(submitData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to create billboard:", error);
    }
  };

  if (assetsLoading) {
    return (
      <div className="pb-8">
        <section>
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6F9F] mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading form data...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Step 1: Basic Details
  const renderStep1 = () => (
    <div className="bg-white rounded-xl p-8">
      <div className="text-start mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">Basic Details</h3>
        <p className="text-[14px] text-[#8C94A6] mt-1">Fill out the basic information about the billboard</p>
      </div>
      <div className="space-y-6">
        <Input label="Partner ID" placeholder="e.g., V1, V2, V3..." value={formData.partnerId} onChange={(e) => handleInputChange("partnerId", e.target.value)} error={errors.partnerId} required />
        <Input label="Location Address" placeholder="e.g., 123 Allen Avenue, Ikeja" value={formData.locationAddress} onChange={(e) => handleInputChange("locationAddress", e.target.value)} error={errors.locationAddress} required />
        <Textarea label="Description" placeholder="Describe the billboard location..." rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} error={errors.description} required />

        <div className="flex gap-6 w-full">
          <div className="flex-1">
            <Select label="State" options={[{ label: "Select state", value: "" }, ...Object.keys(assets.statesAndCites || {}).map(s => ({ label: s, value: s }))]} value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} error={errors.state} required />
          </div>
          <div className="flex-1">
            <Select label="City" options={[{ label: "Select city", value: "" }, ...availableCities.map(c => ({ label: c, value: c }))]} value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} error={errors.city} required disabled={!formData.state} />
          </div>
        </div>

        <Select label="Landmark" options={[{ label: "Select landmark (Optional)", value: "" }, ...assets.landmarks.map(l => ({ label: l, value: l }))]} value={formData.landmark} onChange={(e) => handleInputChange("landmark", e.target.value)} error={errors.landmark} />
      </div>
    </div>
  );

  // Step 2: Dimensions & Pricing (Updated for new printProductType)
  const renderStep2 = () => (
    <div className="bg-white rounded-xl p-8">
      <div className="text-start mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">Dimensions & Pricing</h3>
        <p className="text-[14px] text-[#8C94A6] mt-1">Enter billboard dimensions, pricing, and media details</p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-6 w-full">
          <div className="flex-1">
            <Input label="Height" placeholder="e.g., 12" type="number" value={formData.height || ""} onChange={(e) => handleInputChange("height", e.target.value ? Number(e.target.value) : 0)} error={errors.height} required />
            <p className="text-xs text-gray-400 mt-1">Height in meters</p>
          </div>
          <div className="flex-1">
            <Input label="Width" placeholder="e.g., 24" type="number" value={formData.width || ""} onChange={(e) => handleInputChange("width", e.target.value ? Number(e.target.value) : 0)} error={errors.width} required />
            <p className="text-xs text-gray-400 mt-1">Width in meters</p>
          </div>
        </div>

        <Select label="Units" options={[{ label: "Meters", value: "meters" }, { label: "Feet", value: "feet" }]} value={formData.units} onChange={(e) => handleInputChange("units", e.target.value)} error={errors.units} required />

        <Input label="Rate (₦ per day)" placeholder="e.g., 120000" type="number" value={formData.rate || ""} onChange={(e) => handleInputChange("rate", e.target.value ? Number(e.target.value) : 0)} error={errors.rate} required />
        <p className="text-xs text-gray-400 -mt-3">Daily rate in Nigerian Naira (₦)</p>

        <Select label="Service Type" options={[{ label: "Select service type", value: "" }, ...assets.services.map(s => ({ label: s, value: s }))]} value={formData.serviceType} onChange={(e) => handleInputChange("serviceType", e.target.value)} error={errors.serviceType} required />

        <Select label="Media Type" options={[{ label: "Select media type", value: "" }, ...mediaTypeOptions.map(t => ({ label: t, value: t }))]} value={formData.mediaType} onChange={(e) => handleInputChange("mediaType", e.target.value)} error={errors.mediaType} required />

        {/* Updated Print Product Type - Now uses flat assets.printProductType */}
        <Select
          label="Print Product Type"
          options={[
            { label: "Select print product type", value: "" },
            ...assets.printProductType.map((option) => ({
              label: option,
              value: option,
            })),
          ]}
          value={formData.printProductType}
          onChange={(e) => handleInputChange("printProductType", e.target.value)}
          error={errors.printProductType}
          required
        />

        <Select label="Orientation" options={[{ label: "Select orientation", value: "" }, ...assets.orientation.map(o => ({ label: o.charAt(0).toUpperCase() + o.slice(1), value: o }))]} value={formData.orientation} onChange={(e) => handleInputChange("orientation", e.target.value)} error={errors.orientation} required />
      </div>
    </div>
  );

  // Step 3 and Step 4 (unchanged except minor safety)
  const renderStep3 = () => (
    <div className="bg-white rounded-xl p-8">
      <div className="text-start mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">Audience & Features</h3>
        <p className="text-[14px] text-[#8C94A6] mt-1">Define target audience, features, and hot deal status</p>
      </div>
      <div className="space-y-6">
        <MultiSelect label="Target Audience" options={assets.targetAudience || []} values={formData.targetAudience} onChange={(values) => handleInputChange("targetAudience", values)} error={errors.targetAudience} required placeholder="Select target audience groups..." />
        <p className="text-xs text-gray-400 -mt-3">Select one or more audience segments</p>

        <div>
          <label className="block text-sm font-medium text-[#9A9EA7] mb-1.5">Features (Optional)</label>
          {featuresList.map((feature, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <div className="flex-1">
                <Input placeholder="e.g., High Traffic Area..." value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} />
              </div>
              {featuresList.length > 1 && (
                <button type="button" onClick={() => removeFeatureField(index)} className="text-red-500 hover:text-red-700 mt-2">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addFeatureField} className="text-[#0177AB] text-sm hover:underline">+ Add another feature</button>
        </div>

        <div className="flex items-center justify-between pt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div>
            <p className="text-sm font-medium text-[#1A1A21]">🔥 Hot Deal</p>
            <p className="text-xs text-[#8C94A6]">Mark this as a hot deal</p>
          </div>
          <button type="button" onClick={() => handleInputChange("hotDeal", !formData.hotDeal)} className={`w-12 h-6 rounded-full transition ${formData.hotDeal ? "bg-[#1E6F9F]" : "bg-gray-300"} relative`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${formData.hotDeal ? "right-0.5" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-xl p-8">
      <div className="text-start mb-8">
        <h3 className="text-[20px] font-semibold text-[#1A1A21]">Photos</h3>
        <p className="text-[14px] text-[#8C94A6] mt-1">Upload photos of the billboard</p>
      </div>
      <div className="space-y-6">
        <ImageUpload
          label="Billboard Photos"
          onUploadSuccess={handlePhotoUpload}
          multiple={true}
          maxFiles={5}
          maxSize={10 * 1024 * 1024}
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/gif"]}
          existingImages={uploadedPhotoUrls}
          required={uploadedPhotoUrls.length === 0}
        />

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-700">
            <strong>💡 Tip:</strong> Upload high-quality images that clearly show the billboard location and surroundings. At least one photo is required. Maximum 5 photos.
          </p>
        </div>

        {errors.photos && <p className="text-sm text-red-500">{errors.photos}</p>}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  const renderForm = () => {
    if (isSubmitted) {
      return (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Billboard Added Successfully!</h3>
          <p className="text-gray-500 mb-6">Your billboard has been added to the system. It will be reviewed shortly.</p>
          <Button onClick={() => {
            setIsSubmitted(false);
            setCurrentStep(1);
            defaultsSetRef.current = false;
            setFormData({
              partnerId: "", locationAddress: "", description: "", state: "", city: "", landmark: "",
              height: 0, width: 0, units: "meters", rate: 0, printProductType: "", serviceType: "",
              mediaType: "", orientation: "landscape", targetAudience: [], features: [], hotDeal: false, photos: [],
            });
            setUploadedPhotoUrls([]);
            setFeaturesList([""]);
            setErrors({});
          }}>
            Add Another Billboard
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        {renderCurrentStep()}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <button type="button" onClick={handleBack} className="flex-1 h-[52px] rounded-lg border border-[#0177AB] text-[#0177AB] text-sm hover:bg-[#F5FAFD] transition font-medium">← Back</button>
          )}
          <button type="submit" disabled={isLoading} className="flex-1 h-[52px] rounded-lg bg-[#1E6F9F] text-white text-sm hover:bg-[#155d86] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : currentStep === 4 ? "Submit Billboard" : "Next →"}
          </button>
        </div>
      </form>
    );
  };

  const steps = [
    { number: 1, title: "Basic Details", description: "Location & partner information" },
    { number: 2, title: "Dimensions & Pricing", description: "Size, rates & media specifications" },
    { number: 3, title: "Audience & Features", description: "Target audience & key features" },
    { number: 4, title: "Photos", description: "Billboard images & documentation" },
  ];

  return (
    <div className="pb-8">
      <section>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8">
          {renderForm()}

          <div className="bg-white rounded-xl p-6 h-fit sticky top-6 shadow-sm border border-gray-100">
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0 transition-all ${
                    currentStep === step.number ? "bg-[#1E6F9F] text-white shadow-md" :
                    currentStep > step.number ? "bg-green-500 text-white" : "border border-[#D9D9D9] text-[#8C94A6] bg-white"
                  }`}>
                    {currentStep > step.number ? <CheckCircle2 size={20} /> : step.number}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${currentStep === step.number ? "text-[#1E6F9F]" : "text-[#1A1A21]"}`}>{step.title}</p>
                    <p className="text-xs text-[#8C94A6] mt-1 max-w-[220px] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="my-8 border-t border-[#EDEDF2]" />
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-[#1A1A21] mb-1">Need Help?</p>
              <p className="text-xs text-[#8C94A6] mb-4 leading-relaxed">Get to know how your campaign can reach a wider audience.</p>
              <Link href="/contact">
                <button className="w-full px-4 py-2 text-sm border border-[#D9D9D9] rounded-lg text-[#1A1A21] hover:bg-gray-100 transition font-medium">Contact Support</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}