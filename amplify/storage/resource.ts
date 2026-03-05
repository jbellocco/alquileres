import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'alquileresStorage',
  access: (allow) => ({
    // Fotos de perfil: solo el dueño puede subir/borrar, todos pueden leer
    'perfiles/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read']),
    ],
    'resenas/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read']),
    ],
  }),
});
