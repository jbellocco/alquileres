import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  // ===== RESEÑAS =====
  Resena: a
    .model({
      zona:      a.string().required(),
      barrio:    a.string().required(),
      titulo:    a.string().required(),
      texto:     a.string().required(),
      puntaje:   a.integer().required(),
      imagenes:  a.string().array(),   // URLs de S3
      autorId:   a.string().required(), // ID del usuario de Cognito
      autorNombre: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
      allow.guest().to(['read']),  // visitantes pueden leer reseñas
    ]),

  // ===== PERFIL DE USUARIO =====
  UserProfile: a
    .model({
      userId:          a.string().required(), // ID de Cognito
      nombre:          a.string().required(),
      apellido:        a.string().required(),
      alquila:         a.boolean(),
      lugar:           a.string(),
      zona:            a.string(),
      alquilerPromedio: a.integer(),
      fotoPerfil:      a.string(),  // URL de S3
    })
    .authorization((allow) => [
      allow.owner(),  // solo el dueño puede editar su perfil
      allow.authenticated().to(['read']),
    ]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
