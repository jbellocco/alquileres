// Configuración generada por amplify_outputs.json
export const awsConfig = {
  auth: {
    user_pool_id: "us-east-1_RBPNFz4Hp",
    aws_region: "us-east-1",
    user_pool_client_id: "5bhtjanp7v5chd3fdg6tsot56v",
    identity_pool_id: "us-east-1:13287477-1091-4c17-b4cc-4f5dd4e3dc3a",
    mfa_methods: [],
    standard_required_attributes: ["email"],
    username_attributes: ["email"],
    user_verification_types: ["email"],
    groups: [],
    mfa_configuration: "NONE",
    password_policy: {
      min_length: 8,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: true,
      require_uppercase: true
    },
    unauthenticated_identities_enabled: true
  },
  data: {
    url: "https://eple2sdr4fesrnwq5rs7ly5gxm.appsync-api.us-east-1.amazonaws.com/graphql",
    aws_region: "us-east-1",
    default_authorization_type: "AMAZON_COGNITO_USER_POOLS",
    authorization_types: ["AWS_IAM"],
    model_introspection: {
      version: 1,
      models: {
        Property: {
          name: "Property",
          fields: {
            id:                  { name: "id",                  isArray: false, type: "ID",          isRequired: true,  attributes: [] },
            propertyFingerprint: { name: "propertyFingerprint", isArray: false, type: "String",      isRequired: true,  attributes: [] },
            provincia:           { name: "provincia",           isArray: false, type: "String",      isRequired: true,  attributes: [] },
            partido:             { name: "partido",             isArray: false, type: "String",      isRequired: false, attributes: [] },
            barrio:              { name: "barrio",              isArray: false, type: "String",      isRequired: true,  attributes: [] },
            codigoPostal:        { name: "codigoPostal",        isArray: false, type: "String",      isRequired: false, attributes: [] },
            calleNormalizada:    { name: "calleNormalizada",    isArray: false, type: "String",      isRequired: false, attributes: [] },
            calleDisplay:        { name: "calleDisplay",        isArray: false, type: "String",      isRequired: false, attributes: [] },
            alturaPublica:       { name: "alturaPublica",       isArray: false, type: "String",      isRequired: false, attributes: [] },
            displayAddress:      { name: "displayAddress",      isArray: false, type: "String",      isRequired: false, attributes: [] },
            tipoVivienda:        { name: "tipoVivienda",        isArray: false, type: "String",      isRequired: false, attributes: [] },
            porInmobiliaria:     { name: "porInmobiliaria",     isArray: false, type: "Boolean",     isRequired: false, attributes: [] },
            nombreInmobiliaria:  { name: "nombreInmobiliaria",  isArray: false, type: "String",      isRequired: false, attributes: [] },
            alturaExacta:        { name: "alturaExacta",        isArray: false, type: "String",      isRequired: false, attributes: [] },
            piso:                { name: "piso",                isArray: false, type: "String",      isRequired: false, attributes: [] },
            depto:               { name: "depto",               isArray: false, type: "String",      isRequired: false, attributes: [] },
            totalResenas:        { name: "totalResenas",        isArray: false, type: "Int",         isRequired: false, attributes: [] },
            puntajePromedio:     { name: "puntajePromedio",     isArray: false, type: "Float",       isRequired: false, attributes: [] },
            totalRecomiendan:    { name: "totalRecomiendan",    isArray: false, type: "Int",         isRequired: false, attributes: [] },
            totalNoRecomiendan:  { name: "totalNoRecomiendan",  isArray: false, type: "Int",         isRequired: false, attributes: [] },
            problemasAgregados:  { name: "problemasAgregados",  isArray: false, type: "String",      isRequired: false, attributes: [] },
            tratosAgregados:     { name: "tratosAgregados",     isArray: false, type: "String",      isRequired: false, attributes: [] },
            monedasAgregadas:    { name: "monedasAgregadas",    isArray: false, type: "String",      isRequired: false, attributes: [] },
            contratosAgregados:  { name: "contratosAgregados",  isArray: false, type: "String",      isRequired: false, attributes: [] },
            createdAt: { name: "createdAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true },
            updatedAt: { name: "updatedAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true }
          },
          syncable: true,
          pluralName: "Properties",
          attributes: [
            { type: "model", properties: {} },
            { type: "auth", properties: { rules: [
              { allow: "private", operations: ["create","read","update","delete"] },
              { allow: "public", provider: "iam", operations: ["read"] }
            ]}},
            { type: "key", properties: { name: "propertiesByPropertyFingerprint", queryField: "listPropertyByPropertyFingerprint", fields: ["propertyFingerprint"] } }
          ],
          primaryKeyInfo: { isCustomPrimaryKey: false, primaryKeyFieldName: "id", sortKeyFieldNames: [] }
        },
        Review: {
          name: "Review",
          fields: {
            id:              { name: "id",              isArray: false, type: "ID",      isRequired: true,  attributes: [] },
            propertyId:      { name: "propertyId",      isArray: false, type: "String",  isRequired: true,  attributes: [] },
            autorId:         { name: "autorId",         isArray: false, type: "String",  isRequired: true,  attributes: [] },
            titulo:          { name: "titulo",          isArray: false, type: "String",  isRequired: true,  attributes: [] },
            texto:           { name: "texto",           isArray: false, type: "String",  isRequired: true,  attributes: [] },
            puntaje:         { name: "puntaje",         isArray: false, type: "Int",     isRequired: true,  attributes: [] },
            imagenes:        { name: "imagenes",        isArray: true,  type: "String",  isRequired: false, attributes: [], isArrayNullable: true },
            trato:           { name: "trato",           isArray: false, type: "String",  isRequired: false, attributes: [] },
            problemas:       { name: "problemas",       isArray: true,  type: "String",  isRequired: false, attributes: [], isArrayNullable: true },
            recomendaria:    { name: "recomendaria",    isArray: false, type: "String",  isRequired: false, attributes: [] },
            estado:          { name: "estado",          isArray: false, type: "String",  isRequired: false, attributes: [] },
            motivoRechazo:   { name: "motivoRechazo",   isArray: false, type: "String",  isRequired: false, attributes: [] },
            porInmobiliaria:    { name: "porInmobiliaria",    isArray: false, type: "Boolean", isRequired: false, attributes: [] },
            nombreInmobiliaria: { name: "nombreInmobiliaria", isArray: false, type: "String",  isRequired: false, attributes: [] },
            moneda:             { name: "moneda",             isArray: false, type: "String",  isRequired: false, attributes: [] },
            precioAlquiler:     { name: "precioAlquiler",     isArray: false, type: "Int",     isRequired: false, attributes: [] },
            tipoContrato:       { name: "tipoContrato",       isArray: false, type: "String",  isRequired: false, attributes: [] },
            createdAt: { name: "createdAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true },
            updatedAt: { name: "updatedAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true }
          },
          syncable: true,
          pluralName: "Reviews",
          attributes: [
            { type: "model", properties: {} },
            { type: "auth", properties: { rules: [
              { allow: "private", operations: ["create","read","update","delete"] },
              { allow: "public", provider: "iam", operations: ["read"] }
            ]}},
            { type: "key", properties: { name: "reviewsByPropertyId", queryField: "listReviewByPropertyId", fields: ["propertyId"] } },
            { type: "key", properties: { name: "reviewsByAutorId",    queryField: "listReviewByAutorId",    fields: ["autorId"] } }
          ],
          primaryKeyInfo: { isCustomPrimaryKey: false, primaryKeyFieldName: "id", sortKeyFieldNames: [] }
        },
        Resena: {
          name: "Resena",
          fields: {
            id: { name: "id", isArray: false, type: "ID", isRequired: true, attributes: [] },
            zona: { name: "zona", isArray: false, type: "String", isRequired: true, attributes: [] },
            barrio: { name: "barrio", isArray: false, type: "String", isRequired: true, attributes: [] },
            titulo: { name: "titulo", isArray: false, type: "String", isRequired: true, attributes: [] },
            texto: { name: "texto", isArray: false, type: "String", isRequired: true, attributes: [] },
            puntaje: { name: "puntaje", isArray: false, type: "Int", isRequired: true, attributes: [] },
            imagenes: { name: "imagenes", isArray: true, type: "String", isRequired: false, attributes: [], isArrayNullable: true },
            autorId: { name: "autorId", isArray: false, type: "String", isRequired: true, attributes: [] },
            autorNombre: { name: "autorNombre", isArray: false, type: "String", isRequired: false, attributes: [] },
            provincia:          { name: "provincia",          isArray: false, type: "String",  isRequired: false, attributes: [] },
            partido:            { name: "partido",            isArray: false, type: "String",  isRequired: false, attributes: [] },
            codigoPostal:       { name: "codigoPostal",       isArray: false, type: "String",  isRequired: false, attributes: [] },
            direccion:          { name: "direccion",          isArray: false, type: "String",  isRequired: false, attributes: [] },
            tipoVivienda:       { name: "tipoVivienda",       isArray: false, type: "String",  isRequired: false, attributes: [] },
            piso:               { name: "piso",               isArray: false, type: "String",  isRequired: false, attributes: [] },
            depto:              { name: "depto",              isArray: false, type: "String",  isRequired: false, attributes: [] },
            porInmobiliaria:    { name: "porInmobiliaria",    isArray: false, type: "Boolean", isRequired: false, attributes: [] },
            nombreInmobiliaria: { name: "nombreInmobiliaria", isArray: false, type: "String",  isRequired: false, attributes: [] },
            trato:              { name: "trato",              isArray: false, type: "String",  isRequired: false, attributes: [] },
            problemas:          { name: "problemas",          isArray: true,  type: "String",  isRequired: false, attributes: [], isArrayNullable: true },
            recomendaria:       { name: "recomendaria",       isArray: false, type: "String",  isRequired: false, attributes: [] },
            createdAt: { name: "createdAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true },
            updatedAt: { name: "updatedAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true }
          },
          syncable: true,
          pluralName: "Resenas",
          attributes: [
            { type: "model", properties: {} },
            { type: "auth", properties: { rules: [
              { allow: "private", operations: ["create","read","update","delete"] },
              { allow: "public", provider: "iam", operations: ["read"] }
            ]}}
          ],
          primaryKeyInfo: { isCustomPrimaryKey: false, primaryKeyFieldName: "id", sortKeyFieldNames: [] }
        },
        UserProfile: {
          name: "UserProfile",
          fields: {
            id: { name: "id", isArray: false, type: "ID", isRequired: true, attributes: [] },
            userId: { name: "userId", isArray: false, type: "String", isRequired: true, attributes: [] },
            nombre: { name: "nombre", isArray: false, type: "String", isRequired: true, attributes: [] },
            apellido: { name: "apellido", isArray: false, type: "String", isRequired: true, attributes: [] },
            alquila: { name: "alquila", isArray: false, type: "Boolean", isRequired: false, attributes: [] },
            lugar: { name: "lugar", isArray: false, type: "String", isRequired: false, attributes: [] },
            zona: { name: "zona", isArray: false, type: "String", isRequired: false, attributes: [] },
            alquilerPromedio: { name: "alquilerPromedio", isArray: false, type: "Int", isRequired: false, attributes: [] },
            fotoPerfil: { name: "fotoPerfil", isArray: false, type: "String", isRequired: false, attributes: [] },
            createdAt: { name: "createdAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true },
            updatedAt: { name: "updatedAt", isArray: false, type: "AWSDateTime", isRequired: false, attributes: [], isReadOnly: true }
          },
          syncable: true,
          pluralName: "UserProfiles",
          attributes: [
            { type: "model", properties: {} },
            { type: "auth", properties: { rules: [
              { provider: "userPools", ownerField: "owner", allow: "owner", identityClaim: "cognito:username", operations: ["create","update","delete","read"] },
              { allow: "private", operations: ["read"] }
            ]}}
          ],
          primaryKeyInfo: { isCustomPrimaryKey: false, primaryKeyFieldName: "id", sortKeyFieldNames: [] }
        }
      },
      enums: {},
      nonModels: {}
    }
  },
  storage: {
    aws_region: "us-east-1",
    bucket_name: "amplify-alquileres-study--alquileresstoragebucket1-shn5t2fpv9mk"
  },
  version: "1.4"
};
