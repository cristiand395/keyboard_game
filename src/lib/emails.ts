import { Resend } from "resend";
import { env } from "./env";
import { VerifyEmailTemplate } from "@/components/emails/VerifyEmail";
import React from "react";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const baseUrl = env.AUTH_URL || "http://localhost:3000";
  const confirmLink = `${baseUrl}/verificar-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Keyboard Game <onboarding@resend.dev>", // Cambiar por dominio verificado en Resend
      to: email,
      subject: "Verifica tu cuenta - Keyboard Game",
      react: React.createElement(VerifyEmailTemplate, {
        userName: name,
        confirmLink,
      }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending email:", error);
    return { success: false, error };
  }
}
