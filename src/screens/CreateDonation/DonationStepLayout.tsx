import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useEffect } from "react";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const benefits = [
  [Leaf, "Carbon Impact", "Your donation saves approx. 12kg of CO2 emissions."],
  [
    ShieldCheck,
    "Verified Partners",
    "We only work with certified recyclers and charities.",
  ],
  [Flag, "Free Pickup", "All donations include zero-cost logistics."],
];

export const DonationStepLayout = ({
  step,
  title,
  children,
  nextLabel = "Next Step",
  nextDisabled = false,
  onNext,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext: () => void;
}): JSX.Element => {
  const navigate = useNavigate();

  // Único guard de autenticación para todos los pasos del formulario
  useEffect(() => {
    if (!isValidJwt(getStoredToken())) {
      navigate("/register");
    }
  }, [navigate]);

  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
        Create a donation
      </p>
      <h1 className="mt-3 text-4xl font-extrabold text-[#087532]">
        Give New Life
      </h1>
      <p className="mx-auto mt-3 max-w-xl leading-6 text-[#617066]">
        Power the circular economy. Follow the simple steps below to contribute
        to a sustainable future.
      </p>
      <div className="mt-10 rounded-[28px] bg-white p-6 text-left shadow-[0_20px_50px_rgba(43,91,58,.12)] sm:p-10">
        <div className="mb-8 flex gap-1">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-[#087532]" : "bg-[#e2eee4]"}`}
            />
          ))}
        </div>
        <h2 className="text-xl font-extrabold">
          {step}. {title}
        </h2>
        {children}
        <div className="mt-8 flex justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              navigate(
                step === 1
                  ? "/"
                  : step === 2
                    ? "/create-donation"
                    : step === 3
                      ? "/create-donation/category"
                      : "/create-donation/details",
              )
            }
            className="rounded-full font-bold text-[#617066]"
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <Button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="rounded-full bg-[#27bb5c] px-6 font-bold text-white hover:bg-[#149b47] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLabel} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {benefits.map(([Icon, title, text]) => {
          const ItemIcon = Icon as typeof Leaf;
          return (
            <div
              key={title as string}
              className="rounded-2xl bg-white p-4 text-left shadow-[0_10px_24px_rgba(43,91,58,.08)]"
            >
              <ItemIcon size={17} className="text-[#18b653]" />
              <p className="mt-3 text-sm font-bold">{title as string}</p>
              <p className="mt-1 text-xs leading-5 text-[#718077]">
                {text as string}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ChoiceCard = ({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onClick: () => void;
}): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${selected ? "border-[#27bb5c] bg-[#e8f8e9]" : "border-[#e1eee3] bg-[#f7fcf6] hover:border-[#a8dcb4]"}`}
  >
    <span
      className={`grid h-10 w-10 place-items-center rounded-full ${selected ? "bg-[#c5edcf] text-[#087532]" : "bg-white text-[#718077]"}`}
    >
      <Icon size={18} />
    </span>
    <span className="flex-1 text-sm font-bold">{label}</span>
    <span
      className={`h-4 w-4 rounded-full border-2 ${selected ? "border-[#159449] bg-[#159449]" : "border-[#bacdbf]"}`}
    >
      {selected && <CheckCircle2 size={12} className="text-white" />}
    </span>
  </button>
);