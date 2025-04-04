// components/OTPInput.tsx
"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
}

export function OTPInput({ value, onChange }: OTPInputProps) {
  return (
    <div className="w-full">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        className="w-full justify-between" // makes the group spread across the container
      >
        <InputOTPGroup className="w-full flex justify-between gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="w-full h-12 bg-black text-white border border-gray-600 rounded-md text-center text-lg focus:outline-none focus:border-white"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
