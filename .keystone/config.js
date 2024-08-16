"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// utils.ts
var import_jimp = __toESM(require("jimp"));
var import_sharp = __toESM(require("sharp"));
var import_axios = __toESM(require("axios"));
var generatePlaceholder = async (imageUrl) => {
  try {
    const response = await import_axios.default.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);
    const convertedBuffer = await (0, import_sharp.default)(imageBuffer).toFormat("jpeg").toBuffer();
    const image2 = await import_jimp.default.read(convertedBuffer);
    image2.resize(10, 10);
    const base64 = await image2.getBase64Async(import_jimp.default.MIME_JPEG);
    return base64;
  } catch (error) {
    console.error("Error generating placeholder:", error);
    throw new Error("Failed to generate image placeholder");
  }
};

// schema.ts
var lists = {
  User: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      })
    }
  }),
  Producto: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    // this is the fields for our Producto list
    fields: {
      nombre: (0, import_fields.text)({ validation: { isRequired: true } }),
      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      descripcion: (0, import_fields.text)({ validation: { isRequired: true } }),
      precio: (0, import_fields.integer)({
        validation: { isRequired: true }
      }),
      es_visible: (0, import_fields.checkbox)({ defaultValue: true }),
      imagen: (0, import_fields.image)({ storage: "delicious_vicious_bucket" }),
      imagenPlaceholder: (0, import_fields.text)({
        label: "Campo de referencia, no se tiene que llenar. (Solo Mefit lo puede modificar)"
      }),
      categoria: (0, import_fields.relationship)({
        ref: "Categoria.productos",
        ui: {
          displayMode: "select",
          labelField: "nombre"
        }
      })
    },
    hooks: {
      afterOperation: async ({
        operation,
        item,
        context,
        resolvedData
      }) => {
        if ((operation === "create" || operation === "update") && resolvedData?.imagen.id) {
          if (item.imagen_id) {
            const imageContext = context.images("delicious_vicious_bucket");
            const imageUrl = await imageContext.getUrl(
              item.imagen_id,
              item.imagen_extension
            );
            const placeholder = await generatePlaceholder(imageUrl);
            await context.query.Producto.updateOne({
              where: { id: item.id },
              data: { imagenPlaceholder: placeholder }
            });
          }
        }
      }
    }
  }),
  Categoria: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      nombre: (0, import_fields.text)({ validation: { isRequired: true } }),
      productos: (0, import_fields.relationship)({
        ref: "Producto.categoria",
        many: true,
        ui: {
          labelField: "nombre"
        }
      }),
      se_vende_por_caja: (0, import_fields.checkbox)({ defaultValue: false })
    }
  }),
  Portada: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      nombre: (0, import_fields.text)({ validation: { isRequired: true } }),
      es_visible: (0, import_fields.checkbox)({ defaultValue: true }),
      es_vertical: (0, import_fields.checkbox)({ defaultValue: false }),
      imagen: (0, import_fields.image)({ storage: "delicious_vicious_bucket" })
    }
  }),
  Box: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      nombre: (0, import_fields.text)({ validation: { isRequired: true } }),
      size: (0, import_fields.integer)({
        validation: { isRequired: true, min: 1 },
        label: "Tama\xF1o (Coloca 1 si la caja es de un solo producto Ej: Brownies)"
      }),
      es_visible: (0, import_fields.checkbox)({ defaultValue: true }),
      imagen: (0, import_fields.image)({ storage: "delicious_vicious_bucket" }),
      categoria: (0, import_fields.relationship)({
        ref: "Categoria",
        // Reference to Categoria list
        ui: {
          displayMode: "select",
          labelField: "nombre"
          // Display the 'nombre' field of Categoria
        }
      }),
      descripcion: (0, import_fields.text)({
        label: "Descripci\xF3n: (Si es solo de un producto, recomendable agregar algo como: `Caja de 6 brownies de un solo sabor a elegir`)",
        ui: {
          displayMode: "textarea"
        }
      }),
      orders: (0, import_fields.relationship)({
        ref: "Order.box",
        // Reference the 'box' field in the Order list
        many: true,
        // Box can have many orders
        label: "Este campo es de referencia, no se tiene que llenar",
        ui: {
          displayMode: "count"
        }
      })
    }
  }),
  Order: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      nombre: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      email: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      telefono: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      referencia: (0, import_fields.text)(),
      direccion: (0, import_fields.text)(),
      google_maps_link: (0, import_fields.text)(),
      dia_entrega: (0, import_fields.text)(),
      hora_entrega: (0, import_fields.text)(),
      tipo_entrega: (0, import_fields.text)({
        validation: { isRequired: true }
      }),
      productos: (0, import_fields.text)({
        validation: { isRequired: true },
        ui: {
          displayMode: "textarea"
        }
      }),
      total_orden: (0, import_fields.integer)({
        validation: { isRequired: true }
      }),
      status: (0, import_fields.select)({
        defaultValue: "created",
        options: [
          {
            label: "Orden creada",
            value: "created"
          },
          {
            label: "Orden Pagada",
            value: "paid"
          },
          {
            label: "Orden Finalizada",
            value: "finished"
          }
        ]
      }),
      box: (0, import_fields.relationship)({
        ref: "Box.orders",
        // Reference the 'orders' field in the Box list
        label: "Tama\xF1o de la caja",
        ui: {
          displayMode: "select",
          labelField: "size"
        }
      })
    }
  }),
  Stock: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      actualizado_en: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        validation: { isRequired: true }
      }),
      valido_desde: (0, import_fields.timestamp)({
        isIndexed: "unique",
        validation: { isRequired: true }
      }),
      valido_hasta: (0, import_fields.timestamp)({
        isIndexed: "unique",
        validation: { isRequired: true }
      }),
      es_valido: (0, import_fields.checkbox)({ defaultValue: true }),
      productos: (0, import_fields.json)()
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var import_config = require("dotenv/config");
var {
  S3_BUCKET_NAME: bucketName,
  S3_REGION: region,
  S3_ACCESS_KEY_ID: accessKeyId,
  S3_SECRET_ACCESS_KEY: secretAccessKey
} = process.env;
var keystone_default = withAuth(
  (0, import_core2.config)({
    server: {
      cors: { origin: "*", credentials: true }
    },
    db: {
      provider: "postgresql",
      url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ep-billowing-star-a584btzx.us-east-2.aws.neon.tech/delicious-vicious-dev?sslmode=require`
    },
    graphql: {
      playground: true,
      apolloConfig: { introspection: true },
      cors: { origin: "*", credentials: true }
    },
    lists,
    session,
    storage: {
      delicious_vicious_bucket: {
        kind: "s3",
        type: "image",
        bucketName: bucketName ? bucketName : "dev-bucket",
        region: region ? region : "global",
        accessKeyId,
        secretAccessKey,
        // The S3 links will be signed so they remain private
        signed: { expiry: 5e3 }
      }
    }
  })
);
//# sourceMappingURL=config.js.map
