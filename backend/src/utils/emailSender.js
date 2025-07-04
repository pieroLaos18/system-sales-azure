const { EmailClient } = require('@azure/communication-email');

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const emailClient = new EmailClient(connectionString);

// Cambia esto por el email de tu dominio de Azure (puedes verlo en el portal de Azure)
const SENDER_EMAIL = "DoNotReply@d3578ea4-9778-43d7-b08e-b282db946cba.azurecomm.net";

// ✔ Función para recuperación de contraseña (ya la tienes)
const enviarCorreoRecuperacion = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const message = {
    senderAddress: SENDER_EMAIL,
    content: {
      subject: 'Recupera tu contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Este enlace expirará en 1 hora.</p>`
    },
    recipients: {
      to: [{ address: email }]
    }
  };
  const poller = await emailClient.beginSend(message);
  const result = await poller.pollUntilDone();
  if (result.status !== 'Succeeded') {
    throw new Error('No se pudo enviar el correo');
  }
};

// 🆕 Función para verificación de cuenta
const enviarCorreoVerificacion = async (email, nombre, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verificar?token=${token}`;
  const message = {
    senderAddress: SENDER_EMAIL,
    content: {
      subject: 'Verifica tu cuenta',
      html: `<p>Hola ${nombre},</p>
             <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>
             <p>Este enlace es válido por tiempo limitado.</p>`
    },
    recipients: {
      to: [{ address: email }]
    }
  };
  const poller = await emailClient.beginSend(message);
  const result = await poller.pollUntilDone();
  if (result.status !== 'Succeeded') {
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = {
  enviarCorreoRecuperacion,
  enviarCorreoVerificacion
};

