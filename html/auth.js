import { Amplify } from 'https://esm.sh/aws-amplify@6';
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, fetchUserAttributes } from 'https://esm.sh/aws-amplify@6/auth';
import { awsConfig } from './aws-config.js';

Amplify.configure(awsConfig);

// ===== REGISTRO =====
export async function registrar({ nombre, apellido, email, password }) {
  const { userId, nextStep } = await signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        given_name: nombre,
        family_name: apellido,
      }
    }
  });
  return { userId, nextStep };
}

// ===== CONFIRMAR EMAIL =====
export async function confirmarCodigo(email, codigo) {
  await confirmSignUp({ username: email, confirmationCode: codigo });
}

// ===== LOGIN =====
export async function login(email, password) {
  const { isSignedIn, nextStep } = await signIn({ username: email, password });
  return { isSignedIn, nextStep };
}

// ===== LOGOUT =====
export async function logout() {
  await signOut();
  location.href = 'index.html';
}

// ===== USUARIO ACTUAL =====
export async function getUsuarioActual() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch {
    return null;
  }
}

// ===== ATRIBUTOS DE COGNITO (nombre, apellido, email) =====
export async function getAtributosUsuario() {
  const attrs = await fetchUserAttributes();
  return {
    nombre: attrs.given_name || '',
    apellido: attrs.family_name || '',
    email: attrs.email || '',
  };
}
