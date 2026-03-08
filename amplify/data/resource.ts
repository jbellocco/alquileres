import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  // ===== PROPIEDAD (entidad del inmueble, existe una sola vez) =====
  Property: a
    .model({
      // Deduplicación
      // fingerprint = provincia:calleNorm:alturaExacta:tipoVivienda:piso:depto
      // partido/barrio/codigoPostal son metadata descriptiva, NO forman parte de la identidad
      // La inmobiliaria NO forma parte del fingerprint (es informativa y puede cambiar)
      propertyFingerprint: a.string().required(),

      // Info pública
      provincia:          a.string().required(),
      partido:            a.string(),            // localidad (requerida si no es CABA)
      barrio:             a.string().required(),
      codigoPostal:       a.string(),
      calleNormalizada:   a.string(),            // "corrientes" (sin Av., sin acentos) — solo para dedup
      calleDisplay:       a.string(),            // "Av. Corrientes" (con prefijos, Title Case) — para mostrar
      alturaPublica:      a.string(),            // "6100" (redondeada al 100 inferior)
      displayAddress:     a.string(),            // "Av. Corrientes 6100 — Palermo, CABA"
      tipoVivienda:       a.string(),            // 'casa' | 'edificio'
      porInmobiliaria:    a.boolean(),           // informativo
      nombreInmobiliaria: a.string(),            // informativo, puede cambiar

      // Info privada (display-private: no se muestra en vistas públicas)
      alturaExacta:       a.string(),
      piso:               a.string(),
      depto:              a.string(),

      // Stats denormalizados — actualizados DESPUÉS de confirmar la creación de la Review
      totalResenas:       a.integer(),
      puntajePromedio:    a.float(),
      totalRecomiendan:   a.integer(),
      totalNoRecomiendan: a.integer(),
    })
    .secondaryIndexes((index) => [index('propertyFingerprint')])
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
      allow.guest().to(['read']),
    ]),

  // ===== RESEÑA (experiencia del usuario sobre una propiedad) =====
  Review: a
    .model({
      propertyId:      a.string().required(),  // FK a Property
      autorId:         a.string().required(),  // ID de Cognito
      titulo:          a.string().required(),
      texto:           a.string().required(),
      puntaje:         a.integer().required(),
      imagenes:        a.string().array(),
      trato:           a.string(),             // 'muy-bueno' | 'normal' | 'dificil' | 'estafador'
      problemas:       a.string().array(),
      recomendaria:    a.string(),             // 'si' | 'no' | 'tal-vez'
      estado:          a.string(),             // 'activo' | 'pendiente' | 'rechazado'
      motivoRechazo:   a.string(),
      // Inmobiliaria al momento de la reseña (informativo)
      porInmobiliaria:    a.boolean(),
      nombreInmobiliaria: a.string(),
    })
    .secondaryIndexes((index) => [
      index('propertyId'),
      index('autorId'),
    ])
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
      allow.guest().to(['read']),
    ]),

  // ===== RESEÑA LEGACY (mantener para migración, eliminar después) =====
  Resena: a
    .model({
      zona:      a.string().required(),
      barrio:    a.string().required(),
      titulo:    a.string().required(),
      texto:     a.string().required(),
      puntaje:   a.integer().required(),
      imagenes:  a.string().array(),
      autorId:   a.string().required(),
      autorNombre: a.string(),
      provincia:          a.string(),
      partido:            a.string(),
      codigoPostal:       a.string(),
      direccion:          a.string(),
      tipoVivienda:       a.string(),
      piso:               a.string(),
      depto:              a.string(),
      porInmobiliaria:    a.boolean(),
      nombreInmobiliaria: a.string(),
      trato:        a.string(),
      problemas:    a.string().array(),
      recomendaria: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
      allow.guest().to(['read']),
    ]),

  // ===== PERFIL DE USUARIO =====
  UserProfile: a
    .model({
      userId:          a.string().required(),
      nombre:          a.string().required(),
      apellido:        a.string().required(),
      alquila:         a.boolean(),
      lugar:           a.string(),
      zona:            a.string(),
      alquilerPromedio: a.integer(),
      fotoPerfil:      a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
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
