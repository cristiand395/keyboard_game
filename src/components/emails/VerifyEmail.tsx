import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailTemplateProps {
  userName: string;
  confirmLink: string;
}

export const VerifyEmailTemplate = ({
  userName,
  confirmLink,
}: VerifyEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verifica tu cuenta en Keyboard Game</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>¡Hola, {userName || "jugador"}!</Heading>
        <Text style={text}>
          Gracias por unirte a Keyboard Game. Para empezar a guardar tu progreso y competir en los retos, necesitamos verificar tu correo electrónico.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={confirmLink}>
            Verificar mi cuenta
          </Button>
        </Section>
        <Text style={subtext}>
          Si el botón no funciona, copia y pega este código en tu navegador:
          <br />
          <span style={codeStyle}>{confirmLink}</span>
        </Text>
        <Text style={text}>
          Si no has creado una cuenta, puedes ignorar este mensaje.
        </Text>
        <Text style={footer}>
          Keyboard Game Team • Mejora tu velocidad de escritura
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  maxWidth: "560px",
};

const h1 = {
  color: "#1e293b",
  fontSize: "24px",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 24px",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "40px",
};

const subtext = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "20px",
  textAlign: "center" as const,
  marginTop: "20px",
};

const codeStyle = {
  display: "block",
  padding: "12px",
  backgroundColor: "#f1f5f9",
  borderRadius: "8px",
  color: "#4f46e5",
  fontSize: "12px",
  fontFamily: "monospace",
  marginTop: "10px",
  wordBreak: "break-all" as const,
};
