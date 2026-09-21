import { CloudUpload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { DonationStepLayout } from "./DonationStepLayout";
import { useEffect, useState } from "react";
import { useDonation } from "./DonationContext";

const MAX_PHOTOS = 4;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

export const CreateDonation = (): JSX.Element => {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDonation();

  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Crea las URLs de preview y las libera cuando cambian las fotos
  useEffect(() => {
    const urls = draft.images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [draft.images]);

  const addFiles = (incoming: File[]) => {
    const valid: File[] = [];
    let message = "";

    for (const file of incoming) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        message = `"${file.name}" is not a JPG or PNG image.`;
      } else if (file.size > MAX_SIZE) {
        message = `"${file.name}" is larger than 10MB.`;
      } else {
        valid.push(file);
      }
    }

    const slots = MAX_PHOTOS - draft.images.length;
    if (valid.length > slots) {
      message = `You can add up to ${MAX_PHOTOS} photos.`;
    }

    setError(message);
    if (valid.length > 0) {
      updateDraft({ images: [...draft.images, ...valid.slice(0, slots)] });
    }
  };

  const removeImage = (index: number) => {
    setError("");
    updateDraft({ images: draft.images.filter((_, i) => i !== index) });
  };

  return (
    <AppShell>
      <PageContainer>
        <DonationStepLayout
          step={1}
          title="Upload Item Photos"
          onNext={() => navigate("/create-donation/category")}
        >
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              addFiles(Array.from(e.dataTransfer.files));
            }}
            className={`mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors hover:border-[#27bb5c] hover:bg-[#eaf8ea] ${isDragging ? "border-[#27bb5c] bg-[#eaf8ea]" : "border-[#c8dfcc] bg-[#f4fbf3]"}`}
          >
            <CloudUpload className="mb-3 text-[#8ac99b]" size={32} />
            <p className="text-sm text-[#617066]">
              Drag and drop images here or{" "}
              <span className="font-bold text-[#07933d]">browse files</span>
            </p>
            <p className="mt-1 text-xs text-[#94a198]">
              Supports JPG, PNG up to 10MB
            </p>
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              className="sr-only"
              onChange={(e) => {
                addFiles(Array.from(e.target.files ?? []));
                // Permite volver a elegir el mismo archivo si se eliminó
                e.target.value = "";
              }}
            />
          </label>

          {error && (
            <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          {previews.length > 0 && (
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((src, index) => (
                <li
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4fbf3]"
                >
                  <img
                    src={src}
                    alt={`Item photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove photo ${index + 1}`}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#617066] shadow hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 text-xs text-[#94a198]">
            Add clear photos so the community knows exactly what they are
            receiving.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#e2f3e4] px-3 py-1 text-xs font-semibold text-[#087532]">
              {draft.images.length} of {MAX_PHOTOS} photos
            </span>
            <span className="rounded-full bg-[#eef5ee] px-3 py-1 text-xs text-[#718077]">
              Optional but recommended
            </span>
          </div>
        </DonationStepLayout>
      </PageContainer>
    </AppShell>
  );
};