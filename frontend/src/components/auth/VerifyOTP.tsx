import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyOTP({
  setTimer,
  setCanResend,
  timer,
}: {
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  setCanResend: React.Dispatch<React.SetStateAction<boolean>>;
  timer: number;
}) {
  const navigate = useNavigate();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(false);
    }
  }, [timer]);

  useEffect(() => {
    const completeOtp =
      otp.length === 6 && otp.every((num) => num.trim() !== "");
    if (completeOtp) {
      setShowSubmitButton(true);
    }
  }, [otp]);

  const handleOnResendOtp = () => {
    setTimer(180);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setShowSubmitButton(false);
    toast.info("Please check your email");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").slice(0, otp.length);
    if (!/^[0-9]+$/.test(text)) return;

    setOtp(text.split(""));
    text.split("").forEach((digit, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = digit;
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Email verified successfully");
    navigate("/change-password");
    // alert("OTP Submitted: " + otp.join(""));
  };

  return (
    <div className="max-w-md mx-auto text-center px-4 sm:px-8 pb-10 rounded-xl shadow">
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center justify-center gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="w-10 h-10 text-center text-xl font-extrabold text-slate-900 bg-slate-200 border border-transparent hover:border-slate-200 appearance-none rounded p-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        {showSubmitButton && (
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="hover:bg-[#1664C0] bg-[#1976d2] text-sm uppercase text-white p-2 rounded w-full"
            >
              Verify Account
            </button>
          </div>
        )}
      </form>
      <div className="text-sm text-slate-500 mt-4">
        Didn't receive code?{" "}
        <button
          className={`font-medium text-indigo-500 hover:text-indigo-600`}
          disabled={timer > 0 ? true : false}
          onClick={handleOnResendOtp}
        >{`Resend (${Math.floor(timer / 60)}:${String(timer % 60).padStart(
          2,
          "0"
        )})`}</button>
      </div>
    </div>
  );
}
